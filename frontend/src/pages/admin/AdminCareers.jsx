import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { careerAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';

const empty = { title:'', department:'', location:'Ludhiana, Punjab', type:'full_time', description:'', requirements:'', isActive:true, isRemote:false };

export default function AdminCareers() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);

  const fetch = () => { setLoading(true); careerAPI.getAll().then(r => setJobs(r.data.data || [])).catch(() => setJobs([])).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!form.title) { toast.error('Job title required'); return; }
    setSaving(true);
    try {
      if (editing) await careerAPI.update(editing._id, form);
      else await careerAPI.create(form);
      toast.success(editing ? 'Job updated!' : 'Job posted!');
      setShowForm(false); setEditing(null); setForm(empty); fetch();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Remove this job listing?')) return;
    try { await careerAPI.delete(id); toast.success('Removed'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const toggle = async (job) => {
    try { await careerAPI.update(job._id, { isActive: !job.isActive }); fetch(); toast.success('Updated'); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (j) => { setEditing(j); setForm(j); setShowForm(true); };
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <>
      <Helmet><title>Careers — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Career Listings</h1><p className="text-gray-500 text-sm mt-1">{jobs.filter(j => j.isActive).length} active openings</p></div>
          <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm"><FiPlus size={16} /> Post Job</button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-white font-bold text-lg mb-5">{editing ? 'Edit Job' : 'Post New Job'}</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-400 block mb-1">Job Title *</label><input value={form.title} onChange={e => f('title', e.target.value)} placeholder="Senior Trading Mentor" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Department</label><input value={form.department} onChange={e => f('department', e.target.value)} placeholder="Education" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Location</label><input value={form.location} onChange={e => f('location', e.target.value)} className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div><label className="text-xs text-gray-400 block mb-1">Type</label>
                  <select value={form.type} onChange={e => f('type', e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                    <option value="full_time">Full Time</option><option value="part_time">Part Time</option><option value="contract">Contract</option><option value="internship">Internship</option>
                  </select></div>
                <div><label className="text-xs text-gray-400 block mb-1">Job Description</label><textarea rows={4} value={form.description} onChange={e => f('description', e.target.value)} placeholder="Describe the role, responsibilities..." className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Requirements</label><textarea rows={3} value={form.requirements} onChange={e => f('requirements', e.target.value)} placeholder="Skills, experience, qualifications..." className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none" /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => f('isActive', e.target.checked)} className="accent-yellow-500" /><span className="text-sm text-gray-300">Active</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isRemote} onChange={e => f('isRemote', e.target.checked)} className="accent-yellow-500" /><span className="text-sm text-gray-300">Remote OK</span></label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
                <button onClick={save} disabled={saving} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}

        {loading ? <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="h-24 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)}</div>
        : jobs.length === 0 ? <div className="text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl"><FiBriefcase size={32} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-500">No job listings yet</p></div>
        : (
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job._id} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${job.isActive ? 'border-gray-700 hover:border-yellow-500/20' : 'border-gray-800 opacity-60'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-white font-bold">{job.title}</h3>
                      {job.isRemote && <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Remote</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${job.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'}`}>{job.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {job.department && <span>📁 {job.department}</span>}
                      <span>📍 {job.location}</span>
                      <span className="capitalize">🕐 {job.type?.replace('_',' ')}</span>
                    </div>
                    {job.description && <p className="text-gray-500 text-xs mt-2 line-clamp-2">{job.description}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toggle(job)} className={`text-xs px-3 py-1.5 rounded-lg transition-all ${job.isActive ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>{job.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => startEdit(job)} className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20"><FiEdit2 size={13} /></button>
                    <button onClick={() => del(job._id)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"><FiTrash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
