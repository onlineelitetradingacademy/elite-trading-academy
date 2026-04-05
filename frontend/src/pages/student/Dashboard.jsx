import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../context/store';
import { courseAPI, webinarAPI } from '../../utils/api';
import { FiBook, FiPlay, FiBarChart2, FiCalendar, FiArrowRight, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, w] = await Promise.all([
          courseAPI.getMyCourses(),
          webinarAPI.getAll()
        ]);
        setCourses(c.data.data || []);
        setWebinars(w.data.data?.filter(w => w.status === 'upcoming').slice(0, 3) || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const overallProgress = courses.length
    ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length)
    : 0;

  const statCards = [
    { label: 'Enrolled Courses', value: courses.length, icon: FiBook, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Overall Progress', value: `${overallProgress}%`, icon: FiTrendingUp, color: 'text-profit', bg: 'bg-profit/10' },
    { label: 'Lessons Completed', value: user?.completedLessons?.length || 0, icon: FiCheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Upcoming Webinars', value: webinars.length, icon: FiCalendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <>
      <Helmet><title>Dashboard — ELITE Trading Academy</title></Helmet>
      <div className="space-y-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow opacity-30" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-gold text-sm font-semibold mb-1">Welcome back 👋</p>
              <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
              <p className="text-muted text-sm">Keep learning and keep growing. You're doing great!</p>
            </div>
            <Link to="/courses" className="btn-gold flex items-center gap-2 text-sm whitespace-nowrap">
              Browse Courses <FiArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center">
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mx-auto mb-3`}>
                <card.icon size={22} className={card.color} />
              </div>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-muted text-xs mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* My Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Continue Learning</h2>
            <Link to="/dashboard/courses" className="text-gold text-sm hover:underline flex items-center gap-1">All Courses <FiArrowRight size={12} /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2].map(i => <div key={i} className="h-32 shimmer rounded-xl" />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <FiBook size={40} className="text-muted mx-auto mb-4 opacity-30" />
              <h3 className="text-white font-medium mb-2">No courses yet</h3>
              <p className="text-muted text-sm mb-4">Start learning with our expert-led courses</p>
              <Link to="/courses" className="btn-gold text-sm px-6 py-2.5 inline-flex">Browse Courses</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.slice(0, 4).map((course, i) => (
                <motion.div key={course._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-4 flex gap-4 hover:border-gold/30 transition-all group">
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200'} alt={course.title} className="w-20 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-gold transition-colors">{course.title}</h3>
                    <p className="text-muted text-xs mt-1 mb-2">{course.completedLessons}/{course.totalLessons} lessons</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-dark-600 rounded-full h-1.5">
                        <div className="bg-gold h-1.5 rounded-full transition-all duration-500" style={{ width: `${course.progress || 0}%` }} />
                      </div>
                      <span className="text-gold text-xs font-semibold">{course.progress || 0}%</span>
                    </div>
                    <Link to={`/dashboard/courses/${course.slug}/learn`}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-gold hover:underline">
                      <FiPlay size={11} /> Continue
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Webinars */}
        {webinars.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Upcoming Webinars</h2>
              <Link to="/webinars" className="text-gold text-sm hover:underline flex items-center gap-1">All Webinars <FiArrowRight size={12} /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {webinars.map((w, i) => (
                <motion.div key={w._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {w.isFree ? <span className="badge-green text-xs">FREE</span> : <span className="badge-gold text-xs">₹{w.price}</span>}
                    <span className="text-xs text-muted capitalize">{w.platform}</span>
                  </div>
                  <h3 className="text-white text-sm font-medium mb-2 line-clamp-2">{w.title}</h3>
                  <div className="flex items-center gap-2 text-muted text-xs mb-3">
                    <FiClock size={11} />
                    <span>{new Date(w.scheduledAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} IST</span>
                  </div>
                  <Link to={`/webinars`} className="btn-outline text-xs w-full text-center py-2">Register</Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
