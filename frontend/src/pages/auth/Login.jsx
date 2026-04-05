import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.login(data);
      setAuth(res.data.user, res.data.token, res.data.refreshToken);
      toast.success('Welcome back! 🎉');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      if (err.response?.data?.needsVerification) {
        toast.error('Please verify your email first');
        navigate('/auth/verify-otp', { state: { userId: err.response.data.userId } });
      } else {
        toast.error(msg);
      }
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/google`;
  };

  return (
    <>
      <Helmet><title>Login — ELITE Trading Academy</title></Helmet>
      <div className="min-h-screen flex">
        {/* Left Panel — Visual */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden bg-dark-800">
          <div className="absolute inset-0 bg-hero-glow" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
          {/* Animated candles */}
          <div className="absolute inset-0 flex items-end justify-center pb-0 opacity-20">
            <svg viewBox="0 0 600 400" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
              {[...Array(12)].map((_, i) => {
                const x = i * 50 + 20; const h = 60 + Math.random() * 100;
                const y = 360 - h; const up = i % 3 !== 1;
                return (
                  <g key={i} style={{ animation: `slide-up 0.5s ease-out ${i * 0.08}s both` }}>
                    <line x1={x + 8} y1={y - 15} x2={x + 8} y2={y + h + 15} stroke={up ? '#00C853' : '#FF3D57'} strokeWidth="2" />
                    <rect x={x} y={y} width="16" height={h} fill={up ? '#00C853' : '#FF3D57'} rx="2" opacity="0.9" />
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="relative z-10 flex flex-col justify-center px-16">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-5xl text-white mb-4 leading-tight">
                TRADE SMARTER.<br /><span className="text-gradient">EARN MORE.</span>
              </h2>
              <p className="text-muted text-lg mb-8">Join 5,000+ traders who have already transformed their financial future.</p>
              <div className="space-y-4">
                {['Expert-led courses in Forex, Stocks & Crypto', 'Live trading sessions with real-time guidance', 'Personal mentorship programme available', 'Bilingual content — Hindi & English'].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-gold" />
                    </div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="flex-1 flex items-center justify-center p-8 pt-20 lg:pt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-muted">Login to your ELITE Trading Academy account</p>
            </div>

            {/* Google Login */}
            <button onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-dark-700 border border-dark-400 hover:border-dark-300 text-white py-3 px-4 rounded-lg mb-6 transition-all hover:bg-dark-600">
              <FcGoogle size={20} />
              <span className="font-medium">Continue with Google</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-dark-500" />
              <span className="text-muted text-sm">or login with email</span>
              <div className="flex-1 h-px bg-dark-500" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input type="email" placeholder="you@example.com" className="input-field pl-10"
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                </div>
                {errors.email && <p className="text-loss text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <Link to="/auth/forgot-password" className="text-gold text-xs hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="input-field pl-10 pr-10"
                    {...register('password', { required: 'Password is required' })} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-loss text-xs mt-1">{errors.password.message}</p>}
              </div>

              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                className="btn-gold w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-dark-900 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>
                ) : (<><span>Login</span><FiArrowRight /></>)}
              </motion.button>
            </form>

            <p className="text-center text-muted text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-gold hover:underline font-medium">Create one free</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
