import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { affiliateAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import toast from 'react-hot-toast';
import {
  FiLink,
  FiCopy,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiArrowRight,
  FiShare2,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function AffiliateHub() {
  const { user } = useAuthStore();
  const [affiliate, setAffiliate] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [requestingPayout, setRequestingPayout] = useState(false);

  const affiliateStatus = user?.affiliateStatus || 'not_applied';
  const referralLink = affiliate
    ? `${window.location.origin}?ref=${affiliate.code}`
    : '';

  useEffect(() => {
    if (affiliateStatus === 'approved') {
      affiliateAPI
        .getMy()
        .then((r) => {
          setAffiliate(r.data.data.affiliate);
          setTracks(r.data.data.tracks || []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [affiliateStatus]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await affiliateAPI.apply();
      toast.success(
        'Application submitted! We will review within 24 hours. 🎉',
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied! 🎉');
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=Join%20ELITE%20Trading%20Academy%20and%20learn%20to%20trade%20professionally!%20${encodeURIComponent(referralLink)}`,
    );
  };

  const requestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) < 500) {
      toast.error('Minimum payout is ₹500');
      return;
    }
    setRequestingPayout(true);
    try {
      await affiliateAPI.requestPayout({ method: 'upi' });
      toast.success('Payout requested! Processing in 3-5 days.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setRequestingPayout(false);
    }
  };

  // Not applied
  if (affiliateStatus === 'not_applied')
    return (
      <>
        <Helmet>
          <title>Affiliate Hub — ELITE Trading Academy</title>
        </Helmet>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Affiliate Programme
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Earn by referring students
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Join Our Affiliate Programme
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Earn 20% commission on every student you refer. Requirements:
              purchase courses worth ₹1,000+ or get admin approval.
            </p>
            <div className="bg-gray-800 rounded-xl p-4 mb-5 text-left space-y-2">
              <p className="text-sm text-gray-300 flex items-center gap-2">
                ✅ Purchase ₹1,000+ worth of courses
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                ✅ Complete email + phone verification
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                ✅ Apply and get approved
              </p>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              Your total spent:{' '}
              <span className="text-yellow-400 font-bold">
                ₹{user?.totalSpent?.toLocaleString() || 0}
              </span>
            </div>
            {(user?.totalSpent || 0) >= 1000 ? (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-60"
              >
                {applying ? 'Applying...' : 'Apply Now →'}
              </button>
            ) : (
              <div>
                <p className="text-gray-500 text-xs mb-3">
                  You need ₹{1000 - (user?.totalSpent || 0)} more in purchases
                  to qualify
                </p>
                <Link
                  to="/courses"
                  className="block w-full bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors text-center"
                >
                  Browse Courses{' '}
                  <FiArrowRight className="inline ml-1" size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </>
    );

  // Pending
  if (affiliateStatus === 'pending')
    return (
      <>
        <Helmet>
          <title>Affiliate Hub — ELITE Trading Academy</title>
        </Helmet>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Affiliate Hub</h1>
          </div>
          <div className="bg-gray-900 border border-yellow-500/20 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Application Under Review
            </h3>
            <p className="text-gray-400 text-sm">
              Your affiliate application is being reviewed. We'll notify you
              within 24 hours.
            </p>
          </div>
        </div>
      </>
    );

  // Approved
  return (
    <>
      <Helmet>
        <title>Affiliate Hub — ELITE Trading Academy</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Affiliate Hub</h1>
            <p className="text-gray-500 text-sm mt-1">
              Your earnings & referrals
            </p>
          </div>
          <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold px-3 py-1.5 rounded-full">
            ✅ Approved Affiliate
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Clicks',
              value: affiliate?.totalClicks || 0,
              icon: FiTrendingUp,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              label: 'Conversions',
              value: affiliate?.totalConversions || 0,
              icon: FiUsers,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
            },
            {
              label: 'Total Earned',
              value: `₹${affiliate?.totalEarnings?.toLocaleString() || 0}`,
              icon: FiDollarSign,
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
            },
            {
              label: 'Pending Payout',
              value: `₹${affiliate?.pendingEarnings?.toLocaleString() || 0}`,
              icon: FiDollarSign,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}
              >
                <s.icon size={18} className={s.color} />
              </div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Referral Link */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <FiLink size={16} className="text-yellow-400" /> Your Referral Link
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              readOnly
              value={referralLink || 'Loading...'}
              className="flex-1 bg-gray-800 border border-gray-600 text-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none"
            />
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors whitespace-nowrap"
            >
              <FiCopy size={14} /> Copy
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm hover:bg-green-500/20 transition-all"
            >
              <FiShare2 size={13} /> Share on WhatsApp
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm hover:bg-blue-500/20 transition-all"
            >
              <FiShare2 size={13} /> Copy & Share
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-3">
            Your affiliate code:{' '}
            <span className="text-yellow-400 font-bold tracking-wider">
              {affiliate?.code}
            </span>{' '}
            • 30-day cookie tracking
          </p>
        </div>

        {/* Payout Request */}
        {(affiliate?.pendingEarnings || 0) >= 500 && (
          <div className="bg-gray-900 border border-green-500/20 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-3">Request Payout</h3>
            <p className="text-gray-400 text-sm mb-4">
              Minimum payout: ₹500. Current available:{' '}
              <span className="text-green-400 font-bold">
                ₹{affiliate?.pendingEarnings?.toLocaleString()}
              </span>
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Amount to withdraw"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-600 focus:border-green-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder-gray-500"
              />
              <button
                onClick={requestPayout}
                disabled={requestingPayout}
                className="bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-green-400 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {requestingPayout ? 'Requesting...' : 'Request Payout'}
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Recent Activity</h3>
          {tracks.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              No activity yet. Start sharing your link!
            </p>
          ) : (
            <div className="space-y-3">
              {tracks.slice(0, 10).map((track, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0"
                >
                  <div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${track.type === 'conversion' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}
                    >
                      {track.type === 'conversion' ? '💰 Sale' : '👆 Click'}
                    </span>
                    <span className="text-gray-500 text-xs ml-2">
                      {new Date(track.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {track.commission > 0 && (
                    <span className="text-green-400 text-sm font-bold">
                      +₹{track.commission}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-gray-600 text-xs text-center">
          Commission is credited after a 30-day refund window. Minimum payout:
          ₹500.
        </p>
      </div>
    </>
  );
}
