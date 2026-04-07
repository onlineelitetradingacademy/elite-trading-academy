import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { courseAPI, batchAPI } from '../../utils/api';
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiUsers,
  FiPlay,
  FiArrowRight,
  FiCheckCircle,
  FiBookOpen,
  FiCalendar,
  FiAward,
} from 'react-icons/fi';

const categories = [
  { value: 'all', label: 'All Courses', emoji: '📚' },
  { value: 'forex', label: 'Forex Trading', emoji: '💱' },
  { value: 'stocks', label: 'Stock Market', emoji: '📈' },
  { value: 'crypto', label: 'Crypto Trading', emoji: '₿' },
  { value: 'commodity', label: 'Commodity', emoji: '🥇' },
  { value: 'options', label: 'Options', emoji: '📊' },
  { value: 'technical_analysis', label: 'Technical Analysis', emoji: '🔍' },
  { value: 'risk_management', label: 'Risk Management', emoji: '🛡️' },
];

const courseTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'recorded', label: 'Recorded' },
  { value: 'live_online', label: 'Live Online' },
  { value: 'live_offline', label: 'Offline' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'free', label: 'Free' },
];

const levels = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

const levelColors = {
  beginner: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
  },
  intermediate: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
  advanced: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
  all: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
};

const typeColors = {
  recorded: 'bg-purple-500/10 text-purple-400',
  live_online: 'bg-blue-500/10 text-blue-400',
  live_offline: 'bg-orange-500/10 text-orange-400',
  mentorship: 'bg-pink-500/10 text-pink-400',
  free: 'bg-green-500/10 text-green-400',
};

const typeLabels = {
  recorded: '🎬 Recorded',
  live_online: '🖥️ Live Online',
  live_offline: '🏢 Offline',
  mentorship: '👤 Mentorship',
  free: '🆓 Free',
};

function CourseCard({ course, index }) {
  const level = levelColors[course.level] || levelColors.all;
  const discount = course.originalPrice
    ? Math.round(
        ((course.originalPrice - course.price) / course.originalPrice) * 100,
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-dark-800 border border-dark-500 hover:border-yellow-500/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
      style={{ boxShadow: 'none' }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = '0 8px 40px rgba(240,165,0,0.12)')
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={
            course.thumbnail ||
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600'
          }
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {course.isFree && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              FREE
            </span>
          )}
          {discount > 0 && (
            <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
          {course.isFeatured && (
            <span className="bg-gray-900/80 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-yellow-400/30">
              ⭐ Featured
            </span>
          )}
          {course.isPopular && (
            <span className="bg-gray-900/80 text-orange-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-400/30">
              🔥 Popular
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-900/70 ${typeColors[course.courseType] || 'text-gray-400'}`}
          >
            {typeLabels[course.courseType] || course.courseType}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center">
            <FiPlay size={20} className="text-gray-900 ml-1" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${level.bg} ${level.text} ${level.border}`}
          >
            {course.level?.charAt(0).toUpperCase() + course.level?.slice(1)}
          </span>
          <span className="text-xs text-gray-300 bg-gray-900/60 px-2 py-1 rounded-full capitalize">
            {course.language}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-yellow-500 text-xs font-semibold uppercase tracking-wider mb-2 capitalize">
          {course.category?.replace('_', ' ')}
        </p>
        <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200">
          {course.title}
        </h3>
        {course.subtitle && (
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
            {course.subtitle}
          </p>
        )}
        {course.instructor && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold overflow-hidden">
              {course.instructor.avatar ? (
                <img
                  src={course.instructor.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                course.instructor.name?.[0]
              )}
            </div>
            <span className="text-gray-500 text-xs">
              {course.instructor.name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={11}
                className={
                  i < Math.round(course.averageRating || 4.5)
                    ? 'text-yellow-400'
                    : 'text-gray-700'
                }
                style={{
                  fill:
                    i < Math.round(course.averageRating || 4.5)
                      ? '#FACC15'
                      : 'transparent',
                }}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({course.totalReviews || 0})
            </span>
          </div>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FiUsers size={11} /> {course.enrolledCount?.toLocaleString() || 0}
          </span>
        </div>
        {course.whatYouLearn?.length > 0 && (
          <div className="mb-4 space-y-1">
            {course.whatYouLearn.slice(0, 2).map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-1.5 text-xs text-gray-500"
              >
                <FiCheckCircle
                  size={11}
                  className="text-yellow-500 flex-shrink-0 mt-0.5"
                />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex-1" />
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div>
            {course.isFree ? (
              <span className="text-green-400 font-bold text-xl">FREE</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold text-2xl">
                  ₹{course.price?.toLocaleString()}
                </span>
                {course.originalPrice && (
                  <span className="text-gray-500 text-sm line-through">
                    ₹{course.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
          <Link
            to={`/courses/${course.slug}`}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5"
          >
            Enroll <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
      <div className="h-48 bg-gray-700 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-gray-700 rounded animate-pulse" />
        <div className="h-5 w-full bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-full bg-gray-700 rounded-xl mt-4 animate-pulse" />
      </div>
    </div>
  );
}

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || 'all';
  const courseType = searchParams.get('courseType') || 'all';
  const level = searchParams.get('level') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const isFree = searchParams.get('isFree') || '';

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value === 'all' || value === '') p.delete(key);
    else p.set(key, value);
    p.delete('page');
    setSearchParams(p);
    setPage(1);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9, sort };
        if (category !== 'all') params.category = category;
        if (courseType !== 'all') params.courseType = courseType;
        if (level !== 'all') params.level = level;
        if (search) params.search = search;
        if (isFree) params.isFree = isFree;
        const res = await courseAPI.getAll(params);
        setCourses(res.data.data || []);
        setTotal(res.data.total || 0);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [category, courseType, level, sort, search, isFree, page]);

  useEffect(() => {
    batchAPI
      .getAll({ isActive: true })
      .then((r) => setBatches(r.data.data || []))
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Courses — ELITE Trading Academy</title>
        <meta
          name="description"
          content="Learn Forex, Stocks, Crypto & Commodity trading with expert-led courses."
        />
      </Helmet>

      <section
        className="relative pt-28 pb-14 overflow-hidden"
        style={{ background: '#0A0A0F' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(240,165,0,0.15), transparent)',
          }}
        />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
              <FiBookOpen size={14} />{' '}
              {total > 0 ? `${total} Courses Available` : 'Expert Courses'}
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
              MASTER THE{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MARKETS
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              From beginner to professional — structured courses in Forex,
              Stocks, Crypto, Commodity & more. Bilingual (Hindi + English).
            </p>
            <div className="relative max-w-xl mx-auto">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setParam('search', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {batches.length > 0 && (
        <div className="bg-gray-900 border-y border-gray-700 py-3 overflow-hidden">
          <div className="container-custom">
            <div
              className="flex items-center gap-6 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
                <FiCalendar size={12} /> Upcoming Batches
              </span>
              {batches.slice(0, 4).map((batch) => (
                <Link
                  key={batch._id}
                  to="/batches"
                  className="flex items-center gap-2 whitespace-nowrap text-xs text-gray-500 hover:text-white transition-colors"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${batch.type === 'online' ? 'bg-blue-400' : 'bg-orange-400'}`}
                  />
                  <span>{batch.title}</span>
                  <span className="text-gray-700">·</span>
                  <span>
                    {new Date(batch.startDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${batch.totalSeats - batch.enrolledSeats < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
                  >
                    {batch.totalSeats - batch.enrolledSeats} seats left
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="py-10" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-60 flex-shrink-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 mb-4 text-white"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <FiFilter size={14} /> Filters
                </span>
                <span className="text-gray-500 text-xs">
                  {showFilters ? 'Hide' : 'Show'}
                </span>
              </button>
              <div className="hidden lg:block space-y-4">
                {[
                  {
                    title: 'Category',
                    icon: FiBookOpen,
                    items: categories,
                    param: 'category',
                    current: category,
                  },
                  {
                    title: 'Course Type',
                    icon: FiPlay,
                    items: courseTypes,
                    param: 'courseType',
                    current: courseType,
                  },
                  {
                    title: 'Level',
                    icon: FiAward,
                    items: levels,
                    param: 'level',
                    current: level,
                  },
                ].map((group) => (
                  <div
                    key={group.title}
                    className="bg-gray-900 border border-gray-700 rounded-2xl p-4"
                  >
                    <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                      <group.icon size={14} className="text-yellow-500" />{' '}
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setParam(group.param, item.value)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${group.current === item.value ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                        >
                          {item.emoji && <span>{item.emoji}</span>}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setParam('isFree', isFree ? '' : 'true')}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${isFree ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-white'}`}
                >
                  <FiCheckCircle size={14} /> Free Courses Only
                </button>
              </div>
              {showFilters && (
                <div className="lg:hidden space-y-4">
                  {[
                    {
                      title: 'Category',
                      icon: FiBookOpen,
                      items: categories,
                      param: 'category',
                      current: category,
                    },
                    {
                      title: 'Course Type',
                      icon: FiPlay,
                      items: courseTypes,
                      param: 'courseType',
                      current: courseType,
                    },
                    {
                      title: 'Level',
                      icon: FiAward,
                      items: levels,
                      param: 'level',
                      current: level,
                    },
                  ].map((group) => (
                    <div
                      key={group.title}
                      className="bg-gray-900 border border-gray-700 rounded-2xl p-4"
                    >
                      <h3 className="text-white font-semibold text-sm mb-3">
                        {group.title}
                      </h3>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.value}
                            onClick={() => setParam(group.param, item.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${group.current === item.value ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500 hover:text-white'}`}
                          >
                            {item.emoji && <span>{item.emoji}</span>}
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <p className="text-gray-500 text-sm">
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      <span className="text-white font-semibold">{total}</span>{' '}
                      courses found
                    </>
                  )}
                </p>
                <select
                  value={sort}
                  onChange={(e) => setParam('sort', e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {(category !== 'all' ||
                courseType !== 'all' ||
                level !== 'all' ||
                isFree ||
                search) && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {category !== 'all' && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      {categories.find((c) => c.value === category)?.label}
                      <button
                        onClick={() => setParam('category', 'all')}
                        className="ml-1 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {courseType !== 'all' && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      {courseTypes.find((t) => t.value === courseType)?.label}
                      <button
                        onClick={() => setParam('courseType', 'all')}
                        className="ml-1 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {level !== 'all' && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      {levels.find((l) => l.value === level)?.label}
                      <button
                        onClick={() => setParam('level', 'all')}
                        className="ml-1 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {isFree && (
                    <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      Free Only
                      <button
                        onClick={() => setParam('isFree', '')}
                        className="ml-1 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      "{search}"
                      <button
                        onClick={() => setParam('search', '')}
                        className="ml-1 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => setSearchParams({})}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {courses.map((course, i) => (
                    <CourseCard key={course._id} course={course} index={i} />
                  ))}
                </div>
              )}

              {total > 9 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-400 hover:text-white disabled:opacity-40 text-sm"
                  >
                    Previous
                  </button>
                  {[...Array(Math.ceil(total / 9))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-600 text-gray-400 hover:text-white'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil(total / 9)}
                    className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-400 hover:text-white disabled:opacity-40 text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 border-t border-gray-700">
        <div className="container-custom text-center">
          <h2 className="font-display text-4xl text-white mb-3">
            NOT SURE WHERE TO START?
          </h2>
          <p className="text-gray-400 mb-6">
            Try our free beginner workshop — zero cost, zero risk
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/courses?isFree=true"
              className="bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors"
            >
              <FiPlay size={16} /> Start Free Workshop
            </Link>
            <Link
              to="/contact"
              className="border border-yellow-500/40 text-yellow-400 font-semibold px-8 py-3 rounded-xl hover:bg-yellow-500/10 transition-colors"
            >
              Talk to a Mentor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
