// ── VerifyOTP.jsx ─────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import { Helmet } from 'react-helmet-async';

export function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email } = location.state || {};
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
    if (next.every(d => d) && next.join('').length === 6) verify(next.join(''));
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = async (code) => {
    setLoading(true);
    try {
      const res = await authAPI.verifyEmail({ userId, otp: code });
      setAuth(res.data.user, res.data.token, res.data.refreshToken);
      toast.success('Email verified! Welcome to ELITE Trading Academy! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const resend = async () => {
    try {
      await authAPI.resendOTP({ userId, type: 'email' });
      toast.success('OTP resent!');
      setResendTimer(60);
    } catch { toast.error('Failed to resend OTP'); }
  };

  return (
    <>
      <Helmet><title>Verify Email — ELITE Trading Academy</title></Helmet>
      <div className="min-h-screen flex items-center justify-center p-8 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">📧</div>
          <h1 className="text-3xl font-bold text-white mb-3">Verify Your Email</h1>
          <p className="text-muted mb-2">Enter the 6-digit OTP sent to</p>
          <p className="text-gold font-semibold mb-8">{email || 'your email'}</p>
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, i) => (
              <input key={i} ref={el => inputs.current[i] = el} type="text" maxLength={1} value={digit}
                onChange={e => handleChange(e.target.value, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-dark-700 text-white outline-none transition-all ${digit ? 'border-gold' : 'border-dark-400'} focus:border-gold focus:ring-2 focus:ring-gold/20`} />
            ))}
          </div>
          {loading && (
            <div className="flex justify-center gap-1 mb-4">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
            </div>
          )}
          <p className="text-muted text-sm">
            Didn't receive it?{' '}
            {resendTimer > 0
              ? <span className="text-gray-400">Resend in {resendTimer}s</span>
              : <button onClick={resend} className="text-gold hover:underline font-medium">Resend OTP</button>}
          </p>
          <p className="text-muted text-xs mt-4">OTP expires in 10 minutes</p>
        </motion.div>
      </div>
    </>
  );
}
export default VerifyOTP;
