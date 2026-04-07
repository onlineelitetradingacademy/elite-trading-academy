import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { testimonialAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';

const emptyForm = { name: '', city: '', rating: 5, text: '', course: '', type: 'text', isActive: true, isFeatured: false };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = () => { setLoading(true); testimonialAPI.getAll().then(r => setItems(r.data.data || [])).catch(() => setItems([])).finally(() => setLoading(false)); };
  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.text) { toast.error('Name and testimonial text required'); return; }
    setSaving(true);
    try {
      if (editing) await testimonialAPI.update(editing._id, form);
      else await testimonialAPI.create(form);
      toast.success(editing ? 'Updated!' : 'Added!');
      setShowForm(false); setEditing(null); setForm(emptyForm); fetchItems();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await testimonialAPI.delete(id); toast.success('Deleted'); fetchItems(); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (item) => { setEditing(item); setForm(item); setShowForm(true); };
  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <>
      <Helmet><title>Testimonials — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Student Testimonials</h1><p className="text-gray-500 text-sm mt-1">{items.length} testimonials</p></div>
          <button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
            className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm">
            <FiPlus size={16} /> Add Testimonial
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-white font-bold text-lg mb-5">{editing ? 'Edit' : 'Add'} Testimonial</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Name *</label><input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Student name" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">City</label><input value={form.city} onChange={e => f('city', e.target.value)} placeholder="Mumbai" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Course</label><input value={form.course} onChange={e => f('course', e.target.value)} placeholder="Course name" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Rating</label>
                    <select value={form.rating} onChange={e => f('rating', Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select></div>
                </div>
                <div><label className="text-xs text-gray-400 block mb-1">Testimonial Text *</label>
                  <textarea rows={4} value={form.text} onChange={e => f('text', e.target.value)} placeholder="Write the student's testimonial..." className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => f('isActive', e.target.checked)} className="accent-yellow-500" /><span className="text-sm text-gray-300">Active</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e => f('isFeatured', e.target.checked)} className="accent-yellow-500" /><span className="text-sm text-gray-300">Featured</span></label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(6)].map((_,i) => <div key={i} className="h-40 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)
          : items.length === 0 ? <div className="col-span-3 text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl"><p className="text-gray-500">No testimonials yet</p></div>
          : items.map(item => (
            <div key={item._id} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${item.isFeatured ? 'border-yellow-500/30' : 'border-gray-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-0.5">{[...Array(item.rating||5)].map((_,j) => <FiStar key={j} size={12} className="text-yellow-400" style={{ fill:'#FACC15' }} />)}</div>
                <div className="flex gap-1">
                  {item.isFeatured && <span className="text-xs text-yellow-400">⭐</span>}
                  <button onClick={() => startEdit(item)} className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20"><FiEdit2 size={11} /></button>
                  <button onClick={() => deleteItem(item._id)} className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"><FiTrash2 size={11} /></button>
                </div>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3 italic line-clamp-3">"{item.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-gray-500 text-xs">{item.city}{item.course ? ` · ${item.course}` : ''}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'}`}>{item.isActive ? 'Active' : 'Hidden'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
