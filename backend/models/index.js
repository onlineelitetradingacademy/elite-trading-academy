const mongoose = require('mongoose');
const slugify = require('slugify');

// ── BLOG ──────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  slug:           { type: String, unique: true },
  excerpt:        String,
  content:        { type: String, required: true }, // rich text HTML
  thumbnail:      String,
  thumbnailId:    String,
  category:       { type: String, enum: ['market_analysis', 'forex', 'stocks', 'crypto', 'commodity', 'trading_tips', 'news', 'education'], default: 'market_analysis' },
  tags:           [String],
  author:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metaTitle:      String,
  metaDescription:String,
  metaKeywords:   [String],
  isPublished:    { type: Boolean, default: false },
  isFeatured:     { type: Boolean, default: false },
  publishedAt:    Date,
  views:          { type: Number, default: 0 },
  readTime:       Number // minutes
}, { timestamps: true });

blogSchema.pre('save', function(next) {
  if (this.isModified('title')) this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  next();
});
const Blog = mongoose.model('Blog', blogSchema);

// ── BATCH ─────────────────────────────────────────────────────────
const batchSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  course:         { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  type:           { type: String, enum: ['online', 'offline'], required: true },
  mode:           { type: String, enum: ['live', 'recorded'], default: 'live' },
  startDate:      { type: Date, required: true },
  endDate:        Date,
  schedule:       String, // e.g. "Mon, Wed, Fri 7:00 PM - 9:00 PM IST"
  totalSeats:     { type: Number, required: true },
  enrolledSeats:  { type: Number, default: 0 },
  price:          { type: Number, required: true },
  originalPrice:  Number,
  instructor:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  venue:          String,  // for offline
  zoomLink:       String,  // for online - admin controlled
  whatsappGroup:  String,
  telegramGroup:  String,
  isActive:       { type: Boolean, default: true },
  isFeatured:     { type: Boolean, default: false },
  enrolledStudents:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
const Batch = mongoose.model('Batch', batchSchema);

// ── WEBINAR ───────────────────────────────────────────────────────
const webinarSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  description:    String,
  thumbnail:      String,
  host:           { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledAt:    { type: Date, required: true },
  duration:       Number, // minutes
  platform:       { type: String, enum: ['zoom', 'google_meet', 'youtube_live', 'jitsi'], default: 'zoom' },
  meetingLink:    String, // admin sets this - changeable anytime
  meetingId:      String,
  meetingPassword:String,
  isFree:         { type: Boolean, default: true },
  price:          { type: Number, default: 0 },
  maxAttendees:   Number,
  registeredUsers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isRecorded:     { type: Boolean, default: false },
  recordingUrl:   String, // admin uploads after webinar
  status:         { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' },
  isActive:       { type: Boolean, default: true },
  reminderSent:   { type: Boolean, default: false }
}, { timestamps: true });
const Webinar = mongoose.model('Webinar', webinarSchema);

// ── PAYMENT ───────────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item:           { type: mongoose.Schema.Types.ObjectId, refPath: 'itemType' },
  itemType:       { type: String, enum: ['Course', 'Batch', 'Webinar', 'Mentorship'] },
  itemTitle:      String,
  amount:         { type: Number, required: true },
  currency:       { type: String, default: 'INR' },
  status:         { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  gateway:        { type: String, enum: ['razorpay', 'stripe'], default: 'razorpay' },
  razorpayOrderId:String,
  razorpayPaymentId:String,
  razorpaySignature:String,
  couponUsed:     { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  discountAmount: { type: Number, default: 0 },
  affiliateCode:  String,
  affiliateUser:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  affiliateCommission:Number,
  commissionPaid: { type: Boolean, default: false },
  refundReason:   String,
  refundedAt:     Date,
  receiptUrl:     String
}, { timestamps: true });
const Payment = mongoose.model('Payment', paymentSchema);

// ── COUPON ────────────────────────────────────────────────────────
const couponSchema = new mongoose.Schema({
  code:           { type: String, required: true, unique: true, uppercase: true },
  description:    String,
  type:           { type: String, enum: ['percentage', 'flat', 'free'], required: true },
  value:          { type: Number, required: true }, // % or flat amount
  maxDiscount:    Number, // cap for % coupons
  minCartValue:   { type: Number, default: 0 },
  usageLimit:     Number, // total uses allowed
  usagePerUser:   { type: Number, default: 1 },
  usedCount:      { type: Number, default: 0 },
  applicableTo:   { type: String, enum: ['all', 'specific'], default: 'all' },
  courses:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  isActive:       { type: Boolean, default: true },
  startDate:      Date,
  endDate:        Date,
  usedBy:         [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, usedAt: Date }]
}, { timestamps: true });
const Coupon = mongoose.model('Coupon', couponSchema);

// ── AFFILIATE ─────────────────────────────────────────────────────
const affiliateSchema = new mongoose.Schema({
  user:               { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  code:               { type: String, required: true, unique: true },
  status:             { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
  globalCommission:   { type: Number, default: 20 }, // %
  cookieDuration:     { type: Number, default: 30 }, // days
  totalClicks:        { type: Number, default: 0 },
  totalConversions:   { type: Number, default: 0 },
  totalEarnings:      { type: Number, default: 0 },
  pendingEarnings:    { type: Number, default: 0 },
  paidEarnings:       { type: Number, default: 0 },
  minPayout:          { type: Number, default: 500 },
  payoutDetails: {
    upiId:    String,
    bankName: String,
    accountNo:String,
    ifsc:     String,
    panCard:  String
  },
  adminBypass:        { type: Boolean, default: false },
  rejectionReason:    String,
  approvedBy:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
const Affiliate = mongoose.model('Affiliate', affiliateSchema);

// ── AFFILIATE CLICK/CONVERSION ────────────────────────────────────
const affiliateTrackSchema = new mongoose.Schema({
  affiliate:  { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate' },
  type:       { type: String, enum: ['click', 'conversion'] },
  ip:         String,
  userAgent:  String,
  payment:    { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  commission: Number,
  isPaid:     { type: Boolean, default: false }
}, { timestamps: true });
const AffiliateTrack = mongoose.model('AffiliateTrack', affiliateTrackSchema);

// ── FRANCHISE LEAD ────────────────────────────────────────────────
const franchiseLeadSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true },
  phone:          { type: String, required: true },
  city:           { type: String, required: true },
  profession:     String,
  investmentRange:{ type: String, enum: ['5L-10L', '10L-25L', '25L-50L', '50L+'] },
  message:        String,
  status:         { type: String, enum: ['new', 'contacted', 'qualified', 'rejected', 'converted'], default: 'new' },
  notes:          String,
  assignedTo:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  source:         { type: String, default: 'website' },
  utmSource:      String,
  utmCampaign:    String
}, { timestamps: true });
const FranchiseLead = mongoose.model('FranchiseLead', franchiseLeadSchema);

// ── TESTIMONIAL ───────────────────────────────────────────────────
const testimonialSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  city:       String,
  photo:      String,
  photoId:    String,
  rating:     { type: Number, min: 1, max: 5, default: 5 },
  text:       { type: String, required: true },
  course:     String,
  videoUrl:   String,
  type:       { type: String, enum: ['text', 'video', 'screenshot'], default: 'text' },
  screenshot: String, // WhatsApp/Telegram screenshot
  isActive:   { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order:      { type: Number, default: 0 }
}, { timestamps: true });
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// ── RESOURCE (Broker/Book/Merch) ──────────────────────────────────
const resourceSchema = new mongoose.Schema({
  type:         { type: String, enum: ['broker', 'book', 'merchandise', 'tool', 'indicator', 'bot'], required: true },
  title:        { type: String, required: true },
  description:  String,
  image:        String,
  imageId:      String,
  affiliateLink:String, // admin changes this anytime by typing
  guideVideoUrl:String, // for brokers
  rating:       Number,
  tags:         [String], // forex, stocks, crypto etc.
  badge:        String,   // "Recommended", "Most Popular"
  isActive:     { type: Boolean, default: true },
  isFeatured:   { type: Boolean, default: false },
  order:        { type: Number, default: 0 },
  // Book specific
  author:       String,
  // Merch specific
  price:        Number,
  externalStore:String
}, { timestamps: true });
const Resource = mongoose.model('Resource', resourceSchema);

// ── GALLERY ───────────────────────────────────────────────────────
const gallerySchema = new mongoose.Schema({
  type:       { type: String, enum: ['photo', 'video', 'award', 'telegram', 'podcast', 'event'], required: true },
  title:      String,
  url:        String,
  publicId:   String,
  thumbnail:  String,
  isActive:   { type: Boolean, default: true },
  order:      { type: Number, default: 0 }
}, { timestamps: true });
const Gallery = mongoose.model('Gallery', gallerySchema);

// ── SUPPORT TICKET ────────────────────────────────────────────────
const supportSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:       String,
  email:      String,
  phone:      String,
  subject:    { type: String, required: true },
  message:    { type: String, required: true },
  category:   { type: String, enum: ['course', 'payment', 'technical', 'general', 'franchise', 'affiliate'], default: 'general' },
  status:     { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  priority:   { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replies: [{
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message:    String,
    isAdmin:    Boolean,
    createdAt:  { type: Date, default: Date.now }
  }]
}, { timestamps: true });
const Support = mongoose.model('Support', supportSchema);

// ── CAREER ────────────────────────────────────────────────────────
const careerSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  department:   String,
  type:         { type: String, enum: ['full_time', 'part_time', 'freelance', 'internship'], default: 'full_time' },
  location:     { type: String, default: 'Ludhiana, Punjab' },
  isRemote:     { type: Boolean, default: false },
  description:  String,
  requirements: [String],
  isActive:     { type: Boolean, default: true }
}, { timestamps: true });
const Career = mongoose.model('Career', careerSchema);

// ── QNA (Course Lesson Q&A) ───────────────────────────────────────
const qnaSchema = new mongoose.Schema({
  course:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson:     { type: mongoose.Schema.Types.ObjectId, required: true },
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question:   { type: String, required: true },
  answer:     String,
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isResolved: { type: Boolean, default: false },
  upvotes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
const QnA = mongoose.model('QnA', qnaSchema);

// ── PAYOUT REQUEST ────────────────────────────────────────────────
const payoutSchema = new mongoose.Schema({
  affiliate:  { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:     { type: Number, required: true },
  status:     { type: String, enum: ['pending', 'processing', 'paid', 'rejected'], default: 'pending' },
  method:     { type: String, enum: ['upi', 'bank'], default: 'upi' },
  transactionId:String,
  processedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes:      String
}, { timestamps: true });
const Payout = mongoose.model('Payout', payoutSchema);

module.exports = {
  Blog, Batch, Webinar, Payment, Coupon,
  Affiliate, AffiliateTrack, FranchiseLead,
  Testimonial, Resource, Gallery,
  Support, Career, QnA, Payout
};
