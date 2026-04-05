const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name:             { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
  email:            { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  phone:            { type: String, unique: true, sparse: true, match: [/^[6-9]\d{9}$/, 'Invalid Indian phone number'] },
  password:         { type: String, minlength: 8, select: false },
  avatar:           { type: String, default: '' },
  role:             { type: String, enum: ['student', 'mentor', 'sub_admin', 'admin'], default: 'student' },
  authProvider:     { type: String, enum: ['local', 'google'], default: 'local' },
  googleId:         { type: String, sparse: true },

  // Verification
  isEmailVerified:  { type: Boolean, default: false },
  isPhoneVerified:  { type: Boolean, default: false },
  emailOTP:         String,
  emailOTPExpiry:   Date,
  phoneOTP:         String,
  phoneOTPExpiry:   Date,

  // Password reset
  resetPasswordToken:  String,
  resetPasswordExpiry: Date,

  // Sub-admin permissions
  permissions: {
    courses:      { type: Boolean, default: false },
    users:        { type: Boolean, default: false },
    blogs:        { type: Boolean, default: false },
    webinars:     { type: Boolean, default: false },
    payments:     { type: Boolean, default: false },
    coupons:      { type: Boolean, default: false },
    affiliates:   { type: Boolean, default: false },
    franchise:    { type: Boolean, default: false },
    gallery:      { type: Boolean, default: false },
    settings:     { type: Boolean, default: false },
    notifications:{ type: Boolean, default: false },
    support:      { type: Boolean, default: false },
    careers:      { type: Boolean, default: false }
  },

  // Student data
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  completedLessons:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  bookmarkedLessons:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  totalSpent:      { type: Number, default: 0 },
  purchases: [{
    item:       { type: mongoose.Schema.Types.ObjectId, refPath: 'purchases.itemType' },
    itemType:   { type: String, enum: ['Course', 'Batch', 'Webinar', 'Mentorship'] },
    amount:     Number,
    purchasedAt:{ type: Date, default: Date.now }
  }],

  // Affiliate
  isAffiliate:        { type: Boolean, default: false },
  affiliateStatus:    { type: String, enum: ['not_applied', 'pending', 'approved', 'rejected', 'suspended'], default: 'not_applied' },
  affiliateCode:      { type: String, unique: true, sparse: true },
  affiliateEarnings:  { type: Number, default: 0 },
  affiliatePaid:      { type: Number, default: 0 },

  // Mentor data
  bio:              String,
  expertise:        [String],
  socialLinks: {
    instagram: String,
    youtube:   String,
    linkedin:  String,
    twitter:   String,
    telegram:  String
  },

  // Metadata
  city:             String,
  country:          { type: String, default: 'India' },
  referredBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastLogin:        Date,
  isActive:         { type: Boolean, default: true },
  isBlocked:        { type: Boolean, default: false }
}, { timestamps: true });

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Generate Refresh Token
userSchema.methods.getRefreshToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });
};

// Generate OTP
userSchema.methods.generateOTP = function(type = 'email') {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  if (type === 'email') {
    this.emailOTP = otp;
    this.emailOTPExpiry = expiry;
  } else {
    this.phoneOTP = otp;
    this.phoneOTPExpiry = expiry;
  }
  return otp;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

// Generate affiliate code
userSchema.methods.generateAffiliateCode = function() {
  const code = 'ETA' + this.name.substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
  this.affiliateCode = code;
  return code;
};

module.exports = mongoose.model('User', userSchema);
