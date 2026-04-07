import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { franchiseAPI } from '../../utils/api';
import { FiCheckCircle, FiArrowRight, FiLock } from 'react-icons/fi';

const benefits = [
  {
    icon: '📚',
    title: 'Complete Course Material',
    desc: 'Full curriculum, study materials and lesson plans provided.',
  },
  {
    icon: '👨‍🏫',
    title: 'Mentor Training',
    desc: 'Comprehensive training for you and your staff by our experts.',
  },
  {
    icon: '💻',
    title: 'Tech Platform Access',
    desc: 'Full access to our LMS, student dashboard and admin tools.',
  },
  {
    icon: '📣',
    title: 'Marketing Support',
    desc: 'Ad campaign support, creatives and brand identity kit.',
  },
  {
    icon: '🏷️',
    title: 'Brand Identity Kit',
    desc: 'Complete branding materials to set up your centre.',
  },
  {
    icon: '🔄',
    title: 'Ongoing Support',
    desc: 'Continuous backend support, updates and new content.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Apply',
    desc: 'Fill the application form with your details and interest.',
  },
  {
    step: '02',
    title: 'Screening Call',
    desc: 'Our team will schedule an initial consultation call.',
  },
  {
    step: '03',
    title: 'Onboarding',
    desc: 'Complete documentation, training and launch your centre.',
  },
];

export default function Franchise() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await franchiseAPI.submit(data);
      setSubmitted(true);
      toast.success(
        'Application submitted! We will contact you within 24-48 hours. 🎉',
      );
    } catch {
      toast.error('Submission failed. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Franchise Programme — ELITE Trading Academy</title>
      </Helmet>

      {/* Hero */}
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
            🤝 Franchise Programme
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white mb-6 tracking-wide leading-tight">
            BUILD YOUR OWN
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TRADING ACADEMY
            </span>
          </h1>
          <p className="text-gray-400 text-xl mb-8 max-w-xl mx-auto leading-relaxed">
            Partner with ELITE Trading Academy. You invest in setup — we empower
            you with everything else.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors text-base"
          >
            Apply for Franchise <FiArrowRight />
          </a>
        </div>
      </section>

      {/* What we provide */}
      <section className="py-20 bg-gray-900 border-y border-gray-700">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-white mb-3">
              WHAT WE{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                PROVIDE
              </span>
            </h2>
            <p className="text-gray-400">
              Everything you need to run a successful trading academy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800 border border-gray-600 hover:border-yellow-500/30 rounded-2xl p-6 transition-all"
              >
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-white mb-3">
              HOW IT{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                WORKS
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
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
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700 px-5 py-3 rounded-xl text-sm text-gray-400">
              <FiLock size={14} className="text-yellow-400" />
              Complete business details shared only after initial screening call
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section
        id="apply"
        className="py-20 bg-gray-900 border-t border-gray-700"
      >
        <div className="container-custom max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl text-white mb-3">
              APPLY{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                NOW
              </span>
            </h2>
            <p className="text-gray-400">
              Fill the form below. We will contact you within 24-48 hours.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-green-500/30 rounded-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle size={40} className="text-green-400" />
              </div>
              <h3 className="text-white font-bold text-2xl mb-2">
                Application Received!
              </h3>
              <p className="text-gray-400">
                Our team will contact you within 24-48 hours for an initial
                screening call. Please keep your phone available.
              </p>
            </motion.div>
          ) : (
            <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                      {...register('name', { required: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="Your city"
                      className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                      {...register('city', { required: true })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                      {...register('phone', { required: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                      {...register('email', { required: true })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Profession
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Business Owner, Professional, etc."
                    className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                    {...register('profession')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Investment Capacity
                  </label>
                  <select
                    className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all"
                    {...register('investmentRange')}
                  >
                    <option value="">Select range</option>
                    <option value="5L-10L">₹5L – ₹10L</option>
                    <option value="10L-25L">₹10L – ₹25L</option>
                    <option value="25L-50L">₹25L – ₹50L</option>
                    <option value="50L+">₹50L+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Why are you interested?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your motivation and vision..."
                    className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500 resize-none"
                    {...register('message')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                >
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <FiArrowRight size={16} /> Submit Application
                    </>
                  )}
                </button>
                <p className="text-gray-500 text-xs text-center">
                  🔒 Your information is confidential and will only be used for
                  screening purposes.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
