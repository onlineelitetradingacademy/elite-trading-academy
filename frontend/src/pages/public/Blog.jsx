import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { blogAPI } from '../../utils/api';
import { FiSearch, FiClock, FiEye, FiArrowRight, FiTag } from 'react-icons/fi';

const categories = [
  { value: 'all', label: 'All Posts' },
  { value: 'market_analysis', label: 'Market Analysis' },
  { value: 'forex', label: 'Forex' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'technical_analysis', label: 'Technical Analysis' },
  { value: 'trading_tips', label: 'Trading Tips' },
  { value: 'news', label: 'Market News' },
  { value: 'education', label: 'Education' },
];

const catColors = {
  market_analysis: 'bg-blue-500/10 text-blue-400',
  forex: 'bg-green-500/10 text-green-400',
  stocks: 'bg-purple-500/10 text-purple-400',
  crypto: 'bg-orange-500/10 text-orange-400',
  technical_analysis: 'bg-yellow-500/10 text-yellow-400',
  trading_tips: 'bg-pink-500/10 text-pink-400',
  news: 'bg-red-500/10 text-red-400',
  education: 'bg-teal-500/10 text-teal-400',
};

function BlogCard({ blog, index, featured }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`group bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl overflow-hidden transition-all duration-300 ${featured ? 'md:flex' : ''}`}
      style={{ boxShadow: 'none' }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = '0 4px 30px rgba(240,165,0,0.08)')
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <Link
        to={`/blog/${blog.slug}`}
        className={`block overflow-hidden ${featured ? 'md:w-2/5' : ''}`}
      >
        <div
          className={`overflow-hidden ${featured ? 'h-full min-h-56' : 'h-48'}`}
        >
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-4xl">
              📊
            </div>
          )}
        </div>
      </Link>
      <div className={`p-6 flex flex-col ${featured ? 'md:flex-1' : ''}`}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${catColors[blog.category] || 'bg-gray-700 text-gray-400'}`}
          >
            {blog.category?.replace('_', ' ')}
          </span>
          {blog.isFeatured && (
            <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
        <Link to={`/blog/${blog.slug}`}>
          <h2
            className={`text-white font-bold leading-snug mb-2 group-hover:text-yellow-400 transition-colors ${featured ? 'text-2xl' : 'text-base line-clamp-2'}`}
          >
            {blog.title}
          </h2>
        </Link>
        <p
          className={`text-gray-500 text-sm leading-relaxed mb-4 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}
        >
          {blog.excerpt}
        </p>
        <div className="flex items-center gap-4 mt-auto">
          {blog.author && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold overflow-hidden">
                {blog.author.avatar ? (
                  <img
                    src={blog.author.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  blog.author.name?.[0]
                )}
              </div>
              <span className="text-gray-500 text-xs">{blog.author.name}</span>
            </div>
          )}
          <span className="text-gray-700">·</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FiClock size={11} /> {blog.readTime} min
          </span>
          {blog.views > 0 && (
            <>
              <span className="text-gray-700">·</span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <FiEye size={11} /> {blog.views?.toLocaleString()}
              </span>
            </>
          )}
          <Link
            to={`/blog/${blog.slug}`}
            className="ml-auto flex items-center gap-1 text-xs text-yellow-400 hover:gap-2 transition-all font-medium"
          >
            Read <FiArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (!val || val === 'all') p.delete(key);
    else p.set(key, val);
    setSearchParams(p);
    setPage(1);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
        if (category !== 'all') params.category = category;
        if (search) params.search = search;
        const [res, featRes] = await Promise.all([
          blogAPI.getAll(params),
          page === 1
            ? blogAPI.getAll({ featured: true, limit: 1 })
            : Promise.resolve(null),
        ]);
        setBlogs(res.data.data || []);
        setTotal(res.data.total || 0);
        if (featRes) setFeatured(featRes.data.data?.[0] || null);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category, search, page]);

  return (
    <>
      <Helmet>
        <title>Blog & Market Analysis — ELITE Trading Academy</title>
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
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
            📰 Market Insights
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
              INSIGHTS
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Daily market analysis, trading strategies and financial education
            from our expert mentors.
          </p>
          <div className="relative max-w-md mx-auto">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setParam('search', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      <section className="py-10" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setParam('category', cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat.value ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured post */}
          {featured && page === 1 && !search && category === 'all' && (
            <div className="mb-8">
              <p className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <FiTag size={12} /> Featured Article
              </p>
              <BlogCard blog={featured} index={0} featured />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden"
                >
                  <div className="h-48 bg-gray-800 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-20 bg-gray-800 rounded animate-pulse" />
                    <div className="h-5 w-full bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-white text-xl font-bold mb-2">
                No articles found
              </h3>
              <p className="text-gray-500">
                Try a different category or search term
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
          )}

          {total > 6 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-400 hover:text-white disabled:opacity-40 text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 6)}
                className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-400 hover:text-white disabled:opacity-40 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
