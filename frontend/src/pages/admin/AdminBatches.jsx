import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { batchAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiCalendar, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const empty = { title:'', description:'', type:'online', startDate:'', schedule:'', venue:'', price:0, originalPrice:'', totalSeats:30, isActive:true, isFeatured:false };

export default function AdminBatches() {
  const [batches, setBatches]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);

  const fetch = () => { setLoading(true); batchAPI.getAll().then(r => setBatches(r.data.data || [])).catch(() => setBatches([])).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!form.title || !form.startDate) { toast.error('Title and start date required'); return; }
    setSaving(true);
    try {
      if (editing) await batchAPI.update(editing._id, form);
      else await batchAPI.create(form);
      toast.success(editing ? 'Batch updated!' : 'Batch created!');
      setShowForm(false); setEditing(null); setForm(empty); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this batch?')) return;
    try { await batchAPI.delete(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const toggle = async (batch) => {
    try { await batchAPI.update(batch._id, { isActive: !batch.isActive }); fetch(); toast.success('Updated'); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (b) => { setEditing(b); setForm({ ...b, startDate: b.startDate?.split('T')[0] || '' }); setShowForm(true); };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <>
      <Helmet><title>Manage Batches — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Live Batches</h1><p className="text-gray-500 text-sm mt-1">{batches.length} batches</p></div>
          <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm"><FiPlus size={16} /> New Batch</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-white font-bold text-lg mb-5">{editing ? 'Edit Batch' : 'New Batch'}</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-400 block mb-1">Title *</label><input value={form.title} onChange={e => f('title', e.target.value)} placeholder="Forex Mastery Batch 7" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Description</label><textarea rows={2} value={form.description} onChange={e => f('description', e.target.value)} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Type</label>
                    <select value={form.type} onChange={e => f('type', e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                      <option value="online">Online</option><option value="offline">Offline</option>
                    </select></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Start Date *</label><input type="date" value={form.startDate} onChange={e => f('startDate', e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div><label className="text-xs text-gray-400 block mb-1">Schedule (timings)</label><input value={form.schedule} onChange={e => f('schedule', e.target.value)} placeholder="Mon/Wed/Fri 7-9 PM IST" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                {form.type === 'offline' && <div><label className="text-xs text-gray-400 block mb-1">Venue</label><input value={form.venue} onChange={e => f('venue', e.target.value)} placeholder="ELITE Academy, Ludhiana" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>}
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Price (₹)</label><input type="number" value={form.price} onChange={e => f('price', Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Original (₹)</label><input type="number" value={form.originalPrice} onChange={e => f('originalPrice', e.target.value)} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Total Seats</label><input type="number" value={form.totalSeats} onChange={e => f('totalSeats', Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => f('isActive', e.target.checked)} className="accent-yellow-500" /><span className="text-sm text-gray-300">Active</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e => f('isFeatured', e.target.checked)} className="accent-yellow-500" /><span className="text-sm text-gray-300">Featured</span></label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save Batch'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(3)].map((_,i) => <div key={i} className="h-48 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)
          : batches.length === 0 ? <div className="col-span-3 text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl"><FiCalendar size={32} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-500">No batches yet</p></div>
          : batches.map(batch => (
            <div key={batch._id} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${batch.isActive ? 'border-yellow-500/20' : 'border-gray-700 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mr-2 ${batch.type === 'online' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>{batch.type === 'online' ? '🖥️ Online' : '🏢 Offline'}</span>
                  {batch.isFeatured && <span className="text-xs text-yellow-400">⭐</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggle(batch)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${batch.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'}`}>{batch.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}</button>
                  <button onClick={() => startEdit(batch)} className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20"><FiEdit2 size={12} /></button>
                  <button onClick={() => del(batch._id)} className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"><FiTrash2 size={12} /></button>
                </div>
              </div>
              <h3 className="text-white font-bold mb-1">{batch.title}</h3>
              <p className="text-gray-500 text-xs mb-3">{batch.schedule}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1"><FiUsers size={11} /> {batch.enrolledSeats || 0}/{batch.totalSeats} seats</span>
                <span className="text-yellow-400 font-bold">₹{batch.price?.toLocaleString()}</span>
              </div>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${((batch.enrolledSeats || 0)/batch.totalSeats)*100}%` }} />
              </div>
              <p className="text-gray-600 text-xs mt-2 flex items-center gap-1"><FiCalendar size={10} /> {batch.startDate ? new Date(batch.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'TBD'}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
