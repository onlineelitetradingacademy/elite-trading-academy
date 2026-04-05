// ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../../utils/api';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-6">✉️</div>
            <h1 className="text-2xl font-bold text-white mb-3">Check Your Email</h1>
            <p className="text-muted mb-6">We've sent password reset instructions to your email. The link expires in 10 minutes.</p>
            <Link to="/auth/login" className="btn-gold inline-flex items-center gap-2 px-6 py-3"><FiArrowLeft size={16} /> Back to Login</Link>
          </div>
        ) : (
          <>
            <Link to="/auth/login" className="flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 text-sm">
              <FiArrowLeft size={14} /> Back to login
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-muted mb-8">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input type="email" placeholder="you@example.com" className="input-field pl-10"
                    {...register('email', { required: 'Email is required' })} />
                </div>
                {errors.email && <p className="text-loss text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
export default ForgotPassword;
