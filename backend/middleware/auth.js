const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Protect routes (must be logged in) ───────────────────────────
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, please login' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    if (req.user.isBlocked) return res.status(403).json({ success: false, message: 'Account blocked. Contact support.' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// ── Role-based access ─────────────────────────────────────────────
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Access denied for role: ${req.user.role}` });
  }
  next();
};

// ── Admin only ────────────────────────────────────────────────────
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// ── Sub-admin permission check ────────────────────────────────────
exports.checkPermission = (permission) => (req, res, next) => {
  if (req.user.role === 'admin') return next(); // admin has all permissions
  if (req.user.role === 'sub_admin' && req.user.permissions?.[permission]) return next();
  return res.status(403).json({ success: false, message: `No permission for: ${permission}` });
};

// ── Enrolled in course ────────────────────────────────────────────
exports.isEnrolled = async (req, res, next) => {
  const courseId = req.params.courseId || req.params.id;
  const isEnrolled = req.user.enrolledCourses.some(c => c.toString() === courseId);
  const isAdmin = ['admin', 'sub_admin', 'mentor'].includes(req.user.role);
  if (!isEnrolled && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Please enroll in this course to access content' });
  }
  next();
};

// ── Optional auth (attach user if token present, continue regardless) ──
exports.optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
  else if (req.cookies?.token) token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (_) {}
  }
  next();
};
