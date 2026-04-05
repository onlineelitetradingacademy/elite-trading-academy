// authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', auth.register);
router.post('/verify-email', auth.verifyEmailOTP);
router.post('/resend-otp', auth.resendOTP);
router.post('/login', auth.login);
router.post('/phone-otp', auth.sendPhoneOTP);
router.post('/verify-phone', auth.verifyPhoneOTP);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }), auth.googleCallback);
router.post('/logout', protect, auth.logout);
router.get('/me', protect, auth.getMe);
router.post('/forgot-password', auth.forgotPassword);
router.put('/reset-password/:token', auth.resetPassword);
router.post('/refresh-token', auth.refreshToken);

module.exports = router;
