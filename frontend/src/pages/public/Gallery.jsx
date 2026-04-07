import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { galleryAPI } from '../../utils/api';

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'photo', label: '📸 Photos' },
  { value: 'video', label: '🎥 Videos' },
  { value: 'award', label: '🏆 Awards' },
  { value: 'event', label: '🎪 Events' },
  { value: 'telegram', label: '💬 Telegram' },
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const params = filter !== 'all' ? { type: filter } : {};
    galleryAPI
      .getAll(params)
      .then((r) => setItems(r.data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <>
      <Helmet>
        <title>Gallery — ELITE Trading Academy</title>
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
            📸 Our Moments
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GALLERY
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Photos, videos, awards and moments from our trading academy journey.
          </p>
        </div>
      </section>

      <section className="py-10" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilter(t.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === t.value ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-900 border border-gray-700 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className="text-white text-xl font-bold mb-2">
                Gallery coming soon
              </h3>
              <p className="text-gray-500">
                Our team is uploading memories. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(item)}
                  className="aspect-square bg-gray-900 border border-gray-700 rounded-xl overflow-hidden cursor-pointer group hover:border-yellow-500/30 transition-all"
                >
                  {item.url ? (
                    item.type === 'video' ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🖼️
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full"
          >
            {selected.type === 'video' ? (
              <video
                src={selected.url}
                controls
                autoPlay
                className="w-full rounded-2xl"
              />
            ) : (
              <img
                src={selected.url}
                alt={selected.title}
                className="w-full rounded-2xl"
              />
            )}
            {selected.title && (
              <p className="text-white text-center mt-3 font-medium">
                {selected.title}
              </p>
            )}
            <button
              onClick={() => setSelected(null)}
              className="block mx-auto mt-4 text-gray-400 hover:text-white text-sm"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
