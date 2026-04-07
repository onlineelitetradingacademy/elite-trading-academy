import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { careerAPI, supportAPI } from '../../utils/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiBriefcase, FiMapPin, FiClock } from 'react-icons/fi';

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    careerAPI
      .getAll()
      .then((r) => setCareers(r.data.data || []))
      .catch(() => setCareers([]))
      .finally(() => setLoading(false));
  }, []);

  const onApply = async (data) => {
    setApplying(true);
    try {
      await supportAPI.create({
        ...data,
        subject: `Job Application: ${data.position}`,
        category: 'general',
      });
      toast.success('Application sent! We will review and contact you. 🎉');
      reset();
    } catch {
      toast.error('Failed to submit. Please email us directly.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Careers — ELITE Trading Academy</title>
      </Helmet>
      <section
        className="relative pt-28 pb-14 overflow-hidden"
        style={{ background: '#0A0A0F' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(240,165,0,0.1), transparent)',
          }}
        />
        <div className="container-custom relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
            💼 Join Our Team
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            CAREERS AT{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ELITE
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Be part of a growing team that's transforming trading education in
            India.
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: '#0A0A0F' }}>
        <div className="container-custom max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : careers.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl mb-10">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-white font-bold text-xl mb-2">
                No openings right now
              </h3>
              <p className="text-gray-500">
                We're always looking for talented people. Send your resume and
                we'll keep you in mind!
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-12">
              {careers.map((c, i) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-6 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">
                          {c.title}
                        </h3>
                        {c.isRemote && (
                          <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                            Remote
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        {c.department && (
                          <span className="flex items-center gap-1">
                            <FiBriefcase size={11} /> {c.department}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiMapPin size={11} /> {c.location}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <FiClock size={11} /> {c.type?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <a
                      href="#apply-form"
                      className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors whitespace-nowrap"
                    >
                      Apply Now
                    </a>
                  </div>
                  {c.description && (
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div
            id="apply-form"
            className="bg-gray-900 border border-gray-700 rounded-2xl p-8"
          >
            <h2 className="text-white font-bold text-2xl mb-6">
              Send Your Application
            </h2>
            <form onSubmit={handleSubmit(onApply)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                    {...register('name', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                    {...register('email', { required: true })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position Applying For *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Trading Mentor, Content Writer, etc."
                  className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                  {...register('position', { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Letter / Message *
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us about yourself and why you want to join ELITE Trading Academy..."
                  className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500 resize-none"
                  {...register('message', { required: true })}
                />
              </div>
              <button
                type="submit"
                disabled={applying}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl disabled:opacity-60 transition-all"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
