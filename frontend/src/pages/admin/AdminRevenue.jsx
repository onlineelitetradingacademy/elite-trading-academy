import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { paymentAPI } from '../../utils/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { FiDollarSign, FiTrendingUp, FiShoppingBag, FiUsers } from 'react-icons/fi';

const COLORS = ['#F0A500','#3B82F6','#10B981','#A855F7'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color: p.color }}>₹{p.value?.toLocaleString()}</p>)}
    </div>
  );
};

export default function AdminRevenue() {
  const [analytics, setAnalytics] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    Promise.all([
      paymentAPI.getAnalytics({ period }),
      paymentAPI.getAll({ limit: 10 })
    ]).then(([ar, pr]) => {
      setAnalytics(ar.data.data);
      setPayments(pr.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  const statCards = [
    { label: 'Total Revenue', value: `₹${analytics?.last30Days?.revenue?.toLocaleString() || 0}`, sub: 'Last 30 days', icon: FiDollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Total Sales', value: analytics?.last30Days?.count || 0, sub: 'Last 30 days', icon: FiShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Avg Order Value', value: analytics?.last30Days?.count ? `₹${Math.round((analytics.last30Days.revenue||0)/analytics.last30Days.count).toLocaleString()}` : '₹0', sub: 'Per transaction', icon: FiTrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Top Course', value: analytics?.topCourses?.[0]?._id?.substring(0,15) || '—', sub: `₹${analytics?.topCourses?.[0]?.revenue?.toLocaleString() || 0}`, icon: FiUsers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <>
      <Helmet><title>Revenue Analytics — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Revenue & Analytics</h1><p className="text-gray-500 text-sm mt-1">Track your business performance</p></div>
          <div className="flex gap-2">
            {['daily','monthly'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${period === p ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>{p}</button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon size={20} className={card.color} />
              </div>
              <p className="text-gray-500 text-xs mb-1">{card.label}</p>
              <p className={`text-xl font-bold ${card.color} truncate`}>{loading ? '...' : card.value}</p>
              <p className="text-gray-600 text-xs mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-700 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Revenue Trend</h3>
            {analytics?.revenueByPeriod?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.revenueByPeriod} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="_id" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#F0A500" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-500 text-sm">No revenue data yet. Data appears after first payment.</div>
            )}
          </div>

          {/* Revenue by Type Pie */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Revenue by Type</h3>
            {analytics?.revenueByType?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={analytics.revenueByType} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ _id, percent }) => `${_id} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {analytics.revenueByType.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `₹${v?.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-52 flex items-center justify-center text-gray-500 text-sm">No data yet</div>}
          </div>
        </div>

        {/* Top Courses */}
        {analytics?.topCourses?.length > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Top Performing Courses</h3>
            <div className="space-y-3">
              {analytics.topCourses.map((c,i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm font-bold w-5">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{c._id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${(c.revenue/analytics.topCourses[0].revenue)*100}%` }} />
                      </div>
                      <span className="text-yellow-400 text-xs font-semibold whitespace-nowrap">₹{c.revenue?.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">{c.enrollments} sales</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Payments */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-semibold">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-700 bg-gray-800">
                {['User','Course','Amount','Status','Date'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}
              </tr></thead>
              <tbody>
                {loading ? [...Array(5)].map((_,i) => <tr key={i}>{[...Array(5)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>)}</tr>)
                : payments.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No payments yet</td></tr>
                : payments.map(p => (
                  <tr key={p._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-white text-sm">{p.user?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm line-clamp-1 max-w-xs">{p.itemTitle || '—'}</td>
                    <td className="px-4 py-3 text-yellow-400 text-sm font-semibold">₹{p.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-500/10 text-green-400' : p.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>{p.status}</span></td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
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
