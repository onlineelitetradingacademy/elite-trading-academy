const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// ── Helper: send token response ───────────────────────────────────
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000)
  };
  res.status(statusCode)
    .cookie('token', token, options)
    .cookie('refreshToken', refreshToken, { ...options, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
    .json({
      success: true, message, token, refreshToken,
      user: {
        id: user._id, name: user.name, email: user.email, phone: user.phone,
        avatar: user.avatar, role: user.role, permissions: user.permissions,
        isEmailVerified: user.isEmailVerified, isPhoneVerified: user.isPhoneVerified,
        enrolledCourses: user.enrolledCourses, affiliateCode: user.affiliateCode
      }
    });
};

// ── REGISTER ──────────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;

    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'Email already registered' });
    if (phone && await User.findOne({ phone })) return res.status(400).json({ success: false, message: 'Phone already registered' });

    // Find referrer
    let referredBy;
    if (referralCode) {
      const referrer = await User.findOne({ affiliateCode: referralCode });
      if (referrer) referredBy = referrer._id;
    }

    const user = await User.create({ name, email, phone, password, referredBy, authProvider: 'local' });

    // Send email OTP
    const otp = user.generateOTP('email');
    await user.save();
    await sendEmail({ to: email, subject: 'Verify your ELITE Trading Academy account', template: 'emailOTP', data: { name, otp } });

    res.status(201).json({ success: true, message: 'Registration successful! Check your email for OTP.', userId: user._id });
  } catch (err) { next(err); }
};

// ── VERIFY EMAIL OTP ──────────────────────────────────────────────
exports.verifyEmailOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.emailOTP !== otp || user.emailOTPExpiry < Date.now())
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;
    await user.save();

    await sendEmail({ to: user.email, subject: 'Welcome to ELITE Trading Academy! 🎉', template: 'welcome', data: { name: user.name } });
    sendTokenResponse(user, 200, res, 'Email verified successfully!');
  } catch (err) { next(err); }
};

// ── RESEND OTP ────────────────────────────────────────────────────
exports.resendOTP = async (req, res, next) => {
  try {
    const { userId, type = 'email' } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const otp = user.generateOTP(type);
    await user.save();
    if (type === 'email') {
      await sendEmail({ to: user.email, subject: 'Your ELITE Trading Academy OTP', template: 'emailOTP', data: { name: user.name, otp } });
    }
    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (err) { next(err); }
};

// ── LOGIN ─────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isEmailVerified)
      return res.status(401).json({ success: false, message: 'Please verify your email first', userId: user._id, needsVerification: true });

    if (user.isBlocked) return res.status(403).json({ success: false, message: 'Account blocked. Contact support.' });

    user.lastLogin = new Date();
    await user.save();
    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (err) { next(err); }
};

// ── PHONE OTP LOGIN ───────────────────────────────────────────────
exports.sendPhoneOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    let user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: 'Phone number not registered' });
    const otp = user.generateOTP('phone');
    await user.save();
    // TODO: Send via MSG91 - integrate when SMTP is ready
    // For now, return OTP in development
    const response = { success: true, message: 'OTP sent to your phone', userId: user._id };
    if (process.env.NODE_ENV === 'development') response.otp = otp; // remove in production
    res.json(response);
  } catch (err) { next(err); }
};

exports.verifyPhoneOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.phoneOTP !== otp || user.phoneOTPExpiry < Date.now())
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    user.isPhoneVerified = true;
    user.phoneOTP = undefined;
    user.phoneOTPExpiry = undefined;
    user.lastLogin = new Date();
    await user.save();
    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (err) { next(err); }
};

// ── GOOGLE OAUTH CALLBACK ─────────────────────────────────────────
exports.googleCallback = async (req, res) => {
  try {
    const token = req.user.getSignedJwtToken();
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/auth/login?error=google_auth_failed`);
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.cookie('refreshToken', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
};

// ── GET CURRENT USER ──────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses', 'title thumbnail slug');
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// ── FORGOT PASSWORD ───────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'No account with that email' });
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    await sendEmail({ to: user.email, subject: 'ELITE Trading Academy - Password Reset', template: 'resetPassword', data: { name: user.name, resetUrl } });
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (err) { next(err); }
};

// ── RESET PASSWORD ────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (err) { next(err); }
};

// ── REFRESH TOKEN ─────────────────────────────────────────────────
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || req.cookies;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    sendTokenResponse(user, 200, res, 'Token refreshed');
  } catch (err) { next(err); }
};
