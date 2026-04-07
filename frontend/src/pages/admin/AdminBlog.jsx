import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { blogAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch, FiStar } from 'react-icons/fi';

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'market_analysis', tags: '', isPublished: false, isFeatured: false });
  const [saving, setSaving] = useState(false);

  const fetchBlogs = () => {
    setLoading(true);
    blogAPI.adminGetAll().then(r => setBlogs(r.data.data || [])).catch(() => setBlogs([])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchBlogs(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error('Title and content are required'); return; }
    setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editing) await blogAPI.update(editing._id, data);
      else await blogAPI.create(data);
      toast.success(editing ? 'Blog updated!' : 'Blog created!');
      setShowForm(false); setEditing(null);
      setForm({ title:'', excerpt:'', content:'', category:'market_analysis', tags:'', isPublished:false, isFeatured:false });
      fetchBlogs();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try { await blogAPI.delete(id); toast.success('Deleted'); fetchBlogs(); }
    catch { toast.error('Failed to delete'); }
  };

  const togglePublish = async (blog) => {
    try { await blogAPI.update(blog._id, { isPublished: !blog.isPublished, publishedAt: !blog.isPublished ? new Date() : null }); fetchBlogs(); toast.success('Updated'); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (blog) => {
    setEditing(blog);
    setForm({ title: blog.title, excerpt: blog.excerpt || '', content: blog.content, category: blog.category, tags: blog.tags?.join(', ') || '', isPublished: blog.isPublished, isFeatured: blog.isFeatured });
    setShowForm(true);
  };

  const filtered = blogs.filter(b => b.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Helmet><title>Manage Blog — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Blog & Market Analysis</h1><p className="text-gray-500 text-sm mt-1">{blogs.length} posts</p></div>
          <button onClick={() => { setEditing(null); setForm({ title:'', excerpt:'', content:'', category:'market_analysis', tags:'', isPublished:false, isFeatured:false }); setShowForm(true); }}
            className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm">
            <FiPlus size={16} /> New Post
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl">
              <h3 className="text-white font-bold text-lg mb-5">{editing ? 'Edit Post' : 'New Blog Post'}</h3>
              <div className="space-y-4">
                <div><label className="text-sm text-gray-400 block mb-1.5">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Blog post title"
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div><label className="text-sm text-gray-400 block mb-1.5">Excerpt</label>
                  <input value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} placeholder="Short description"
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-400 block mb-1.5">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                      {['market_analysis','forex','stocks','crypto','commodity','technical_analysis','trading_tips','news','education'].map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                    </select></div>
                  <div><label className="text-sm text-gray-400 block mb-1.5">Tags (comma separated)</label>
                    <input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="forex, trading, strategy"
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div><label className="text-sm text-gray-400 block mb-1.5">Content (HTML supported) *</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} rows={10} placeholder="Write your blog post content here..."
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({...f, isPublished: e.target.checked}))} className="accent-yellow-500" /><span className="text-sm text-gray-300">Publish</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({...f, isFeatured: e.target.checked}))} className="accent-yellow-500" /><span className="text-sm text-gray-300">Featured</span></label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60 hover:bg-yellow-400">{saving ? 'Saving...' : 'Save Post'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
          <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none placeholder-gray-500" />
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-700 bg-gray-800">
                {['Title','Category','Views','Status','Date','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>)}
              </tr></thead>
              <tbody>
                {loading ? [...Array(4)].map((_,i) => <tr key={i} className="border-b border-gray-800">{[...Array(6)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>)}</tr>)
                : filtered.length === 0 ? <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No blog posts found</td></tr>
                : filtered.map(blog => (
                  <tr key={blog._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white text-sm font-medium line-clamp-1 max-w-xs">{blog.title}</p>
                        {blog.isFeatured && <span className="text-xs text-yellow-400 flex items-center gap-1"><FiStar size={10} /> Featured</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs capitalize">{blog.category?.replace('_',' ')}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{blog.views || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${blog.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePublish(blog)} title={blog.isPublished ? 'Unpublish' : 'Publish'}
                          className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                          {blog.isPublished ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                        </button>
                        <button onClick={() => startEdit(blog)} className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-all">
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => deleteBlog(blog._id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all">
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
