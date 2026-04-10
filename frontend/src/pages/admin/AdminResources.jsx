import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { resourceAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';

const empty = { title:'', description:'', type:'broker', affiliateLink:'', guideVideoUrl:'', image:'', badge:'', rating:5, tags:'' };
const types = ['broker','book','merchandise','tool'];

export default function AdminResources() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);
  const [filterType, setFilter] = useState('all');

  const fetch = () => { setLoading(true); resourceAPI.getAll().then(r => setItems(r.data.data || [])).catch(() => setItems([])).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!form.title) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      const data = { ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : form.tags };
      if (editing) await resourceAPI.update(editing._id, data);
      else await resourceAPI.create(data);
      toast.success(editing ? 'Updated!' : 'Added!');
      setShowForm(false); setEditing(null); setForm(empty); fetch();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Remove this resource?')) return;
    try { await resourceAPI.delete(id); toast.success('Removed'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '' });
    setShowForm(true);
  };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const filtered = filterType === 'all' ? items : items.filter(i => i.type === filterType);

  return (
    <>
      <Helmet><title>Resources — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Resources</h1><p className="text-gray-500 text-sm mt-1">Brokers, books, merchandise</p></div>
          <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm"><FiPlus size={16} /> Add Resource</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-white font-bold text-lg mb-5">{editing ? 'Edit Resource' : 'Add Resource'}</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-400 block mb-1">Type</label>
                  <div className="flex gap-2">{types.map(t => <button key={t} onClick={() => f('type', t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${form.type === t ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400'}`}>{t}</button>)}</div></div>
                <div><label className="text-xs text-gray-400 block mb-1">Name *</label><input value={form.title} onChange={e => f('title', e.target.value)} placeholder="Resource name" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Description</label><textarea rows={2} value={form.description} onChange={e => f('description', e.target.value)} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Affiliate / Buy Link</label><input value={form.affiliateLink} onChange={e => f('affiliateLink', e.target.value)} placeholder="https://..." className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                {form.type === 'broker' && <div><label className="text-xs text-gray-400 block mb-1">Guide Video URL (YouTube)</label><input value={form.guideVideoUrl} onChange={e => f('guideVideoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>}
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Image URL</label><input value={form.image} onChange={e => f('image', e.target.value)} placeholder="https://..." className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Badge (e.g. Recommended)</label><input value={form.badge} onChange={e => f('badge', e.target.value)} placeholder="⭐ Recommended" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Rating (1-5)</label><input type="number" min={1} max={5} step={0.5} value={form.rating} onChange={e => f('rating', Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Tags (comma separated)</label><input value={form.tags} onChange={e => f('tags', e.target.value)} placeholder="sebi regulated, low spread" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {['all', ...types].map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filterType === t ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>{t === 'all' ? 'All' : t}</button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-700 bg-gray-800">
                {['Resource','Type','Rating','Link','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}
              </tr></thead>
              <tbody>
                {loading ? [...Array(4)].map((_,i) => <tr key={i} className="border-b border-gray-800">{[...Array(5)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>)}</tr>)
                : filtered.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No resources found</td></tr>
                : filtered.map(item => (
                  <tr key={item._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image ? <img src={item.image} alt={item.title} className="w-10 h-8 rounded-lg object-cover" /> : <div className="w-10 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 text-xs capitalize">{item.type[0]}</div>}
                        <div><p className="text-white text-sm font-medium">{item.title}</p>{item.badge && <p className="text-xs text-yellow-400">{item.badge}</p>}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm capitalize">{item.type}</td>
                    <td className="px-4 py-3 text-yellow-400 text-sm">{'⭐'.repeat(Math.round(item.rating || 0))}</td>
                    <td className="px-4 py-3">{item.affiliateLink && <a href={item.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors"><FiExternalLink size={14} /></a>}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(item)} className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20"><FiEdit2 size={13} /></button>
                        <button onClick={() => del(item._id)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"><FiTrash2 size={13} /></button>
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
