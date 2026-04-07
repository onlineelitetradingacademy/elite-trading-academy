import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { batchAPI } from '../../utils/api';
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiMapPin,
  FiMonitor,
  FiArrowRight,
} from 'react-icons/fi';

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    batchAPI
      .getAll({ isActive: true })
      .then((r) => setBatches(r.data.data || []))
      .catch(() => setBatches([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === 'all' ? batches : batches.filter((b) => b.type === filter);

  return (
    <>
      <Helmet>
        <title>Live Batches — ELITE Trading Academy</title>
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
            <FiCalendar size={12} /> Live Batches
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            UPCOMING{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              BATCHES
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Join our structured live batches — online and offline — with fixed
            schedules and mentor-led sessions.
          </p>
        </div>
      </section>

      <section className="py-10" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {['all', 'online', 'offline'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === f ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
              >
                {f === 'all'
                  ? 'All Batches'
                  : f === 'online'
                    ? '🖥️ Online'
                    : '🏢 Offline'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-white text-xl font-bold mb-2">
                No batches available
              </h3>
              <p className="text-gray-500 mb-6">
                Check back soon or contact us for the next batch schedule.
              </p>
              <Link
                to="/contact"
                className="bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl text-sm"
              >
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((batch, i) => (
                <motion.div
                  key={batch._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-6 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${batch.type === 'online' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}
                    >
                      {batch.type === 'online' ? (
                        <span className="flex items-center gap-1">
                          <FiMonitor size={11} /> Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FiMapPin size={11} /> Offline
                        </span>
                      )}
                    </span>
                    {batch.isFeatured && (
                      <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                        ⭐ Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-4">
                    {batch.title}
                  </h3>
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiCalendar size={14} className="text-yellow-400" />
                      Starts{' '}
                      {new Date(batch.startDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiClock size={14} className="text-yellow-400" />{' '}
                      {batch.schedule}
                    </div>
                    {batch.venue && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FiMapPin size={14} className="text-yellow-400" />{' '}
                        {batch.venue}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <FiUsers size={14} className="text-yellow-400" />
                      <span className="text-gray-400">Seats: </span>
                      <span
                        className={`font-semibold ${batch.totalSeats - batch.enrolledSeats < 5 ? 'text-red-400' : 'text-white'}`}
                      >
                        {batch.totalSeats - batch.enrolledSeats} left of{' '}
                        {batch.totalSeats}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full"
                        style={{
                          width: `${(batch.enrolledSeats / batch.totalSeats) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div>
                      <span className="text-yellow-400 font-bold text-2xl">
                        ₹{batch.price?.toLocaleString()}
                      </span>
                      {batch.originalPrice && (
                        <span className="text-gray-500 text-sm line-through ml-2">
                          ₹{batch.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Link
                      to="/contact"
                      className="flex items-center gap-1.5 bg-yellow-500 text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
                    >
                      Book Seat <FiArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
