import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { webinarAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiClock } from 'react-icons/fi';

const empty = { title:'', description:'', scheduledAt:'', platform:'zoom', joinLink:'', price:0, isFree:true, maxAttendees:100, status:'upcoming' };

export default function AdminWebinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);

  const fetch = () => { setLoading(true); webinarAPI.getAll().then(r => setWebinars(r.data.data || [])).catch(() => setWebinars([])).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!form.title || !form.scheduledAt) { toast.error('Title and date required'); return; }
    setSaving(true);
    try {
      if (editing) await webinarAPI.update(editing._id, form);
      else await webinarAPI.create(form);
      toast.success(editing ? 'Updated!' : 'Created!');
      setShowForm(false); setEditing(null); setForm(empty); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this webinar?')) return;
    try { await webinarAPI.delete(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (w) => {
    setEditing(w);
    setForm({ ...w, scheduledAt: w.scheduledAt ? new Date(w.scheduledAt).toISOString().slice(0,16) : '' });
    setShowForm(true);
  };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const statusColors = { upcoming:'bg-blue-500/10 text-blue-400', live:'bg-green-500/10 text-green-400 animate-pulse', completed:'bg-gray-700 text-gray-400', cancelled:'bg-red-500/10 text-red-400' };

  return (
    <>
      <Helmet><title>Manage Webinars — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Webinars</h1><p className="text-gray-500 text-sm mt-1">{webinars.length} webinars</p></div>
          <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm"><FiPlus size={16} /> New Webinar</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-white font-bold text-lg mb-5">{editing ? 'Edit Webinar' : 'New Webinar'}</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-400 block mb-1">Title *</label><input value={form.title} onChange={e => f('title', e.target.value)} placeholder="Free Forex Strategy Session" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Description</label><textarea rows={2} value={form.description} onChange={e => f('description', e.target.value)} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Date & Time *</label><input type="datetime-local" value={form.scheduledAt} onChange={e => f('scheduledAt', e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Platform</label>
                    <select value={form.platform} onChange={e => f('platform', e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                      <option value="zoom">Zoom</option><option value="google_meet">Google Meet</option><option value="youtube">YouTube Live</option><option value="other">Other</option>
                    </select></div>
                </div>
                <div><label className="text-xs text-gray-400 block mb-1">Join Link</label><input value={form.joinLink} onChange={e => f('joinLink', e.target.value)} placeholder="https://zoom.us/j/..." className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Price (₹)</label><input type="number" value={form.price} disabled={form.isFree} onChange={e => f('price', Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none disabled:opacity-50" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Max Attendees</label><input type="number" value={form.maxAttendees} onChange={e => f('maxAttendees', Number(e.target.value))} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Status</label>
                    <select value={form.status} onChange={e => f('status', e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                      <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                    </select></div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFree} onChange={e => { f('isFree', e.target.checked); if (e.target.checked) f('price', 0); }} className="accent-yellow-500" /><span className="text-sm text-gray-300">Free Webinar</span></label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(3)].map((_,i) => <div key={i} className="h-44 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)
          : webinars.length === 0 ? <div className="col-span-3 text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl"><p className="text-gray-500">No webinars yet</p></div>
          : webinars.map(w => (
            <div key={w._id} className="bg-gray-900 border border-gray-700 hover:border-yellow-500/20 rounded-2xl p-5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[w.status] || 'bg-gray-700 text-gray-400'}`}>{w.status}</span>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(w)} className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20"><FiEdit2 size={12} /></button>
                  <button onClick={() => del(w._id)} className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"><FiTrash2 size={12} /></button>
                </div>
              </div>
              <h3 className="text-white font-bold mb-1 line-clamp-2">{w.title}</h3>
              <p className="text-gray-500 text-xs mb-3 flex items-center gap-1"><FiClock size={10} /> {w.scheduledAt ? new Date(w.scheduledAt).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : 'TBD'} IST</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1"><FiUsers size={11} /> {w.registeredUsers?.length || 0}/{w.maxAttendees || '∞'}</span>
                <span className={w.isFree ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>{w.isFree ? 'FREE' : `₹${w.price}`}</span>
              </div>
              <p className="text-gray-600 text-xs mt-2 capitalize">{w.platform?.replace('_',' ')}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
