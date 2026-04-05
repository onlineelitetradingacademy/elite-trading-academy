const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Payment, Coupon, Affiliate, AffiliateTrack } = require('../models/index');
const Course = require('../models/Course');
const { Batch, Webinar } = require('../models/index');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ── CREATE ORDER ──────────────────────────────────────────────────
exports.createOrder = async (req, res, next) => {
  try {
    const { itemId, itemType, couponCode, affiliateCode } = req.body;

    // Find item
    let item, itemTitle, originalAmount;
    if (itemType === 'Course') {
      item = await Course.findById(itemId);
      itemTitle = item?.title;
      originalAmount = item?.price;
    } else if (itemType === 'Batch') {
      item = await Batch.findById(itemId);
      itemTitle = item?.title;
      originalAmount = item?.price;
    } else if (itemType === 'Webinar') {
      item = await Webinar.findById(itemId);
      itemTitle = item?.title;
      originalAmount = item?.price;
    }

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (originalAmount === 0) return res.status(400).json({ success: false, message: 'This item is free' });

    // Apply coupon
    let discountAmount = 0;
    let couponDoc = null;
    if (couponCode) {
      couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (!couponDoc) return res.status(400).json({ success: false, message: 'Invalid coupon code' });
      if (couponDoc.endDate && couponDoc.endDate < new Date()) return res.status(400).json({ success: false, message: 'Coupon expired' });
      if (couponDoc.usageLimit && couponDoc.usedCount >= couponDoc.usageLimit) return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      if (originalAmount < couponDoc.minCartValue) return res.status(400).json({ success: false, message: `Minimum cart value ₹${couponDoc.minCartValue} required` });

      if (couponDoc.type === 'percentage') {
        discountAmount = Math.min((originalAmount * couponDoc.value) / 100, couponDoc.maxDiscount || Infinity);
      } else if (couponDoc.type === 'flat') {
        discountAmount = Math.min(couponDoc.value, originalAmount);
      } else if (couponDoc.type === 'free') {
        discountAmount = originalAmount;
      }
    }

    const finalAmount = Math.max(originalAmount - discountAmount, 0);

    // If fully discounted
    if (finalAmount === 0) {
      await grantAccess(req.user.id, itemId, itemType, 0, discountAmount, couponDoc);
      return res.json({ success: true, free: true, message: 'Enrolled for free with coupon!' });
    }

    // Razorpay order
    const order = await razorpay.orders.create({
      amount:   finalAmount * 100, // paise
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
      notes:    { userId: req.user.id, itemId, itemType, couponCode, affiliateCode }
    });

    // Save pending payment
    const payment = await Payment.create({
      user: req.user.id, item: itemId, itemType, itemTitle,
      amount: finalAmount, discountAmount,
      couponUsed: couponDoc?._id,
      affiliateCode,
      razorpayOrderId: order.id,
      status: 'pending'
    });

    res.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      key: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
      originalAmount, discountAmount, finalAmount
    });
  } catch (err) { next(err); }
};

// ── VERIFY PAYMENT ────────────────────────────────────────────────
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSignature !== razorpaySignature)
      return res.status(400).json({ success: false, message: 'Payment verification failed' });

    // Update payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'completed';
    await payment.save();

    // Grant access
    await grantAccess(payment.user, payment.item, payment.itemType, payment.amount, payment.discountAmount, null, payment.couponUsed);

    // Handle affiliate commission
    if (payment.affiliateCode) {
      const affiliate = await Affiliate.findOne({ code: payment.affiliateCode, status: 'approved' });
      if (affiliate && affiliate.user.toString() !== payment.user.toString()) {
        const commissionRate = affiliate.globalCommission / 100;
        const commission = Math.round(payment.amount * commissionRate);
        affiliate.totalEarnings  += commission;
        affiliate.pendingEarnings += commission;
        affiliate.totalConversions += 1;
        await affiliate.save();
        payment.affiliateUser = affiliate.user;
        payment.affiliateCommission = commission;
        await payment.save();
        await AffiliateTrack.create({ affiliate: affiliate._id, type: 'conversion', payment: payment._id, commission });
      }
    }

    // Send confirmation email
    const user = await User.findById(payment.user);
    await sendEmail({ to: user.email, subject: '🎓 Enrollment Confirmed - ELITE Trading Academy', template: 'enrollmentConfirmation', data: { name: user.name, courseName: payment.itemTitle, amount: payment.amount } });

    res.json({ success: true, message: 'Payment verified! Access granted.', payment });
  } catch (err) { next(err); }
};

// ── GRANT ACCESS HELPER ───────────────────────────────────────────
async function grantAccess(userId, itemId, itemType, amount, discountAmount, couponDoc, couponId) {
  const user = await User.findById(userId);

  if (itemType === 'Course' && !user.enrolledCourses.includes(itemId)) {
    user.enrolledCourses.push(itemId);
    await Course.findByIdAndUpdate(itemId, { $inc: { enrolledCount: 1 } });
  } else if (itemType === 'Batch') {
    await Batch.findByIdAndUpdate(itemId, { $addToSet: { enrolledStudents: userId }, $inc: { enrolledSeats: 1 } });
  } else if (itemType === 'Webinar') {
    await Webinar.findByIdAndUpdate(itemId, { $addToSet: { registeredUsers: userId } });
  }

  user.totalSpent += amount;
  user.purchases.push({ item: itemId, itemType, amount, purchasedAt: new Date() });
  await user.save();

  // Update coupon usage
  const coupon = couponDoc || (couponId ? await Coupon.findById(couponId) : null);
  if (coupon) {
    coupon.usedCount += 1;
    coupon.usedBy.push({ user: userId, usedAt: new Date() });
    await coupon.save();
  }
}

// ── GET MY PAYMENTS ───────────────────────────────────────────────
exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id, status: 'completed' }).sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (err) { next(err); }
};

// ── ADMIN: GET ALL PAYMENTS ───────────────────────────────────────
exports.getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const payments = await Payment.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Payment.countDocuments(query);
    const revenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ success: true, data: payments, total, totalRevenue: revenue[0]?.total || 0 });
  } catch (err) { next(err); }
};

// ── ADMIN: REVENUE ANALYTICS ──────────────────────────────────────
exports.getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;
    const groupBy = period === 'daily' ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      : period === 'weekly' ? { $week: '$createdAt' }
      : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

    const [revenueByPeriod, revenueByType, topCourses, recentStats] = await Promise.all([
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: groupBy, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }, { $limit: 12 }
      ]),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$itemType', revenue: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'completed', itemType: 'Course' } },
        { $group: { _id: '$itemTitle', revenue: { $sum: '$amount' }, enrollments: { $sum: 1 } } },
        { $sort: { revenue: -1 } }, { $limit: 5 }
      ]),
      Payment.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: null, revenue: { $sum: '$amount' }, count: { $sum: 1 } } }
      ])
    ]);

    res.json({ success: true, data: { revenueByPeriod, revenueByType, topCourses, last30Days: recentStats[0] || { revenue: 0, count: 0 } } });
  } catch (err) { next(err); }
};
