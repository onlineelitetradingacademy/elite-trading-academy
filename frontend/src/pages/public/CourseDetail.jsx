import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { courseAPI, couponAPI } from '../../utils/api';
import { useAuthStore, useCartStore } from '../../context/store';
import toast from 'react-hot-toast';
import {
  FiPlay, FiLock, FiCheckCircle, FiStar, FiUsers, FiClock,
  FiDownload, FiBookOpen, FiAward, FiChevronDown, FiChevronUp,
  FiShare2, FiHeart, FiArrowRight, FiTag, FiGlobe, FiMonitor
} from 'react-icons/fi';

const levelColors = {
  beginner:    'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate:'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced:    'bg-red-500/10 text-red-400 border-red-500/20',
  all:         'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const typeLabels = {
  recorded:    '🎬 Recorded Course',
  live_online: '🖥️ Live Online',
  live_offline:'🏢 Offline Batch',
  mentorship:  '👤 1-on-1 Mentorship',
  free:        '🆓 Free Course',
};

// ── Sticky Enroll Card ──────────────────────────────────────────
function EnrollCard({ course, isEnrolled, onEnroll, coupon, setCoupon, discount, setDiscount, applying }) {
  const [couponInput, setCouponInput] = useState('');
  const [checking, setChecking] = useState(false);

  const checkCoupon = async () => {
    if (!couponInput.trim()) return;
    setChecking(true);
    try {
      const res = await couponAPI.validate({ code: couponInput.toUpperCase(), amount: course.price });
      setCoupon(res.data.coupon);
      setDiscount(res.data.coupon.discount);
      toast.success(`Coupon applied! You save ₹${res.data.coupon.discount.toLocaleString()} 🎉`);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
    finally { setChecking(false); }
  };

  const finalPrice = Math.max((course.price || 0) - discount, 0);
  const discountPct = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden sticky top-24">
      {/* Preview Video / Thumbnail */}
      <div className="relative h-44 bg-gray-800 overflow-hidden">
        {course.previewVideo ? (
          <video src={course.previewVideo} controls className="w-full h-full object-cover" />
        ) : (
          <img src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600'}
            alt={course.title} className="w-full h-full object-cover" />
        )}
        {!course.previewVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40">
            <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center">
              <FiPlay size={22} className="text-gray-900 ml-1" />
            </div>
          </div>
        )}
        {!course.previewVideo && <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs">Preview available after enrollment</p>}
      </div>

      <div className="p-5">
        {/* Price */}
        <div className="flex items-end gap-3 mb-4">
          {course.isFree ? (
            <span className="text-green-400 font-bold text-3xl">FREE</span>
          ) : (
            <>
              <span className="text-yellow-400 font-bold text-3xl">₹{finalPrice.toLocaleString()}</span>
              {discount > 0 && <span className="text-gray-500 text-lg line-through">₹{course.price?.toLocaleString()}</span>}
              {!discount && course.originalPrice && <span className="text-gray-500 text-lg line-through">₹{course.originalPrice?.toLocaleString()}</span>}
              {(discount > 0 || discountPct > 0) && (
                <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-lg ml-auto">
                  {discount > 0 ? `₹${discount} OFF` : `${discountPct}% OFF`}
                </span>
              )}
            </>
          )}
        </div>

        {/* Enroll Button */}
        {isEnrolled ? (
          <Link to={`/dashboard/courses/${course.slug}/learn`}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mb-3 text-sm">
            <FiPlay size={16} /> Continue Learning
          </Link>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={onEnroll} disabled={applying}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mb-3 disabled:opacity-60 text-sm">
            {applying ? 'Processing...' : course.isFree ? 'Enroll for Free' : <><FiArrowRight size={16} /> Enroll Now — ₹{finalPrice.toLocaleString()}</>}
          </motion.button>
        )}

        {/* Coupon */}
        {!isEnrolled && !course.isFree && (
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input type="text" placeholder="Coupon code" value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none transition-all placeholder-gray-500" />
            </div>
            <button onClick={checkCoupon} disabled={checking}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
              {checking ? '...' : 'Apply'}
            </button>
          </div>
        )}

        {coupon && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 mb-3">
            <FiCheckCircle size={14} className="text-green-400" />
            <span className="text-green-400 text-xs font-medium">"{coupon.code}" applied — ₹{discount} off!</span>
            <button onClick={() => { setCoupon(null); setDiscount(0); setCouponInput(''); }} className="ml-auto text-gray-500 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* Course meta */}
        <div className="space-y-2.5 border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">This course includes:</p>
          {course.includes?.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <FiCheckCircle size={13} className="text-yellow-400 flex-shrink-0" /> {item}
            </div>
          ))}
          {!course.includes?.length && [
            { icon: FiPlay, text: 'Video lessons (bilingual)' },
            { icon: FiDownload, text: 'Downloadable resources & PDFs' },
            { icon: FiBookOpen, text: 'Quizzes & assignments' },
            { icon: FiAward, text: 'Certificate of completion' },
            { icon: FiMonitor, text: 'Lifetime access' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <item.icon size={13} className="text-yellow-400 flex-shrink-0" /> {item.text}
            </div>
          ))}
        </div>

        {/* Share */}
        <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
          className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mt-4 py-2 border border-gray-700 rounded-xl hover:border-gray-500">
          <FiShare2 size={14} /> Share This Course
        </button>

        <p className="text-gray-600 text-xs text-center mt-3">7-day refund policy • Secure payment via Razorpay</p>
      </div>
    </div>
  );
}

// ── Section Accordion ───────────────────────────────────────────
function SectionAccordion({ section, isEnrolled, completedLessons }) {
  const [open, setOpen] = useState(true);
  const lessonCount = section.lessons?.length || 0;

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-800 hover:bg-gray-750 transition-colors text-left">
        <div>
          <h3 className="text-white font-semibold text-sm">{section.title}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{lessonCount} lessons</p>
        </div>
        {open ? <FiChevronUp size={16} className="text-gray-400" /> : <FiChevronDown size={16} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            {section.lessons?.map((lesson, i) => {
              const isCompleted = completedLessons?.includes(lesson._id);
              const isAccessible = isEnrolled || lesson.isPreview;
              return (
                <div key={i} className={`flex items-center gap-3 px-5 py-3 border-t border-gray-700 text-sm ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-850'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500/20 text-green-400' : isAccessible ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-700 text-gray-500'}`}>
                    {isCompleted ? <FiCheckCircle size={14} /> : isAccessible ? <FiPlay size={12} className="ml-0.5" /> : <FiLock size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`${isAccessible ? 'text-white' : 'text-gray-500'} truncate block`}>{lesson.title}</span>
                    {lesson.isPreview && <span className="text-xs text-yellow-400">Free preview</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {lesson.type === 'quiz' && <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">Quiz</span>}
                    {lesson.type === 'notes' && <FiDownload size={12} className="text-gray-500" />}
                    {lesson.videoDuration && <span className="text-xs text-gray-500">{Math.floor(lesson.videoDuration/60)}m</span>}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { setItem } = useCartStore();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    courseAPI.getOne(slug)
      .then(res => {
        setCourse(res.data.data);
        setIsEnrolled(res.data.isEnrolled);
      })
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = () => {
    if (!isAuthenticated) { toast.error('Please login to enroll'); navigate('/auth/login', { state: { from: { pathname: `/courses/${course.slug}` } } }); return; }
    if (course.isFree || course.price === 0) {
      // Free enrollment
      toast.success('Enrolling...');
      return;
    }
    setItem({ ...course, itemType: 'Course' });
    if (coupon) {
      const { useCartStore: store } = require('../../context/store');
      store.getState().applyCoupon(coupon, discount);
    }
    navigate('/checkout');
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0A0A0F' }}>
      <div className="text-center">
        <div className="w-12 h-12 bg-yellow-500 rounded-xl mx-auto mb-3 animate-pulse flex items-center justify-center font-display text-gray-900 font-bold text-xl">E</div>
        <p className="text-gray-400 text-sm">Loading course...</p>
      </div>
    </div>
  );

  if (!course) return null;

  const totalLessons = course.sections?.reduce((acc, s) => acc + s.lessons?.length, 0) || 0;
  const totalDuration = course.sections?.reduce((acc, s) => acc + s.lessons?.reduce((a, l) => a + (l.videoDuration || 0), 0), 0) || 0;
  const levelClass = levelColors[course.level] || levelColors.all;

  const tabs = [
    { id: 'overview',  label: 'Overview' },
    { id: 'curriculum',label: `Curriculum (${totalLessons})` },
    { id: 'instructor',label: 'Instructor' },
    { id: 'reviews',   label: `Reviews (${course.totalReviews || 0})` },
  ];

  return (
    <>
      <Helmet>
        <title>{course.metaTitle || course.title} — ELITE Trading Academy</title>
        <meta name="description" content={course.metaDescription || course.subtitle} />
      </Helmet>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(180deg, #0f0f1a 0%, #0A0A0F 100%)' }} className="pt-24 pb-8 border-b border-gray-800">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 max-w-2xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Link to="/courses" className="hover:text-yellow-400 transition-colors">Courses</Link>
                <span>›</span>
                <span className="capitalize">{course.category?.replace('_',' ')}</span>
                <span>›</span>
                <span className="text-gray-400 truncate max-w-xs">{course.title}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${levelClass}`}>{course.level}</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-700 text-gray-300 border border-gray-600">{typeLabels[course.courseType] || course.courseType}</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1"><FiGlobe size={10} /> {course.language === 'bilingual' ? 'Hindi + English' : course.language}</span>
                {course.isFeatured && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">⭐ Featured</span>}
              </div>

              <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-tight mb-3">{course.title}</h1>
              {course.subtitle && <p className="text-gray-300 text-base md:text-lg mb-4 leading-relaxed">{course.subtitle}</p>}

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                {course.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 font-bold">{course.averageRating?.toFixed(1)}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_,i) => <FiStar key={i} size={12} className={i < Math.round(course.averageRating) ? 'text-yellow-400' : 'text-gray-600'} style={{ fill: i < Math.round(course.averageRating) ? '#FACC15' : 'transparent' }} />)}
                    </div>
                    <span className="text-gray-500">({course.totalReviews})</span>
                  </div>
                )}
                <span className="flex items-center gap-1 text-gray-400"><FiUsers size={13} /> {course.enrolledCount?.toLocaleString() || 0} enrolled</span>
                {totalLessons > 0 && <span className="flex items-center gap-1 text-gray-400"><FiBookOpen size={13} /> {totalLessons} lessons</span>}
                {totalDuration > 0 && <span className="flex items-center gap-1 text-gray-400"><FiClock size={13} /> {Math.floor(totalDuration/3600)}h {Math.floor((totalDuration%3600)/60)}m</span>}
              </div>

              {/* Instructor mini */}
              {course.instructor && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Instructor:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold overflow-hidden">
                      {course.instructor.avatar ? <img src={course.instructor.avatar} alt="" className="w-full h-full object-cover" /> : course.instructor.name?.[0]}
                    </div>
                    <span className="text-yellow-400 font-medium">{course.instructor.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Enroll Card — desktop (hidden on mobile, shown in sidebar below) */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <EnrollCard course={course} isEnrolled={isEnrolled} onEnroll={handleEnroll}
                coupon={coupon} setCoupon={setCoupon} discount={discount} setDiscount={setDiscount} applying={applying} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ background: '#0A0A0F' }} className="min-h-screen">
        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              {/* Tabs */}
              <div className="flex gap-0 border border-gray-700 rounded-xl overflow-hidden mb-8">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-yellow-500 text-gray-900' : 'bg-gray-900 text-gray-400 hover:text-white'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview */}
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* What you'll learn */}
                  {course.whatYouLearn?.length > 0 && (
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                      <h2 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
                        <FiCheckCircle className="text-yellow-400" /> What You'll Learn
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.whatYouLearn.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <FiCheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                    <h2 className="text-white font-bold text-xl mb-4">About This Course</h2>
                    <div className="prose-dark text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: course.description?.replace(/\n/g, '<br/>') }} />
                  </div>

                  {/* Requirements */}
                  {course.requirements?.length > 0 && (
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                      <h2 className="text-white font-bold text-xl mb-4">Requirements</h2>
                      <ul className="space-y-2">
                        {course.requirements.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-yellow-400 mt-0.5">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {course.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1.5 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Curriculum */}
              {activeTab === 'curriculum' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm">{course.sections?.length || 0} sections • {totalLessons} lessons • {Math.floor(totalDuration/3600)}h total</p>
                    {!isEnrolled && <p className="text-yellow-400 text-xs">🔒 Enroll to access all lessons</p>}
                  </div>
                  {course.sections?.map((section, i) => (
                    <SectionAccordion key={i} section={section} isEnrolled={isEnrolled} completedLessons={user?.completedLessons || []} />
                  ))}
                  {!course.sections?.length && (
                    <div className="text-center py-10 bg-gray-900 border border-gray-700 rounded-2xl">
                      <p className="text-gray-500">Curriculum will be published soon.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Instructor */}
              {activeTab === 'instructor' && course.instructor && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-3xl font-bold overflow-hidden flex-shrink-0">
                      {course.instructor.avatar ? <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" /> : course.instructor.name?.[0]}
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl">{course.instructor.name}</h2>
                      <p className="text-yellow-400 text-sm">Founder & Head Mentor — ELITE Trading Academy</p>
                      {course.instructor.expertise?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {course.instructor.expertise.map(e => <span key={e} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{e}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                  {course.instructor.bio && <p className="text-gray-300 text-sm leading-relaxed mb-4">{course.instructor.bio}</p>}
                  {course.instructor.socialLinks && (
                    <div className="flex gap-3">
                      {Object.entries(course.instructor.socialLinks).filter(([,v]) => v).map(([platform, url]) => (
                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                          className="text-gray-500 hover:text-yellow-400 transition-colors capitalize text-sm border border-gray-700 px-3 py-1.5 rounded-lg hover:border-yellow-500/30">
                          {platform}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Reviews */}
              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {course.reviews?.length > 0 ? (
                    <>
                      {/* Average */}
                      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-5 flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-yellow-400">{course.averageRating?.toFixed(1)}</div>
                          <div className="flex justify-center gap-0.5 mt-1">
                            {[...Array(5)].map((_,i) => <FiStar key={i} size={14} className={i < Math.round(course.averageRating) ? 'text-yellow-400' : 'text-gray-600'} style={{ fill: i < Math.round(course.averageRating) ? '#FACC15' : 'transparent' }} />)}
                          </div>
                          <p className="text-gray-500 text-xs mt-1">{course.totalReviews} reviews</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {course.reviews.slice(0,10).map((review, i) => (
                          <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-9 h-9 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold text-sm overflow-hidden">
                                {review.user?.avatar ? <img src={review.user.avatar} alt="" className="w-full h-full object-cover" /> : review.user?.name?.[0]}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{review.user?.name}</p>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_,j) => <FiStar key={j} size={11} className={j < review.rating ? 'text-yellow-400' : 'text-gray-600'} style={{ fill: j < review.rating ? '#FACC15' : 'transparent' }} />)}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl">
                      <div className="text-5xl mb-3">⭐</div>
                      <h3 className="text-white font-bold text-lg mb-1">No reviews yet</h3>
                      <p className="text-gray-500 text-sm">Be the first to review this course after enrollment.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Mobile Enroll Card */}
            <div className="lg:hidden">
              <EnrollCard course={course} isEnrolled={isEnrolled} onEnroll={handleEnroll}
                coupon={coupon} setCoupon={setCoupon} discount={discount} setDiscount={setDiscount} applying={applying} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
