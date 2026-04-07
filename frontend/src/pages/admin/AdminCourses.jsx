import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { courseAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiStar, FiUsers, FiSearch } from 'react-icons/fi';

const categoryLabels = { forex:'Forex', stocks:'Stocks', crypto:'Crypto', commodity:'Commodity', options:'Options', technical_analysis:'Tech Analysis', risk_management:'Risk Mgmt', psychology:'Psychology', combo:'Combo' };
const typeColors = { recorded:'bg-purple-500/10 text-purple-400', live_online:'bg-blue-500/10 text-blue-400', live_offline:'bg-orange-500/10 text-orange-400', mentorship:'bg-pink-500/10 text-pink-400', free:'bg-green-500/10 text-green-400' };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    courseAPI.adminGetAll().then(r => setCourses(r.data.data || [])).catch(() => setCourses([])).finally(() => setLoading(false));
  }, []);

  const togglePublish = async (id) => {
    try {
      await courseAPI.togglePublish(id);
      setCourses(prev => prev.map(c => c._id === id ? { ...c, isPublished: !c.isPublished } : c));
      toast.success('Course status updated');
    } catch { toast.error('Failed to update'); }
  };

  const deleteCourse = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await courseAPI.delete(id);
      setCourses(prev => prev.filter(c => c._id !== id));
      toast.success('Course deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const filtered = courses.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.category?.includes(search.toLowerCase()));

  return (
    <>
      <Helmet><title>Manage Courses — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
            <p className="text-gray-500 text-sm mt-1">{courses.length} total courses</p>
          </div>
          <button onClick={() => toast('Course builder coming soon — contact support to add courses')}
            className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm">
            <FiPlus size={16} /> Add New Course
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all placeholder-gray-500" />
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800">
                  {['Course', 'Category', 'Type', 'Price', 'Students', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_,i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {[...Array(8)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>)}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">No courses found</td></tr>
                ) : (
                  filtered.map((course, i) => (
                    <motion.tr key={course._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100'} alt="" className="w-10 h-8 rounded-lg object-cover flex-shrink-0" />
                          <span className="text-white text-sm font-medium line-clamp-1 max-w-[200px]">{course.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-gray-400 text-xs capitalize">{categoryLabels[course.category] || course.category}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full capitalize ${typeColors[course.courseType] || 'bg-gray-700 text-gray-400'}`}>{course.courseType?.replace('_',' ')}</span></td>
                      <td className="px-4 py-3"><span className={`text-sm font-semibold ${course.isFree ? 'text-green-400' : 'text-yellow-400'}`}>{course.isFree ? 'FREE' : `₹${course.price?.toLocaleString()}`}</span></td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-gray-400 text-sm"><FiUsers size={12} />{course.enrolledCount || 0}</span></td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-yellow-400 text-sm"><FiStar size={12} />{course.averageRating?.toFixed(1) || '—'}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${course.isPublished ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-700 text-gray-400'}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => togglePublish(course._id)} title={course.isPublished ? 'Unpublish' : 'Publish'}
                            className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                            {course.isPublished ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                          <button onClick={() => toast('Edit course — full editor coming soon')} title="Edit"
                            className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-all">
                            <FiEdit2 size={14} />
                          </button>
                          <button onClick={() => deleteCourse(course._id)} disabled={deleting === course._id} title="Delete"
                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all disabled:opacity-40">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
