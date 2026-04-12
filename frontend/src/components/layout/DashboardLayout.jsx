import { Outlet, NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../context/store';
import { FiHome, FiBook, FiBarChart2, FiUsers, FiUser, FiHelpCircle, FiMenu, FiLogOut } from 'react-icons/fi';
import { supportAPI } from '../../utils/api';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);

  // Poll for unread admin replies every 30 seconds
  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await supportAPI.getMy();
        const list = Array.isArray(res.data?.data) ? res.data.data
          : Array.isArray(res.data) ? res.data : [];
        // Count tickets with admin replies that are still open/in_progress
        const unread = list.filter(t =>
          t.replies?.some(r => r.isAdmin) &&
          (t.status === 'open' || t.status === 'in_progress')
        ).length;
        setUnreadCount(unread);
      } catch { /* silent */ }
    };
    checkUnread();
    const interval = setInterval(checkUnread, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Overview',      href: '/dashboard',               icon: FiHome },
    { label: 'My Courses',    href: '/dashboard/courses',       icon: FiBook },
    { label: 'Trading Tools', href: '/dashboard/trading-tools', icon: FiBarChart2 },
    { label: 'Affiliate Hub', href: '/dashboard/affiliate',     icon: FiUsers },
    { label: 'Profile',       href: '/dashboard/profile',       icon: FiUser },
    { label: 'Support',       href: '/dashboard/support',       icon: FiHelpCircle, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-800 border-r border-dark-500 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-dark-500">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center font-display text-dark-900 text-lg font-bold">E</div>
              <div>
                <div className="font-display text-white text-sm tracking-wider">ELITE</div>
                <div className="text-gold text-[9px] tracking-widest">TRADING ACADEMY</div>
              </div>
            </Link>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-dark-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                {user?.avatar
                  ? <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                  : <span className="text-gold font-bold">{user?.name?.[0]}</span>}
              </div>
              <div>
                <p className="text-white text-sm font-medium truncate max-w-[140px]">{user?.name}</p>
                <p className="text-muted text-xs capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(({ label, href, icon: Icon, badge }) => (
              <NavLink key={href} to={href} end={href === '/dashboard'}
                onClick={() => { if (label === 'Support') setUnreadCount(0); }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted hover:text-white hover:bg-dark-600'}`
                }>
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-dark-500 space-y-2">
            {['admin','sub_admin'].includes(user?.role) && (
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gold hover:bg-gold/10 transition-all">
                ⚙️ Admin Panel
              </Link>
            )}
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted hover:text-loss hover:bg-loss/10 w-full transition-all">
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden flex items-center justify-between p-4 bg-dark-800 border-b border-dark-500">
          <button onClick={() => setSidebarOpen(true)}><FiMenu size={22} className="text-white" /></button>
          <span className="text-gold font-semibold text-sm">Student Dashboard</span>
          <div />
        </div>
        <div className="p-6 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
