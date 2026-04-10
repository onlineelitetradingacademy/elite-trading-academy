import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../../utils/api';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiGift,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Helmet } from 'react-helmet-async';

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.register(data);
      toast.success('Account created! Please verify your email.');
      navigate('/auth/verify-otp', {
        state: { userId: res.data.userId, email: data.email },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `https://api.elitetradingacademy.in/api/auth/google`;
  };

  return (
    <>
      <Helmet>
        <title>Join ELITE Trading Academy — Create Account</title>
      </Helmet>
      <div className="min-h-screen flex">
        {/* Left Visual */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden bg-dark-800 items-center justify-center">
          <div className="absolute inset-0 bg-hero-glow" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 px-16 text-center"
          >
            <div className="font-display text-8xl text-white/5 absolute top-10 left-1/2 -translate-x-1/2 select-none">
              ELITE
            </div>
            <div className="glass-card p-8 mb-8 animate-float">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-white font-bold text-xl mb-2">
                Join ELITE Trading Academy
              </h3>
              <p className="text-muted text-sm mb-6">
                Get instant access to our free beginner workshop
              </p>
              <div className="grid grid-cols-2 gap-4 text-left">
                {[
                  { icon: '📈', label: '5,000+ Students' },
                  { icon: '🏆', label: '95% Satisfaction' },
                  { icon: '🎯', label: '20+ Expert Courses' },
                  { icon: '🤝', label: 'Lifetime Support' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-gray-300 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FiGift size={16} className="text-gold" />
              <span className="text-sm text-muted">
                Free beginner workshop on signup
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex items-center justify-center p-8 pt-20 lg:pt-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Create Your Account
              </h1>
              <p className="text-muted">
                Start your journey to becoming an elite trader
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-dark-700 border border-dark-400 hover:border-dark-300 text-white py-3 px-4 rounded-lg mb-6 transition-all hover:bg-dark-600"
            >
              <FcGoogle size={20} />
              <span className="font-medium">Sign up with Google</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-dark-500" />
              <span className="text-muted text-sm">or sign up with email</span>
              <div className="flex-1 h-px bg-dark-500" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="input-field pl-10"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'At least 2 characters' },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-loss text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input-field pl-10"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Invalid email',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-loss text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number <span className="text-muted">(India)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <FiPhone className="text-muted" size={14} />
                    <span className="text-muted text-xs">+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    className="input-field pl-16"
                    {...register('phone', {
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Invalid Indian phone number',
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-loss text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="input-field pl-10 pr-10"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Min 8 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-loss text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Referral Code <span className="text-muted">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter referral code (if any)"
                  className="input-field uppercase"
                  {...register('referralCode')}
                />
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 accent-gold"
                  {...register('terms', { required: 'Please accept terms' })}
                />
                <label htmlFor="terms" className="text-sm text-muted">
                  I agree to the{' '}
                  <Link
                    to="/terms-of-service"
                    className="text-gold hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-gold hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-loss text-xs">{errors.terms.message}</p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="btn-gold w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-dark-900 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-muted text-sm mt-6">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-gold hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
