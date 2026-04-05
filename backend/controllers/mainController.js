// ============================================================
// ELITE TRADING ACADEMY — ALL REMAINING CONTROLLERS
// ============================================================
const { Blog, Batch, Webinar, Coupon, Affiliate, AffiliateTrack,
  FranchiseLead, Testimonial, Resource, Gallery, Support, Career, QnA, Payout } = require('../models/index');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// ════════════════════════════════════════════════════════════
// BLOG CONTROLLER
// ════════════════════════════════════════════════════════════
exports.getBlogs = async (req, res, next) => {
  try {
    const { category, tag, search, page = 1, limit = 9, featured } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (tag)      query.tags = tag;
    if (featured) query.isFeatured = true;
    if (search)   query.$text = { $search: search };
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');
    const total = await Blog.countDocuments(query);
    res.json({ success: true, data: blogs, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } }, { new: true }
    ).populate('author', 'name avatar bio');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

exports.createBlog = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    if (req.body.isPublished) req.body.publishedAt = new Date();
    // Auto calc read time (avg 200 words/min)
    const wordCount = req.body.content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
    req.body.readTime = Math.ceil(wordCount / 200);
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) { next(err); }
};

exports.updateBlog = async (req, res, next) => {
  try {
    if (req.body.isPublished) req.body.publishedAt = req.body.publishedAt || new Date();
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: blog });
  } catch (err) { next(err); }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) { next(err); }
};

exports.adminGetBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 }).select('-content');
    res.json({ success: true, data: blogs });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// BATCH CONTROLLER
// ════════════════════════════════════════════════════════════
exports.getBatches = async (req, res, next) => {
  try {
    const { type, isActive = true } = req.query;
    const query = { isActive };
    if (type) query.type = type;
    const batches = await Batch.find(query).populate('instructor', 'name avatar').sort({ startDate: 1 });
    res.json({ success: true, data: batches });
  } catch (err) { next(err); }
};

exports.createBatch = async (req, res, next) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json({ success: true, data: batch });
  } catch (err) { next(err); }
};

exports.updateBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: batch });
  } catch (err) { next(err); }
};

exports.deleteBatch = async (req, res, next) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Batch deleted' });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// WEBINAR CONTROLLER
// ════════════════════════════════════════════════════════════
exports.getWebinars = async (req, res, next) => {
  try {
    const webinars = await Webinar.find({ isActive: true })
      .populate('host', 'name avatar')
      .sort({ scheduledAt: 1 });
    res.json({ success: true, data: webinars });
  } catch (err) { next(err); }
};

exports.getWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.params.id).populate('host', 'name avatar bio');
    if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' });
    // Only show meeting link to registered users
    const isRegistered = req.user && webinar.registeredUsers.includes(req.user.id);
    const isAdmin = req.user && ['admin','sub_admin','mentor'].includes(req.user.role);
    if (!isRegistered && !isAdmin && !webinar.isFree) {
      webinar.meetingLink = null;
      webinar.meetingId = null;
      webinar.meetingPassword = null;
    }
    res.json({ success: true, data: webinar, isRegistered });
  } catch (err) { next(err); }
};

exports.registerWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' });
    if (webinar.registeredUsers.includes(req.user.id))
      return res.status(400).json({ success: false, message: 'Already registered' });
    webinar.registeredUsers.push(req.user.id);
    await webinar.save();
    res.json({ success: true, message: 'Registered for webinar successfully!', meetingLink: webinar.meetingLink });
  } catch (err) { next(err); }
};

exports.createWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.create(req.body);
    res.status(201).json({ success: true, data: webinar });
  } catch (err) { next(err); }
};

exports.updateWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: webinar });
  } catch (err) { next(err); }
};

exports.deleteWebinar = async (req, res, next) => {
  try {
    await Webinar.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Webinar deleted' });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// COUPON CONTROLLER
// ════════════════════════════════════════════════════════════
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (coupon.endDate && coupon.endDate < new Date()) return res.status(400).json({ success: false, message: 'Coupon expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Coupon limit reached' });
    if (amount < coupon.minCartValue) return res.status(400).json({ success: false, message: `Min. cart value ₹${coupon.minCartValue}` });
    // Check per-user limit
    const userUsages = coupon.usedBy.filter(u => u.user.toString() === req.user.id).length;
    if (userUsages >= coupon.usagePerUser) return res.status(400).json({ success: false, message: 'Coupon already used' });
    let discount = 0;
    if (coupon.type === 'percentage') discount = Math.min((amount * coupon.value) / 100, coupon.maxDiscount || Infinity);
    else if (coupon.type === 'flat')  discount = Math.min(coupon.value, amount);
    else if (coupon.type === 'free')  discount = amount;
    res.json({ success: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, discount } });
  } catch (err) { next(err); }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// AFFILIATE CONTROLLER
// ════════════════════════════════════════════════════════════
exports.applyAffiliate = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    // Check ₹1000 purchase requirement
    const meetsRequirement = user.totalSpent >= 1000;
    if (!meetsRequirement)
      return res.status(400).json({ success: false, message: 'You need to purchase at least ₹1,000 worth of courses to become an affiliate. Contact admin for bypass.' });
    if (user.affiliateStatus !== 'not_applied')
      return res.status(400).json({ success: false, message: `Application already ${user.affiliateStatus}` });
    const code = user.generateAffiliateCode();
    user.affiliateStatus = 'pending';
    await user.save();
    await Affiliate.create({ user: user._id, code, status: 'pending' });
    res.json({ success: true, message: 'Affiliate application submitted! We will review within 24 hours.' });
  } catch (err) { next(err); }
};

exports.getMyAffiliate = async (req, res, next) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user.id });
    if (!affiliate) return res.status(404).json({ success: false, message: 'No affiliate account found' });
    const tracks = await AffiliateTrack.find({ affiliate: affiliate._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: { affiliate, tracks } });
  } catch (err) { next(err); }
};

exports.trackClick = async (req, res, next) => {
  try {
    const { code } = req.params;
    const affiliate = await Affiliate.findOne({ code, status: 'approved' });
    if (!affiliate) return res.status(404).json({ success: false, message: 'Invalid affiliate code' });
    affiliate.totalClicks += 1;
    await affiliate.save();
    await AffiliateTrack.create({ affiliate: affiliate._id, type: 'click', ip: req.ip, userAgent: req.headers['user-agent'] });
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.requestPayout = async (req, res, next) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user.id, status: 'approved' });
    if (!affiliate) return res.status(404).json({ success: false, message: 'No approved affiliate account' });
    if (affiliate.pendingEarnings < affiliate.minPayout)
      return res.status(400).json({ success: false, message: `Minimum payout is ₹${affiliate.minPayout}` });
    await Payout.create({ affiliate: affiliate._id, user: req.user.id, amount: affiliate.pendingEarnings, method: req.body.method || 'upi' });
    res.json({ success: true, message: 'Payout request submitted! Will be processed within 3-5 days.' });
  } catch (err) { next(err); }
};

exports.getAffiliates = async (req, res, next) => {
  try {
    const affiliates = await Affiliate.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: affiliates });
  } catch (err) { next(err); }
};

exports.updateAffiliate = async (req, res, next) => {
  try {
    const { status, globalCommission, adminBypass } = req.body;
    const affiliate = await Affiliate.findByIdAndUpdate(req.params.id, { status, globalCommission, adminBypass, approvedBy: req.user.id }, { new: true }).populate('user', 'name email');
    // Update user record
    await User.findByIdAndUpdate(affiliate.user._id, { affiliateStatus: status, isAffiliate: status === 'approved', affiliateCode: affiliate.code });
    // Send approval email
    if (status === 'approved') {
      await sendEmail({ to: affiliate.user.email, subject: '🎉 Affiliate Application Approved!', template: 'affiliateApproved', data: { name: affiliate.user.name, code: affiliate.code } });
    }
    res.json({ success: true, data: affiliate });
  } catch (err) { next(err); }
};

exports.adminBypassAffiliate = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const code = user.generateAffiliateCode();
    user.affiliateStatus = 'approved';
    user.isAffiliate = true;
    await user.save();
    const affiliate = await Affiliate.findOneAndUpdate(
      { user: user._id },
      { status: 'approved', adminBypass: true, approvedBy: req.user.id, code },
      { upsert: true, new: true }
    );
    await sendEmail({ to: user.email, subject: '🎉 Affiliate Application Approved!', template: 'affiliateApproved', data: { name: user.name, code } });
    res.json({ success: true, message: 'Affiliate approved with admin bypass', data: affiliate });
  } catch (err) { next(err); }
};

exports.getPayouts = async (req, res, next) => {
  try {
    const payouts = await Payout.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: payouts });
  } catch (err) { next(err); }
};

exports.processPayout = async (req, res, next) => {
  try {
    const payout = await Payout.findByIdAndUpdate(req.params.id, { status: req.body.status, transactionId: req.body.transactionId, processedBy: req.user.id }, { new: true });
    if (req.body.status === 'paid') {
      const affiliate = await Affiliate.findById(payout.affiliate);
      affiliate.paidEarnings    += payout.amount;
      affiliate.pendingEarnings -= payout.amount;
      await affiliate.save();
    }
    res.json({ success: true, data: payout });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// FRANCHISE CONTROLLER
// ════════════════════════════════════════════════════════════
exports.submitFranchiseLead = async (req, res, next) => {
  try {
    const lead = await FranchiseLead.create({ ...req.body, source: 'website' });
    // Send ack email to applicant
    await sendEmail({ to: lead.email, subject: 'Franchise Application Received - ELITE Trading Academy', template: 'franchiseLeadAck', data: { name: lead.name } });
    // TODO: Send WhatsApp notification to admin
    res.status(201).json({ success: true, message: 'Application submitted! We will contact you within 24-48 hours.' });
  } catch (err) { next(err); }
};

exports.getFranchiseLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const leads = await FranchiseLead.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await FranchiseLead.countDocuments(query);
    res.json({ success: true, data: leads, total });
  } catch (err) { next(err); }
};

exports.updateFranchiseLead = async (req, res, next) => {
  try {
    const lead = await FranchiseLead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: lead });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// TESTIMONIAL CONTROLLER
// ════════════════════════════════════════════════════════════
exports.getTestimonials = async (req, res, next) => {
  try {
    const { featured, type } = req.query;
    const query = { isActive: true };
    if (featured) query.isFeatured = true;
    if (type) query.type = type;
    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (err) { next(err); }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) { next(err); }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: testimonial });
  } catch (err) { next(err); }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// RESOURCE CONTROLLER
// ════════════════════════════════════════════════════════════
exports.getResources = async (req, res, next) => {
  try {
    const { type, tag, featured } = req.query;
    const query = { isActive: true };
    if (type)     query.type = type;
    if (tag)      query.tags = tag;
    if (featured) query.isFeatured = true;
    const resources = await Resource.find(query).sort({ order: 1 });
    res.json({ success: true, data: resources });
  } catch (err) { next(err); }
};

exports.createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (err) { next(err); }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: resource });
  } catch (err) { next(err); }
};

exports.deleteResource = async (req, res, next) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resource deleted' });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// GALLERY CONTROLLER
// ════════════════════════════════════════════════════════════
exports.getGallery = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    const gallery = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: gallery });
  } catch (err) { next(err); }
};

exports.createGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.deleteGalleryItem = async (req, res, next) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// SUPPORT CONTROLLER
// ════════════════════════════════════════════════════════════
exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await Support.create({ ...req.body, user: req.user?.id });
    res.status(201).json({ success: true, data: ticket, message: 'Support ticket created! We will respond within 24 hours.' });
  } catch (err) { next(err); }
};

exports.getTickets = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const query = {};
    if (status)   query.status = status;
    if (priority) query.priority = priority;
    const tickets = await Support.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (err) { next(err); }
};

exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Support.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (err) { next(err); }
};

exports.replyTicket = async (req, res, next) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    ticket.replies.push({ user: req.user.id, message: req.body.message, isAdmin: ['admin','sub_admin'].includes(req.user.role) });
    if (req.body.status) ticket.status = req.body.status;
    await ticket.save();
    res.json({ success: true, data: ticket });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// CAREER CONTROLLER
// ════════════════════════════════════════════════════════════
exports.getCareers = async (req, res, next) => {
  try {
    const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: careers });
  } catch (err) { next(err); }
};

exports.createCareer = async (req, res, next) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ success: true, data: career });
  } catch (err) { next(err); }
};

exports.updateCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: career });
  } catch (err) { next(err); }
};

exports.deleteCareer = async (req, res, next) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job listing deleted' });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// Q&A CONTROLLER
// ════════════════════════════════════════════════════════════
exports.getLessonQnA = async (req, res, next) => {
  try {
    const qna = await QnA.find({ course: req.params.courseId, lesson: req.params.lessonId })
      .populate('user', 'name avatar')
      .populate('answeredBy', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: qna });
  } catch (err) { next(err); }
};

exports.askQuestion = async (req, res, next) => {
  try {
    const question = await QnA.create({ course: req.params.courseId, lesson: req.params.lessonId, user: req.user.id, question: req.body.question });
    res.status(201).json({ success: true, data: question });
  } catch (err) { next(err); }
};

exports.answerQuestion = async (req, res, next) => {
  try {
    const qna = await QnA.findByIdAndUpdate(req.params.id, { answer: req.body.answer, answeredBy: req.user.id, isResolved: true }, { new: true });
    res.json({ success: true, data: qna });
  } catch (err) { next(err); }
};

// ════════════════════════════════════════════════════════════
// USER CONTROLLER (admin)
// ════════════════════════════════════════════════════════════
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role)   query.role = role;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).select('-password');
    const total = await User.countDocuments(query);
    res.json({ success: true, data: users, total });
  } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('enrolledCourses', 'title');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { role, permissions, isBlocked, isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role, permissions, isBlocked, isActive }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, city, bio, socialLinks, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, city, bio, socialLinks, avatar }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const { Payment } = require('../models/index');
    const [totalUsers, totalCourses, totalRevenue, totalEnrollments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      require('../models/Course').countDocuments({ isPublished: true }),
      Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Payment.countDocuments({ status: 'completed' })
    ]);
    res.json({ success: true, data: { totalUsers, totalCourses, totalRevenue: totalRevenue[0]?.total || 0, totalEnrollments } });
  } catch (err) { next(err); }
};
