import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { courseAPI } from '../../utils/api';
import {
  FiPlay,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiSearch,
  FiFilter,
} from 'react-icons/fi';

function ProgressRing({ progress, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#374151"
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#F0A500"
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    courseAPI
      .getMyCourses()
      .then((r) => setCourses(r.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'in_progress')
      return matchSearch && c.progress > 0 && c.progress < 100;
    if (filter === 'completed') return matchSearch && c.progress === 100;
    if (filter === 'not_started') return matchSearch && c.progress === 0;
    return matchSearch;
  });

  const stats = {
    total: courses.length,
    completed: courses.filter((c) => c.progress === 100).length,
    inProgress: courses.filter((c) => c.progress > 0 && c.progress < 100)
      .length,
    avgProgress: courses.length
      ? Math.round(
          courses.reduce((a, c) => a + (c.progress || 0), 0) / courses.length,
        )
      : 0,
  };

  return (
    <>
      <Helmet>
        <title>My Courses — ELITE Trading Academy</title>
      </Helmet>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your learning progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Enrolled',
              value: stats.total,
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
            },
            {
              label: 'In Progress',
              value: stats.inProgress,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              label: 'Completed',
              value: stats.completed,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            {
              label: 'Avg Progress',
              value: `${stats.avgProgress}%`,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-4 text-center"
            >
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={15}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none placeholder-gray-500 transition-all"
            />
          </div>
          {['all', 'in_progress', 'completed', 'not_started'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-gray-700 rounded-2xl">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-white font-bold text-lg mb-2">
              {courses.length === 0
                ? 'No courses enrolled yet'
                : 'No courses match your filter'}
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              {courses.length === 0
                ? 'Start learning with our expert courses'
                : 'Try a different filter'}
            </p>
            {courses.length === 0 && (
              <Link
                to="/courses"
                className="bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
              >
                Browse Courses <FiArrowRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl overflow-hidden transition-all group"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img
                      src={
                        course.thumbnail ||
                        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200'
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {course.progress === 100 && (
                      <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                        <FiCheckCircle size={24} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                        {course.title}
                      </h3>
                      <ProgressRing progress={course.progress || 0} size={40} />
                    </div>
                    <p className="text-gray-500 text-xs mb-2 capitalize">
                      {course.category?.replace('_', ' ')}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>
                          {course.completedLessons}/{course.totalLessons}{' '}
                          lessons
                        </span>
                        <span className="text-yellow-400 font-semibold">
                          {course.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <motion.div
                          className="bg-yellow-500 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress || 0}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    <Link
                      to={`/dashboard/courses/${course.slug}/learn`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <FiPlay size={12} />
                      {course.progress === 0
                        ? 'Start Course'
                        : course.progress === 100
                          ? 'Review Course'
                          : 'Continue Learning'}
                    </Link>
                  </div>
                </div>

                {/* Bottom status bar */}
                <div
                  className={`px-4 py-2 text-xs font-medium flex items-center gap-2 ${course.progress === 100 ? 'bg-green-500/10 text-green-400' : course.progress > 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-500'}`}
                >
                  {course.progress === 100 ? (
                    <>
                      <FiCheckCircle size={12} /> Completed
                    </>
                  ) : course.progress > 0 ? (
                    <>
                      <FiBookOpen size={12} /> In Progress
                    </>
                  ) : (
                    <>
                      <FiClock size={12} /> Not Started
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Browse more */}
        {courses.length > 0 && (
          <div className="text-center pt-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
            >
              Browse More Courses <FiArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
