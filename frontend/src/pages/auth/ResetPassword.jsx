// ResetPassword.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export function ResetPassword() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, { password });
      setAuth(res.data.user, res.data.token, res.data.refreshToken);
      toast.success('Password reset successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-muted mb-8">Enter your new password below.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" className="input-field pl-10 pr-10"
                {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Min 8 characters' } })} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-loss text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input type={showPass ? 'text' : 'password'} placeholder="Repeat your password" className="input-field pl-10"
                {...register('confirmPassword', { validate: v => v === watch('password') || 'Passwords do not match' })} />
            </div>
            {errors.confirmPassword && <p className="text-loss text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-60">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
export default ResetPassword;
