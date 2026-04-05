import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { useSettingsStore } from '../../context/store';
import { courseAPI, testimonialAPI, blogAPI, batchAPI } from '../../utils/api';
import { FiArrowRight, FiPlay, FiStar, FiUsers, FiAward, FiTrendingUp, FiCheckCircle, FiClock, FiCalendar, FiBookOpen } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

// ── Animated Counter ──────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(target.replace(/\D/g, ''));

  useEffect(() => {
    if (!inView || !num) return;
    let start = 0;
    const step = Math.ceil(num / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, num]);

  return <span ref={ref}>{count.toLocaleString()}{suffix || target.replace(/[\d,]/g, '')}</span>;
}

// ── Ticker Tape ───────────────────────────────────────────────────
const tickerItems = [
  { symbol: 'EUR/USD', price: '1.0842', change: '+0.12%', up: true },
  { symbol: 'GBP/USD', price: '1.2634', change: '-0.08%', up: false },
  { symbol: 'NIFTY 50', price: '22,456', change: '+0.34%', up: true },
  { symbol: 'SENSEX',  price: '74,119', change: '+0.28%', up: true },
  { symbol: 'BTC/USD', price: '$67,420', change: '+1.24%', up: true },
  { symbol: 'ETH/USD', price: '$3,542',  change: '-0.56%', up: false },
  { symbol: 'GOLD',    price: '₹72,340', change: '+0.45%', up: true },
  { symbol: 'CRUDE OIL', price: '$83.20', change: '-0.22%', up: false },
  { symbol: 'USD/INR', price: '83.42',   change: '+0.04%', up: true },
  { symbol: 'SILVER',  price: '₹88,240', change: '+0.67%', up: true },
];

function TickerTape() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="bg-dark-800 border-y border-dark-500 py-2.5 overflow-hidden">
      <div className="ticker-content gap-8">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0 px-4">
            <span className="text-white text-xs font-semibold">{item.symbol}</span>
            <span className="text-muted text-xs">{item.price}</span>
            <span className={`text-xs font-medium ${item.up ? 'text-profit' : 'text-loss'}`}>{item.change}</span>
            <span className="text-dark-400 text-xs">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────
function HeroSection({ sliders, settings }) {
  const hasSliders = sliders?.length > 0;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />

      {/* Candlestick SVG animation */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <svg viewBox="0 0 1200 600" className="absolute bottom-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          {[...Array(20)].map((_, i) => {
            const x = i * 60 + 20; const h = 80 + Math.random() * 120;
            const y = 400 - h; const up = Math.random() > 0.4;
            return (
              <g key={i} style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}>
                <line x1={x + 8} y1={y - 20} x2={x + 8} y2={y + h + 20} stroke={up ? '#00C853' : '#FF3D57'} strokeWidth="2" />
                <rect x={x} y={y} width="16" height={h} fill={up ? '#00C853' : '#FF3D57'} rx="2" />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="container-custom relative z-10 py-32">
        {hasSliders ? (
          <Swiper modules={[Autoplay, Pagination, EffectFade]} effect="fade" autoplay={{ delay: 5000, disableOnInteraction: false }} pagination={{ clickable: true }} loop className="w-full">
            {sliders.map((slide, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col lg:flex-row items-center gap-12 pb-12">
                  <div className="flex-1 text-center lg:text-left">
                    {slide.badge && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 badge-gold mb-6">
                        {slide.badge}
                      </motion.div>
                    )}
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-wide mb-6">
                      {slide.title.split(' ').map((word, wi) =>
                        ['Elite', 'Pro', 'Forex', 'ELITE', 'Trade', 'Trading'].includes(word)
                          ? <span key={wi} className="text-gradient">{word} </span>
                          : word + ' '
                      )}
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="text-muted text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                      {slide.subtitle}
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      <Link to={slide.ctaLink || '/courses'} className="btn-gold text-base px-8 py-4 flex items-center gap-2">
                        {slide.ctaText || 'Explore Courses'} <FiArrowRight />
                      </Link>
                      <Link to="/courses?isFree=true" className="btn-outline text-base px-8 py-4 flex items-center gap-2">
                        <FiPlay size={16} /> Free Workshop
                      </Link>
                    </motion.div>
                  </div>
                  {slide.image && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                      className="flex-1 hidden lg:block">
                      <img src={slide.image} alt={slide.title} className="w-full max-w-lg mx-auto rounded-2xl shadow-card-hover object-cover" />
                    </motion.div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Default Hero
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 badge-gold mb-6 text-sm">
                🔥 New Batch Starting May 15, 2026
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="font-display text-5xl md:text-7xl text-white leading-tight tracking-wide mb-6">
                WHERE TRADERS<br />
                BECOME <span className="text-gradient">ELITE</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-muted text-xl mb-8 max-w-xl leading-relaxed">
                Master Forex, Stocks, Crypto & Commodity trading with India's most comprehensive trading academy. Join <span className="text-gold font-semibold">{settings?.stat_students || '5,000+'}</span> successful traders.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <Link to="/courses" className="btn-gold text-base px-8 py-4 flex items-center gap-2">
                  Explore Courses <FiArrowRight />
                </Link>
                <Link to="/courses?isFree=true" className="btn-outline text-base px-8 py-4 flex items-center gap-2">
                  <FiPlay size={16} /> Free Workshop
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                {['Forex & Stocks', 'Live Classes', 'Bilingual Courses', 'Certificate'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-muted">
                    <FiCheckCircle size={14} className="text-profit" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Hero Card */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="flex-1 hidden lg:block max-w-md">
              <div className="glass-card p-6 animate-float">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-muted text-xs mb-1">Portfolio Performance</p>
                    <p className="text-3xl font-bold text-profit">+₹2,40,000</p>
                  </div>
                  <div className="w-12 h-12 bg-profit/10 rounded-xl flex items-center justify-center">
                    <FiTrendingUp size={24} className="text-profit" />
                  </div>
                </div>
                <div className="h-24 relative mb-4">
                  <svg viewBox="0 0 300 80" className="w-full h-full">
                    <polyline points="0,70 40,55 80,60 120,35 160,40 200,20 240,25 300,5"
                      fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="0,70 40,55 80,60 120,35 160,40 200,20 240,25 300,5 300,80 0,80"
                      fill="url(#profit-grad)" />
                    <defs>
                      <linearGradient id="profit-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00C853" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: 'Win Rate', v: '78%', c: 'text-profit' }, { l: 'Trades', v: '142', c: 'text-white' }, { l: 'Best Trade', v: '+₹42K', c: 'text-gold' }].map(s => (
                    <div key={s.l} className="bg-dark-600 rounded-lg p-3 text-center">
                      <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
                      <p className="text-muted text-xs">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Stats Section ─────────────────────────────────────────────────
function StatsSection({ settings }) {
  const stats = [
    { label: 'Students Trained', value: settings?.stat_students || '5,000+', icon: FiUsers, color: 'text-gold' },
    { label: 'Years Experience', value: settings?.stat_experience || '8+',    icon: FiAward, color: 'text-purple-400' },
    { label: 'Expert Courses',   value: settings?.stat_courses || '20+',     icon: FiBookOpen, color: 'text-blue-400' },
    { label: 'Satisfaction Rate',value: settings?.stat_satisfaction || '95%', icon: FiStar, color: 'text-gold' },
    { label: 'Webinars Done',    value: settings?.stat_webinars || '500+',    icon: FiPlay, color: 'text-profit' },
    { label: 'Instagram Followers', value: settings?.stat_instagram || '12K+', icon: FiUsers, color: 'text-pink-400' },
  ];

  return (
    <section className="py-16 bg-dark-800 border-y border-dark-500">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <stat.icon size={24} className={`${stat.color} mx-auto mb-2`} />
              <div className={`font-display text-3xl md:text-4xl ${stat.color} mb-1`}>
                <Counter target={stat.value} />
              </div>
              <p className="text-muted text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Course Card ───────────────────────────────────────────────────
function CourseCard({ course }) {
  const levelColors = { beginner: 'text-profit', intermediate: 'text-gold', advanced: 'text-loss', all: 'text-blue-400' };
  return (
    <motion.div whileHover={{ y: -4 }} className="course-card group">
      <div className="relative overflow-hidden">
        <img src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600'} alt={course.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
        {course.isFree && <span className="absolute top-3 left-3 badge-green">FREE</span>}
        {course.isFeatured && <span className="absolute top-3 right-3 badge-gold">⭐ Featured</span>}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className={`text-xs font-medium capitalize ${levelColors[course.level]}`}>{course.level}</span>
          <span className="text-dark-400 text-xs">•</span>
          <span className="text-muted text-xs capitalize">{course.language}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-gold text-xs capitalize">{course.category?.replace('_', ' ')}</span>
        </div>
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-gold transition-colors">{course.title}</h3>
        {course.instructor && (
          <p className="text-muted text-xs mb-3 flex items-center gap-1">
            <FiUsers size={11} /> {course.instructor.name}
          </p>
        )}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <FiStar key={i} size={11} className={i < Math.round(course.averageRating || 4.5) ? 'text-gold fill-gold' : 'text-muted'} />)}
          </div>
          <span className="text-xs text-muted">({course.totalReviews || course.enrolledCount || 0})</span>
          <span className="text-xs text-muted ml-auto flex items-center gap-1"><FiUsers size={11} /> {course.enrolledCount || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {course.isFree ? (
              <span className="text-profit font-bold text-lg">FREE</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gold font-bold text-xl">₹{course.price?.toLocaleString()}</span>
                {course.originalPrice && <span className="text-muted text-sm line-through">₹{course.originalPrice?.toLocaleString()}</span>}
              </div>
            )}
          </div>
          <Link to={`/courses/${course.slug}`} className="btn-gold text-sm py-2 px-4">Enroll</Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Courses Section ───────────────────────────────────────────────
function CoursesSection({ courses }) {
  const [filter, setFilter] = useState('all');
  const categories = ['all', 'forex', 'stocks', 'crypto', 'options', 'technical_analysis'];
  const filtered = filter === 'all' ? courses : courses.filter(c => c.category === filter);

  return (
    <section className="py-20 bg-dark-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="section-tag">What We Teach</p>
          <h2 className="section-title">Our Expert <span className="text-gradient">Courses</span></h2>
          <p className="section-subtitle mx-auto">From beginner fundamentals to advanced professional strategies — we have a course for every level of trader.</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filter === cat ? 'bg-gold text-dark-900' : 'bg-dark-700 text-muted hover:text-white border border-dark-500'}`}>
              {cat === 'all' ? 'All Courses' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(0, 6).map((course, i) => (
            <motion.div key={course._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/courses" className="btn-outline px-8 py-3 inline-flex items-center gap-2">View All Courses <FiArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

// ── Upcoming Batches ──────────────────────────────────────────────
function BatchesSection({ batches }) {
  if (!batches?.length) return null;
  return (
    <section className="py-20 bg-dark-800">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-tag">Live Learning</p>
            <h2 className="section-title">Upcoming <span className="text-gradient">Batches</span></h2>
          </div>
          <Link to="/batches" className="btn-outline px-6 py-2.5 text-sm inline-flex items-center gap-2 whitespace-nowrap">View All <FiArrowRight /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.slice(0, 3).map((batch, i) => (
            <motion.div key={batch._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={`badge-${batch.type === 'online' ? 'blue' : 'gold'} text-xs capitalize px-3 py-1 rounded-full border ${batch.type === 'online' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gold/10 text-gold border-gold/20'}`}>
                  {batch.type === 'online' ? '🖥️ Online' : '🏢 Offline'}
                </span>
                {batch.isFeatured && <span className="badge-gold text-xs">⭐ Popular</span>}
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">{batch.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <FiCalendar size={14} className="text-gold" />
                  <span>Starts {new Date(batch.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-muted text-sm">
                  <FiClock size={14} className="text-gold" />
                  <span>{batch.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiUsers size={14} className="text-gold" />
                  <span className="text-muted">Seats: </span>
                  <span className="text-white font-medium">{batch.totalSeats - batch.enrolledSeats} left</span>
                  <div className="flex-1 bg-dark-600 rounded-full h-1.5 ml-1">
                    <div className="bg-gold h-1.5 rounded-full transition-all" style={{ width: `${(batch.enrolledSeats / batch.totalSeats) * 100}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-dark-500">
                <div>
                  <span className="text-gold font-bold text-2xl">₹{batch.price?.toLocaleString()}</span>
                  {batch.originalPrice && <span className="text-muted text-sm line-through ml-2">₹{batch.originalPrice?.toLocaleString()}</span>}
                </div>
                <Link to={`/batches`} className="btn-gold text-sm py-2 px-4">Book Seat</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────
function TestimonialsSection({ testimonials }) {
  return (
    <section className="py-20 bg-dark-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="section-tag">Student Success</p>
          <h2 className="section-title">What Our <span className="text-gradient">Students Say</span></h2>
        </div>
        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} pagination={{ clickable: true }}
          breakpoints={{ 0: { slidesPerView: 1, spaceBetween: 16 }, 768: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } }}
          className="pb-10">
          {testimonials.map((t, i) => (
            <SwiperSlide key={t._id || i}>
              <div className="glass-card p-6 h-full">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating || 5)].map((_, j) => <FiStar key={j} size={14} className="text-gold fill-gold" />)}
                </div>
                <p className="text-muted text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-dark-500">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold">
                    {t.photo ? <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" /> : t.name?.[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-muted text-xs">{t.city} {t.course && `• ${t.course}`}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

// ── Blog Preview ──────────────────────────────────────────────────
function BlogSection({ blogs }) {
  if (!blogs?.length) return null;
  return (
    <section className="py-20 bg-dark-800">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-tag">Market Insights</p>
            <h2 className="section-title">Latest <span className="text-gradient">Analysis</span></h2>
          </div>
          <Link to="/blog" className="btn-outline px-6 py-2.5 text-sm inline-flex items-center gap-2 whitespace-nowrap">View All Posts <FiArrowRight /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog, i) => (
            <motion.div key={blog._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden group">
              <Link to={`/blog/${blog.slug}`}>
                <div className="h-48 bg-dark-700 overflow-hidden relative">
                  {blog.thumbnail
                    ? <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-muted"><FiFileText size={40} /></div>}
                  <div className="absolute top-3 left-3 badge-gold text-xs capitalize">{blog.category?.replace('_', ' ')}</div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-gold transition-colors">{blog.title}</h3>
                  <p className="text-muted text-sm line-clamp-2 mb-3">{blog.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1"><FiClock size={11} /> {blog.readTime} min read</span>
                    <span>{new Date(blog.publishedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Segments Section ──────────────────────────────────────────────
function SegmentsSection() {
  const segments = [
    { icon: '📈', tag: 'Professionals Learning', title: 'For Loss-Makers & Beginners', desc: 'Are you losing money in markets or just starting out? Our structured programme takes you from zero to profitable trading with proven strategies.', features: ['Complete market education', 'Live practice sessions', 'Mentor guidance', 'Risk management mastery'], cta: 'Start Learning', link: '/courses?level=beginner', color: 'from-gold/20 to-transparent' },
    { icon: '🎓', tag: 'Student Module', title: 'Special Programme for Students', desc: 'Designed specifically for college and school students. Learn financial markets affordably on a monthly subscription model.', features: ['Affordable monthly subscription', 'Study + Trade balance', 'Career guidance', 'Internship opportunities'], cta: 'Student Plans', link: '/courses', color: 'from-blue-500/20 to-transparent', badge: '💎 Best Value' },
    { icon: '👤', tag: 'Elite Mentorship', title: 'Personal 1-on-1 Mentorship', desc: 'Our premium personal mentorship programme. Get individualised guidance on your actual trades for maximum growth.', features: ['Personalised trading plan', '1-on-1 weekly sessions', 'Live trade reviews', 'Direct mentor access'], cta: 'Apply Now', link: '/courses?type=mentorship', color: 'from-purple-500/20 to-transparent', badge: '🔥 Limited Slots' },
  ];

  return (
    <section className="py-20 bg-dark-900">
      <div className="container-custom">
        <div className="text-center mb-16">
          <p className="section-tag">Our Programmes</p>
          <h2 className="section-title">Choose Your <span className="text-gradient">Learning Path</span></h2>
          <p className="section-subtitle mx-auto">We have tailored programmes for every type of learner — from complete beginners to experienced traders looking to level up.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segments.map((s, i) => (
            <motion.div key={s.tag} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className={`glass-card p-8 relative overflow-hidden group hover:shadow-gold transition-all duration-300`}>
              <div className={`absolute inset-0 bg-gradient-to-b ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                {s.badge && <span className="absolute -top-2 -right-2 badge-gold text-xs">{s.badge}</span>}
                <div className="text-4xl mb-4">{s.icon}</div>
                <p className="text-gold text-xs font-semibold tracking-wider uppercase mb-2">{s.tag}</p>
                <h3 className="text-white text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-6">{s.desc}</p>
                <ul className="space-y-2 mb-6">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCheckCircle size={14} className="text-gold flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={s.link} className="btn-gold w-full text-center text-sm py-3 flex items-center justify-center gap-2">
                  {s.cta} <FiArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────
function CTASection({ settings }) {
  return (
    <section className="py-24 bg-dark-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      <div className="container-custom relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="section-tag">Start Today</p>
          <h2 className="font-display text-5xl md:text-6xl text-white mb-6">
            READY TO BECOME <span className="text-gradient">ELITE</span>?
          </h2>
          <p className="text-muted text-xl mb-10 max-w-2xl mx-auto">
            Join {settings?.stat_students || '5,000+'} traders who have already transformed their financial future with ELITE Trading Academy.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/courses" className="btn-gold text-lg px-10 py-4 flex items-center gap-2">Start Learning Today <FiArrowRight /></Link>
            <Link to="/courses?isFree=true" className="btn-outline text-lg px-10 py-4 flex items-center gap-2"><FiPlay size={18} /> Try Free First</Link>
          </div>
          <p className="text-muted text-sm mt-6">⚠️ Trading involves risk. Our courses are for educational purposes only.</p>
        </motion.div>
      </div>
    </section>
  );
}

// ── MAIN HOME PAGE ────────────────────────────────────────────────
export default function Home() {
  const { settings, sliders } = useSettingsStore();
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [c, t, b, bt] = await Promise.all([
          courseAPI.getAll({ limit: 6, featured: true }),
          testimonialAPI.getAll({ featured: true }),
          blogAPI.getAll({ limit: 3, featured: true }),
          batchAPI.getAll({ isActive: true }),
        ]);
        setCourses(c.data.data || []);
        setTestimonials(t.data.data || []);
        setBlogs(b.data.data || []);
        setBatches(bt.data.data || []);
      } catch (err) { console.error(err); }
    };
    fetchAll();
  }, []);

  return (
    <>
      <Helmet>
        <title>{settings?.meta_title || 'ELITE Trading Academy — Where Traders Become Elite'}</title>
        <meta name="description" content={settings?.meta_description || ''} />
      </Helmet>
      <TickerTape />
      <HeroSection sliders={sliders} settings={settings} />
      <StatsSection settings={settings} />
      <CoursesSection courses={courses} />
      <SegmentsSection />
      <BatchesSection batches={batches} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection blogs={blogs} />
      <CTASection settings={settings} />
    </>
  );
}
