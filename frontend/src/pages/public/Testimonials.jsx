import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { testimonialAPI } from '../../utils/api';
import { FiStar, FiArrowRight } from 'react-icons/fi';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    testimonialAPI
      .getAll()
      .then((r) => setTestimonials(r.data.data || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === 'all'
      ? testimonials
      : testimonials.filter((t) => t.type === filter);

  return (
    <>
      <Helmet>
        <title>Student Testimonials — ELITE Trading Academy</title>
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
            ⭐ Success Stories
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            STUDENT{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              RESULTS
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Real stories from real traders who transformed their financial
            future.
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {['all', 'text', 'video', 'screenshot'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filter === f ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
              >
                {f === 'all' ? 'All Reviews' : f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((t, i) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-6 transition-all flex flex-col"
                >
                  {t.type === 'video' && t.videoUrl ? (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <video
                        src={t.videoUrl}
                        controls
                        className="w-full rounded-xl"
                      />
                    </div>
                  ) : t.type === 'screenshot' && t.screenshot ? (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img
                        src={t.screenshot}
                        alt="Result"
                        className="w-full rounded-xl"
                      />
                    </div>
                  ) : null}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <FiStar
                        key={j}
                        size={14}
                        className="text-yellow-400"
                        style={{ fill: '#FACC15' }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1 italic mb-4">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-700">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold overflow-hidden">
                      {t.photo ? (
                        <img
                          src={t.photo}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        t.name?.[0]
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {t.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {t.city}
                        {t.course ? ` · ${t.course}` : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <h3 className="text-white font-bold text-2xl mb-3">
              Ready to write your success story?
            </h3>
            <p className="text-gray-400 mb-6">
              Join thousands of traders who changed their financial future with
              us.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Start Learning <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
