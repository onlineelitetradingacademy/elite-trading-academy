import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { galleryAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi';

const types = ['photo','video','award','event','telegram'];

export default function AdminGallery() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ title:'', url:'', type:'photo', caption:'' });
  const [saving, setSaving]     = useState(false);
  const [filterType, setFilter] = useState('all');

  const fetch = () => { setLoading(true); galleryAPI.getAll().then(r => setItems(r.data.data || [])).catch(() => setItems([])).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!form.url) { toast.error('URL is required'); return; }
    setSaving(true);
    try { await galleryAPI.create(form); toast.success('Added to gallery!'); setShowForm(false); setForm({ title:'', url:'', type:'photo', caption:'' }); fetch(); }
    catch { toast.error('Failed to add'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Remove from gallery?')) return;
    try { await galleryAPI.delete(id); toast.success('Removed'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const filtered = filterType === 'all' ? items : items.filter(i => i.type === filterType);

  return (
    <>
      <Helmet><title>Gallery — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Gallery</h1><p className="text-gray-500 text-sm mt-1">{items.length} items</p></div>
          <button onClick={() => setShowForm(true)} className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm"><FiPlus size={16} /> Add Media</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-white font-bold text-lg mb-5">Add to Gallery</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-400 block mb-1">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {types.map(t => <button key={t} onClick={() => f('type', t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${form.type === t ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>{t}</button>)}
                  </div></div>
                <div><label className="text-xs text-gray-400 block mb-1">Image/Video URL *</label><input value={form.url} onChange={e => f('url', e.target.value)} placeholder="https://cloudinary.com/..." className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Title</label><input value={form.title} onChange={e => f('title', e.target.value)} placeholder="Photo/video title" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Caption (optional)</label><input value={form.caption} onChange={e => f('caption', e.target.value)} placeholder="Short caption" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                {form.url && <div className="rounded-xl overflow-hidden h-40 border border-gray-700">
                  {form.type === 'video' ? <video src={form.url} className="w-full h-full object-cover" /> : <img src={form.url} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />}
                </div>}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? 'Adding...' : 'Add to Gallery'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {['all', ...types].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filterType === t ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>{t === 'all' ? 'All' : t}</button>
          ))}
        </div>

        {loading ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{[...Array(8)].map((_,i) => <div key={i} className="aspect-square bg-gray-900 border border-gray-700 rounded-xl animate-pulse" />)}</div>
        : filtered.length === 0 ? <div className="text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl"><FiImage size={32} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-500">No gallery items yet</p></div>
        : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(item => (
              <div key={item._id} className="group relative aspect-square bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-500/30 transition-all">
                {item.type === 'video' ? <video src={item.url} className="w-full h-full object-cover" /> : <img src={item.thumbnail || item.url} alt={item.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <p className="text-white text-xs font-medium text-center px-2 line-clamp-2">{item.title}</p>
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full capitalize">{item.type}</span>
                  <button onClick={() => del(item._id)} className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-400 transition-all"><FiTrash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
