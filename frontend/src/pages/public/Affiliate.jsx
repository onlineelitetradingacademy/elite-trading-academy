import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../context/store';
import { affiliateAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  FiCheckCircle,
  FiArrowRight,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiLink,
} from 'react-icons/fi';

const benefits = [
  {
    icon: FiDollarSign,
    title: 'Earn 20% Commission',
    desc: 'Get 20% on every successful referral. Commission credited after 30-day refund window.',
  },
  {
    icon: FiLink,
    title: 'Unique Referral Link',
    desc: 'Your personal tracked link with 30-day cookie duration.',
  },
  {
    icon: FiUsers,
    title: 'Leaderboard & Rewards',
    desc: 'Top affiliates get featured and earn bonus rewards.',
  },
  {
    icon: FiTrendingUp,
    title: 'Real-time Dashboard',
    desc: 'Track clicks, conversions and earnings live.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Purchase ₹1,000+',
    desc: 'Buy any course worth ₹1,000 or more to qualify.',
  },
  {
    step: '02',
    title: 'Apply',
    desc: 'Apply from your dashboard. Get approved within 24 hours.',
  },
  {
    step: '03',
    title: 'Share & Earn',
    desc: 'Share your link and earn 20% commission on every sale.',
  },
];

export default function Affiliate() {
  const { isAuthenticated, user } = useAuthStore();
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    setApplying(true);
    try {
      await affiliateAPI.apply();
      toast.success(
        'Application submitted! You will hear back within 24 hours. 🎉',
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Affiliate Programme — ELITE Trading Academy</title>
      </Helmet>

      <section
        className="relative pt-28 pb-20 overflow-hidden"
        style={{ background: '#0A0A0F' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(240,165,0,0.15), transparent)',
          }}
        />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
            💰 Earn With Us
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white mb-6 tracking-wide">
            EARN BY{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              REFERRING
            </span>
          </h1>
          <p className="text-gray-400 text-xl mb-8 max-w-xl mx-auto">
            Share ELITE Trading Academy with your network and earn 20%
            commission on every successful referral.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <button
                onClick={handleApply}
                disabled={applying}
                className="bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-60"
              >
                {applying ? 'Applying...' : 'Apply Now →'}
              </button>
            ) : (
              <Link
                to="/auth/register"
                className="bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-2"
              >
                Get Started <FiArrowRight />
              </Link>
            )}
            <Link
              to="/dashboard/affiliate"
              className="border border-yellow-500/40 text-yellow-400 font-semibold px-8 py-4 rounded-xl hover:bg-yellow-500/10 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 border-y border-gray-700">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-white mb-3">
              WHY JOIN OUR{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                PROGRAMME
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800 border border-gray-600 hover:border-yellow-500/30 rounded-2xl p-6 text-center transition-all"
              >
                <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <b.icon size={22} className="text-yellow-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-white mb-3">
              HOW TO{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                JOIN
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center font-display text-gray-900 text-2xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Eligibility box */}
          <div className="max-w-xl mx-auto bg-gray-900 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-yellow-400" /> Eligibility
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <FiCheckCircle
                  size={14}
                  className="text-green-400 flex-shrink-0 mt-0.5"
                />{' '}
                Purchase at least ₹1,000 worth of any product on our platform
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <FiCheckCircle
                  size={14}
                  className="text-green-400 flex-shrink-0 mt-0.5"
                />{' '}
                Complete email and phone verification
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <FiCheckCircle
                  size={14}
                  className="text-green-400 flex-shrink-0 mt-0.5"
                />{' '}
                Submit application and get admin approval
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <FiCheckCircle
                  size={14}
                  className="text-yellow-400 flex-shrink-0 mt-0.5"
                />{' '}
                Already a non-student? Contact us for a special bypass
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
