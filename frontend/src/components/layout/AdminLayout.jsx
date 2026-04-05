import { Outlet, NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../context/store';
import { FiHome, FiBook, FiUsers, FiFileText, FiCalendar, FiVideo, FiDollarSign, FiTag, FiUserCheck, FiGlobe, FiImage, FiSettings, FiHelpCircle, FiBriefcase, FiStar, FiMenu, FiLogOut, FiTrendingUp } from 'react-icons/fi';

const navGroups = [
  { label: 'Overview', items: [
    { label: 'Dashboard',    href: '/admin',              icon: FiHome, end: true },
    { label: 'Revenue',      href: '/admin/revenue',      icon: FiDollarSign },
  ]},
  { label: 'Content', items: [
    { label: 'Courses',      href: '/admin/courses',      icon: FiBook },
    { label: 'Batches',      href: '/admin/batches',      icon: FiCalendar },
    { label: 'Webinars',     href: '/admin/webinars',     icon: FiVideo },
    { label: 'Blog',         href: '/admin/blog',         icon: FiFileText },
    { label: 'Gallery',      href: '/admin/gallery',      icon: FiImage },
    { label: 'Testimonials', href: '/admin/testimonials', icon: FiStar },
  ]},
  { label: 'Users', items: [
    { label: 'All Users',    href: '/admin/users',        icon: FiUsers },
    { label: 'Affiliate',    href: '/admin/affiliate',    icon: FiTrendingUp },
    { label: 'Franchise Leads', href: '/admin/franchise', icon: FiGlobe },
  ]},
  { label: 'Marketing', items: [
    { label: 'Coupons',      href: '/admin/coupons',      icon: FiTag },
    { label: 'Resources',    href: '/admin/resources',    icon: FiUserCheck },
  ]},
  { label: 'System', items: [
    { label: 'Support',      href: '/admin/support',      icon: FiHelpCircle },
    { label: 'Careers',      href: '/admin/careers',      icon: FiBriefcase },
    { label: 'Settings',     href: '/admin/settings',     icon: FiSettings },
  ]},
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-800 border-r border-dark-500 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-5 border-b border-dark-500 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center font-display text-dark-900 text-xl font-bold">E</div>
            <div>
              <div className="font-display text-white text-sm tracking-wider">ELITE</div>
              <div className="text-gold text-[9px] tracking-widest">ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-6">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="text-muted text-xs font-semibold uppercase tracking-widest mb-2 px-4">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon, end }) => (
                  <NavLink key={href} to={href} end={end}
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted hover:text-white hover:bg-dark-600'}`}>
                    <Icon size={15} /> {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold text-sm font-bold">{user?.name?.[0]}</span>
            </div>
            <div>
              <p className="text-white text-xs font-medium truncate max-w-[140px]">{user?.name}</p>
              <p className="text-gold text-[10px] capitalize">{user?.role}</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-muted hover:text-white transition-colors mb-1">← View Website</Link>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-xs text-muted hover:text-loss w-full transition-colors">
            <FiLogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden flex items-center justify-between p-4 bg-dark-800 border-b border-dark-500">
          <button onClick={() => setSidebarOpen(true)}><FiMenu size={22} className="text-white" /></button>
          <span className="text-gold font-semibold text-sm">Admin Panel</span>
          <div />
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
