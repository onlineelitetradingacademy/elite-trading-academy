import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../context/store';
import { userAPI, authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCamera,
  FiSave,
  FiInstagram,
  FiYoutube,
  FiShield,
} from 'react-icons/fi';
import { SiTelegram } from 'react-icons/si';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      bio: user?.bio || '',
      'socialLinks.instagram': user?.socialLinks?.instagram || '',
      'socialLinks.youtube': user?.socialLinks?.youtube || '',
      'socialLinks.telegram': user?.socialLinks?.telegram || '',
    },
  });

  const {
    register: regPass,
    handleSubmit: handlePass,
    reset: resetPass,
    watch: watchPass,
    formState: { errors: passErrors },
  } = useForm();

  const onSubmitProfile = async (data) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        city: data.city,
        bio: data.bio,
        socialLinks: {
          instagram: data['socialLinks.instagram'],
          youtube: data['socialLinks.youtube'],
          telegram: data['socialLinks.telegram'],
        },
      };
      const res = await userAPI.updateProfile(payload);
      updateUser(res.data.data);
      toast.success('Profile updated successfully! ✅');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setChangingPass(true);
    try {
      await authAPI.forgotPassword({ email: user?.email });
      toast.success('Password reset link sent to your email!');
      resetPass();
    } catch {
      toast.error('Failed to send reset link');
    } finally {
      setChangingPass(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info' },
    { id: 'security', label: 'Security' },
    { id: 'purchases', label: 'Purchases' },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile — ELITE Trading Academy</title>
      </Helmet>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account information
          </p>
        </div>

        {/* Avatar Section */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 border-2 border-yellow-500/30 flex items-center justify-center text-yellow-400 text-3xl font-bold overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-500 rounded-lg flex items-center justify-center text-gray-900 hover:bg-yellow-400 transition-colors">
                <FiCamera size={12} />
              </button>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{user?.name}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full capitalize ${user?.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}
                >
                  {user?.role}
                </span>
                {user?.isEmailVerified && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <FiShield size={10} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmitProfile)}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-400 block mb-2 flex items-center gap-1.5">
                  <FiUser size={13} /> Full Name
                </label>
                <input
                  className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2 flex items-center gap-1.5">
                  <FiPhone size={13} /> Phone
                </label>
                <input
                  className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  {...register('phone')}
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2 flex items-center gap-1.5">
                <FiMail size={13} /> Email (cannot change)
              </label>
              <input
                readOnly
                value={user?.email}
                className="w-full bg-gray-800 border border-gray-600 text-gray-500 rounded-xl px-4 py-3 text-sm outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2 flex items-center gap-1.5">
                <FiMapPin size={13} /> City
              </label>
              <input
                placeholder="Your city"
                className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder-gray-600"
                {...register('city')}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Bio (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none placeholder-gray-600"
                {...register('bio')}
              />
            </div>
            <div className="pt-2 border-t border-gray-700">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Social Links (optional)
              </p>
              <div className="space-y-3">
                {[
                  {
                    icon: FiInstagram,
                    key: 'socialLinks.instagram',
                    placeholder: 'https://instagram.com/yourhandle',
                  },
                  {
                    icon: FiYoutube,
                    key: 'socialLinks.youtube',
                    placeholder: 'https://youtube.com/@yourchannel',
                  },
                  {
                    icon: SiTelegram,
                    key: 'socialLinks.telegram',
                    placeholder: 'https://t.me/yourgroup',
                  },
                ].map(({ icon: Icon, key, placeholder }) => (
                  <div key={key} className="relative">
                    <Icon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={15}
                    />
                    <input
                      placeholder={placeholder}
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-gray-600"
                      {...register(key)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-60 text-sm"
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <FiSave size={15} /> Save Changes
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5"
          >
            <h3 className="text-white font-bold">Change Password</h3>
            <p className="text-gray-400 text-sm">
              We'll send a password reset link to your registered email address.
            </p>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <FiMail size={14} className="text-yellow-400" /> Reset link will
                be sent to:{' '}
                <span className="text-white font-medium">{user?.email}</span>
              </p>
            </div>
            <button
              onClick={onSubmitPassword}
              disabled={changingPass}
              className="w-full bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-60 text-sm"
            >
              {changingPass ? 'Sending...' : 'Send Password Reset Link'}
            </button>
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-white font-semibold text-sm mb-3">
                Verification Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <FiMail size={13} /> Email
                  </span>
                  <span
                    className={`text-xs font-medium ${user?.isEmailVerified ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {user?.isEmailVerified ? '✅ Verified' : '❌ Not Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <FiPhone size={13} /> Phone
                  </span>
                  <span
                    className={`text-xs font-medium ${user?.isPhoneVerified ? 'text-green-400' : 'text-yellow-400'}`}
                  >
                    {user?.isPhoneVerified ? '✅ Verified' : '⚠️ Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
          >
            <h3 className="text-white font-bold mb-4">Purchase History</h3>
            {user?.purchases?.length === 0 || !user?.purchases ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">No purchases yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {user.purchases.map((purchase, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
                  >
                    <div>
                      <p className="text-white text-sm font-medium capitalize">
                        {purchase.itemType}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(purchase.purchasedAt).toLocaleDateString(
                          'en-IN',
                          { day: 'numeric', month: 'short', year: 'numeric' },
                        )}
                      </p>
                    </div>
                    <span className="text-yellow-400 font-bold text-sm">
                      ₹{purchase.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-semibold">
                    Total Spent
                  </span>
                  <span className="text-yellow-400 font-bold">
                    ₹{user?.totalSpent?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}
