import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { affiliateAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiDollarSign, FiUsers, FiTrendingUp, FiSearch } from 'react-icons/fi';

const statusColors = {
  pending:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  suspended:'bg-gray-700 text-gray-400',
};

export default function AdminAffiliate() {
  const [affiliates, setAffiliates] = useState([]);
  const [payouts, setPayouts]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState('affiliates');
  const [search, setSearch]         = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      affiliateAPI.adminGetAll(),
      affiliateAPI.adminGetPayouts(),
    ]).then(([ar, pr]) => {
      setAffiliates(ar.data.data || []);
      setPayouts(pr.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await affiliateAPI.adminUpdate(id, { status });
      toast.success(`Affiliate ${status}`);
      fetchData();
    } catch { toast.error('Failed to update'); }
  };

  const processPayout = async (id, status) => {
    try {
      await affiliateAPI.adminProcessPayout(id, { status });
      toast.success(`Payout ${status}`);
      fetchData();
    } catch { toast.error('Failed'); }
  };

  const filtered = affiliates.filter(a =>
    a.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.code?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Affiliates', value: affiliates.length, icon: FiUsers, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active', value: affiliates.filter(a => a.status === 'approved').length, icon: FiTrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Pending Approval', value: affiliates.filter(a => a.status === 'pending').length, icon: FiUsers, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Total Paid Out', value: `₹${payouts.filter(p => p.status === 'completed').reduce((a, p) => a + p.amount, 0).toLocaleString()}`, icon: FiDollarSign, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <>
      <Helmet><title>Affiliate Management — Admin</title></Helmet>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Affiliate Management</h1><p className="text-gray-500 text-sm mt-1">Manage affiliates and payout requests</p></div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon size={18} className={s.color} /></div>
              <div className={`text-xl font-bold ${s.color}`}>{loading ? '...' : s.value}</div>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['affiliates', 'payouts'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>
              {t} {t === 'payouts' && payouts.filter(p => p.status === 'pending').length > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{payouts.filter(p => p.status === 'pending').length}</span>}
            </button>
          ))}
        </div>

        {tab === 'affiliates' && (
          <>
            <div className="relative max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input type="text" placeholder="Search affiliates..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none placeholder-gray-500" />
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-700 bg-gray-800">
                    {['Affiliate', 'Code', 'Clicks', 'Conversions', 'Earned', 'Pending', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {loading ? [...Array(4)].map((_,i) => <tr key={i} className="border-b border-gray-800">{[...Array(8)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>)}</tr>)
                    : filtered.length === 0 ? <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">No affiliates found</td></tr>
                    : filtered.map(aff => (
                      <tr key={aff._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold">{aff.user?.name?.[0]}</div>
                            <div><p className="text-white text-sm font-medium">{aff.user?.name}</p><p className="text-gray-500 text-xs">{aff.user?.email}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><code className="text-yellow-400 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded">{aff.code}</code></td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{aff.totalClicks || 0}</td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{aff.totalConversions || 0}</td>
                        <td className="px-4 py-3 text-yellow-400 text-sm font-semibold">₹{aff.totalEarnings?.toLocaleString() || 0}</td>
                        <td className="px-4 py-3 text-green-400 text-sm font-semibold">₹{aff.pendingEarnings?.toLocaleString() || 0}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${statusColors[aff.status] || 'bg-gray-700 text-gray-400'}`}>{aff.status}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {aff.status === 'pending' && <>
                              <button onClick={() => updateStatus(aff._id, 'approved')} className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-all" title="Approve"><FiCheck size={13} /></button>
                              <button onClick={() => updateStatus(aff._id, 'rejected')} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all" title="Reject"><FiX size={13} /></button>
                            </>}
                            {aff.status === 'approved' && <button onClick={() => updateStatus(aff._id, 'suspended')} className="text-xs bg-gray-700 text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-all">Suspend</button>}
                            {aff.status === 'suspended' && <button onClick={() => updateStatus(aff._id, 'approved')} className="text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-all">Reinstate</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'payouts' && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gray-700 bg-gray-800">
                  {['Affiliate', 'Amount', 'Method', 'Status', 'Requested', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {loading ? [...Array(3)].map((_,i) => <tr key={i} className="border-b border-gray-800">{[...Array(6)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>)}</tr>)
                  : payouts.length === 0 ? <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No payout requests yet</td></tr>
                  : payouts.map(p => (
                    <tr key={p._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-white text-sm">{p.affiliate?.user?.name || '—'}</td>
                      <td className="px-4 py-3 text-yellow-400 font-bold text-sm">₹{p.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm capitalize">{p.method}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-500/10 text-green-400' : p.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>{p.status}</span></td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        {p.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => processPayout(p._id, 'completed')} className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-400 transition-all font-medium">Approve</button>
                            <button onClick={() => processPayout(p._id, 'rejected')} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all">Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
