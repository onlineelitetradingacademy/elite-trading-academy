import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { franchiseAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const statusColors = { new:'bg-blue-500/10 text-blue-400 border-blue-500/20', contacted:'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', qualified:'bg-green-500/10 text-green-400 border-green-500/20', rejected:'bg-red-500/10 text-red-400 border-red-500/20', converted:'bg-purple-500/10 text-purple-400 border-purple-500/20' };

export default function AdminFranchise() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchLeads = () => { setLoading(true); franchiseAPI.getAll({ status: filter === 'all' ? undefined : filter }).then(r => setLeads(r.data.data || [])).catch(() => setLeads([])).finally(() => setLoading(false)); };
  useEffect(() => { fetchLeads(); }, [filter]);

  const updateStatus = async (id, status) => {
    try { await franchiseAPI.update(id, { status }); fetchLeads(); toast.success('Status updated'); }
    catch { toast.error('Failed'); }
  };

  return (
    <>
      <Helmet><title>Franchise Leads — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Franchise Leads</h1><p className="text-gray-500 text-sm mt-1">{leads.length} leads</p></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all','new','contacted','qualified','rejected','converted'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>{s === 'all' ? 'All Leads' : s}</button>
          ))}
        </div>
        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="h-40 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)}</div>
        : leads.length === 0 ? <div className="text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl"><p className="text-gray-500">No franchise leads yet</p></div>
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map(lead => (
              <div key={lead._id} className="bg-gray-900 border border-gray-700 hover:border-yellow-500/20 rounded-2xl p-5 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold">{lead.name}</h3>
                    <p className="text-gray-500 text-xs">{lead.profession} • {lead.investmentRange}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${statusColors[lead.status] || 'bg-gray-700 text-gray-400'}`}>{lead.status}</span>
                </div>
                <div className="space-y-1.5 mb-4">
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"><FiPhone size={12} /> {lead.phone}</a>
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"><FiMail size={12} /> {lead.email}</a>
                  <p className="flex items-center gap-2 text-xs text-gray-400"><FiMapPin size={12} /> {lead.city}</p>
                </div>
                {lead.message && <p className="text-gray-500 text-xs mb-3 bg-gray-800 rounded-lg p-2 italic">"{lead.message}"</p>}
                <div className="flex gap-2 flex-wrap">
                  {['new','contacted','qualified','rejected','converted'].filter(s => s !== lead.status).map(s => (
                    <button key={s} onClick={() => updateStatus(lead._id, s)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg capitalize transition-all">{s}</button>
                  ))}
                </div>
                <p className="text-gray-600 text-xs mt-2">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
