import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { userAPI, paymentAPI } from '../../utils/api';
import { FiUsers, FiBook, FiDollarSign, FiTrendingUp, FiArrowRight, FiActivity } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-muted mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>₹{p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes] = await Promise.all([
          userAPI.getStats(),
          paymentAPI.getAnalytics({ period: 'monthly' })
        ]);
        setStats(statsRes.data.data);
        setRevenue(revenueRes.data.data?.revenueByPeriod || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Students',   value: stats?.totalUsers?.toLocaleString() || '—',        icon: FiUsers,     color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20', link: '/admin/users' },
    { label: 'Active Courses',   value: stats?.totalCourses || '—',                         icon: FiBook,      color: 'text-gold',        bg: 'bg-gold/10',       border: 'border-gold/20',     link: '/admin/courses' },
    { label: 'Total Revenue',    value: `₹${stats?.totalRevenue?.toLocaleString() || '0'}`, icon: FiDollarSign,color: 'text-profit',      bg: 'bg-profit/10',     border: 'border-profit/20',   link: '/admin/revenue' },
    { label: 'Total Enrollments',value: stats?.totalEnrollments?.toLocaleString() || '—',  icon: FiTrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20',link: '/admin/revenue' },
  ];

  const quickActions = [
    { label: 'Add New Course',    href: '/admin/courses',      icon: '📚' },
    { label: 'Create Blog Post',  href: '/admin/blog',         icon: '✍️' },
    { label: 'Add Batch',         href: '/admin/batches',      icon: '📅' },
    { label: 'Create Coupon',     href: '/admin/coupons',      icon: '🎟️' },
    { label: 'Update Settings',   href: '/admin/settings',     icon: '⚙️' },
    { label: 'Franchise Leads',   href: '/admin/franchise',    icon: '🤝' },
    { label: 'View Affiliates',   href: '/admin/affiliate',    icon: '💰' },
    { label: 'Support Tickets',   href: '/admin/support',      icon: '🎯' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — ELITE Trading Academy</title></Helmet>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted text-sm mt-1">Welcome back! Here's what's happening at ELITE Trading Academy.</p>
          </div>
          <Link to="/admin/settings" className="btn-outline text-sm px-4 py-2 flex items-center gap-2">
            ⚙️ Site Settings
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={card.link} className={`glass-card p-5 flex items-center gap-4 hover:border-gold/30 transition-all block`}>
                <div className={`w-12 h-12 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center flex-shrink-0`}>
                  <card.icon size={22} className={card.color} />
                </div>
                <div>
                  <p className="text-muted text-xs mb-1">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{loading ? '...' : card.value}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold text-lg">Revenue Overview</h2>
              <p className="text-muted text-xs">Monthly revenue trend</p>
            </div>
            <Link to="/admin/revenue" className="text-gold text-sm hover:underline flex items-center gap-1">Full Report <FiArrowRight size={12} /></Link>
          </div>
          {revenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenue} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E45" />
                <XAxis dataKey="_id" tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#F0A500" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center">
              <div className="text-center text-muted">
                <FiActivity size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Revenue data will appear here once payments are recorded</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action, i) => (
              <motion.div key={action.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Link to={action.href}
                  className="glass-card p-4 flex flex-col items-center gap-2 text-center hover:border-gold/30 hover:bg-gold/5 transition-all group">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-muted text-xs group-hover:text-white transition-colors">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
