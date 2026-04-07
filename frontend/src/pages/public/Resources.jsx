import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { resourceAPI } from '../../utils/api';
import {
  FiExternalLink,
  FiPlay,
  FiStar,
  FiBookOpen,
  FiArrowRight,
} from 'react-icons/fi';

const tabs = [
  { value: 'broker', label: 'Recommended Brokers', emoji: '🏦' },
  { value: 'book', label: 'Recommended Books', emoji: '📚' },
  { value: 'merchandise', label: 'Merchandise', emoji: '👕' },
  { value: 'tool', label: 'Trading Tools', emoji: '🛠️' },
];

function BrokerCard({ item, index }) {
  const [showGuide, setShowGuide] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-6 transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gray-800 border border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">🏦</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold text-lg">{item.title}</h3>
            {item.badge && (
              <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {item.rating && (
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={12}
                  className={
                    i < Math.round(item.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-600'
                  }
                  style={{
                    fill:
                      i < Math.round(item.rating) ? '#FACC15' : 'transparent',
                  }}
                />
              ))}
              <span className="text-gray-500 text-xs ml-1">
                {item.rating}/5
              </span>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        {item.description}
      </p>
      {item.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        {item.affiliateLink && (
          <a
            href={item.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-yellow-500 text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
          >
            <FiExternalLink size={14} /> Open Account
          </a>
        )}
        {item.guideVideoUrl && (
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2.5 rounded-xl text-sm hover:bg-blue-500/20 transition-all"
          >
            <FiPlay size={14} />{' '}
            {showGuide ? 'Hide Guide' : 'How to Open Account'}
          </button>
        )}
      </div>
      {showGuide && item.guideVideoUrl && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 rounded-xl overflow-hidden"
        >
          <iframe
            src={item.guideVideoUrl.replace('watch?v=', 'embed/')}
            width="100%"
            height="250"
            title="Guide"
            className="rounded-xl"
            allowFullScreen
          />
        </motion.div>
      )}
    </motion.div>
  );
}

function BookCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-5 transition-all flex gap-4"
    >
      <div className="w-20 h-28 rounded-xl bg-gray-800 border border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FiBookOpen size={28} className="text-gray-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold mb-0.5 line-clamp-2">
          {item.title}
        </h3>
        {item.author && (
          <p className="text-yellow-400 text-xs mb-2">by {item.author}</p>
        )}
        {item.rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={11}
                className={
                  i < Math.round(item.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }
                style={{
                  fill: i < Math.round(item.rating) ? '#FACC15' : 'transparent',
                }}
              />
            ))}
          </div>
        )}
        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>
        {item.affiliateLink && (
          <a
            href={item.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-2 rounded-xl text-xs font-medium hover:bg-orange-500/20 transition-all"
          >
            <FiExternalLink size={12} /> Buy on Amazon
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState('broker');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    resourceAPI
      .getAll({ type: activeTab })
      .then((r) => setResources(r.data.data || []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <>
      <Helmet>
        <title>Resources — ELITE Trading Academy</title>
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
            🔗 Resources
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            TRADING{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              RESOURCES
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Our curated recommendations to supercharge your trading journey.
          </p>
        </div>
      </section>

      <section className="py-10" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.value ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
              >
                <span>{tab.emoji}</span> {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔜</div>
              <h3 className="text-white text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-gray-500">
                We're curating the best resources for you. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {resources.map((item, i) =>
                activeTab === 'book' ? (
                  <BookCard key={item._id} item={item} index={i} />
                ) : (
                  <BrokerCard key={item._id} item={item} index={i} />
                ),
              )}
            </div>
          )}
        </div>
      </section>

      <div className="py-12 bg-gray-900 border-t border-gray-700 text-center">
        <p className="text-gray-500 text-xs max-w-2xl mx-auto">
          ⚠️ Disclaimer: Some links above are affiliate links. We earn a small
          commission when you sign up through our link — at no extra cost to
          you. We only recommend brokers and books we genuinely believe in.
        </p>
      </div>
    </>
  );
}
