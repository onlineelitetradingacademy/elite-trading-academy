import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useSettingsStore } from '../../context/store';
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut, FiSettings, FiBook, FiBarChart2 } from 'react-icons/fi';

const navItems = [
  { label: 'Home',    href: '/' },
  { label: 'Courses', href: '/courses',
    dropdown: [
      { label: 'All Courses',          href: '/courses' },
      { label: 'Forex Trading',        href: '/courses?category=forex' },
      { label: 'Stock Market',         href: '/courses?category=stocks' },
      { label: 'Crypto Trading',       href: '/courses?category=crypto' },
      { label: 'Commodity Trading',    href: '/courses?category=commodity' },
      { label: 'Options & Derivatives',href: '/courses?category=options' },
      { label: 'Technical Analysis',   href: '/courses?category=technical_analysis' },
      { label: '─────────────',        href: null },
      { label: 'Live Batches',         href: '/batches' },
      { label: 'Free Workshop 🆓',     href: '/courses?isFree=true', badge: 'Free' },
    ]
  },
  { label: 'About Us', href: '/about',
    dropdown: [
      { label: 'About Us',    href: '/about' },
      { label: 'Testimonials',href: '/testimonials' },
      { label: "FAQ's",       href: '/faq' },
      { label: 'Gallery',     href: '/gallery' },
    ]
  },
  { label: 'Webinars',   href: '/webinars' },
  { label: 'Resources',  href: '/resources' },
  { label: 'Blog',       href: '/blog' },
  { label: 'More',       href: '#',
    dropdown: [
      { label: 'Financial Calculators', href: '/calculators' },
      { label: 'Franchise Programme',   href: '/franchise', badge: '🤝 New' },
      { label: 'Affiliate Programme',   href: '/affiliate' },
      { label: 'Careers',               href: '/careers' },
      { label: 'Contact Us',            href: '/contact' },
    ]
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userMenu, setUserMenu]   = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getSetting } = useSettingsStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setActiveDropdown(null);
        setUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-500' : 'bg-transparent'}`} ref={dropdownRef}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center font-display text-dark-900 text-xl font-bold transition-all group-hover:shadow-gold">E</div>
            <div>
              <div className="font-display text-white text-lg tracking-wider leading-none">ELITE</div>
              <div className="text-gold text-xs tracking-widest font-medium">TRADING ACADEMY</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeDropdown === item.label ? 'text-gold' : 'text-gray-300 hover:text-white'}`}
                    >
                      {item.label}
                      <FiChevronDown className={`transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180 text-gold' : ''}`} size={14} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-56 glass-card py-2 shadow-card"
                        >
                          {item.dropdown.map((d) => d.href === null ? (
                            <div key={d.label} className="border-t border-dark-500 my-1" />
                          ) : (
                            <Link key={d.label} to={d.href}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-500 transition-colors"
                            >
                              {d.label}
                              {d.badge && <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{d.badge}</span>}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <NavLink to={item.href}
                    className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-gold' : 'text-gray-300 hover:text-white'}`}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a href={getSetting('social_instagram', 'https://instagram.com')} target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors">
              <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-orange-400 rounded-md flex items-center justify-center">
                <svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <span className="font-semibold text-gold">{getSetting('social_instagram_followers', '12K+')}</span>
            </a>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-dark-600 hover:bg-dark-500 border border-dark-400 rounded-lg px-3 py-2 transition-all">
                  {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" /> : <FiUser size={16} className="text-gold" />}
                  <span className="text-sm text-white hidden sm:block max-w-[100px] truncate">{user?.name}</span>
                  <FiChevronDown size={14} className="text-muted" />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 glass-card py-2 shadow-card">
                      <div className="px-4 py-2 border-b border-dark-500">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-muted capitalize">{user?.role}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-500">
                        <FiBook size={14} /> My Dashboard
                      </Link>
                      <Link to="/dashboard/trading-tools" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-500">
                        <FiBarChart2 size={14} /> Trading Tools
                      </Link>
                      <Link to="/dashboard/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-500">
                        <FiSettings size={14} /> Profile
                      </Link>
                      {['admin','sub_admin'].includes(user?.role) && (
                        <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold hover:bg-gold/10">
                          <FiSettings size={14} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-dark-500 mt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-loss hover:bg-loss/10 transition-colors">
                          <FiLogOut size={14} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login" className="btn-ghost text-sm py-2 px-4 hidden sm:block">Login</Link>
                <Link to="/auth/register" className="btn-gold text-sm py-2 px-4">Join Now</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-gray-300 hover:text-white">
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-800 border-t border-dark-500 overflow-hidden">
            <div className="container-custom py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link to={item.href === '#' ? '/' : item.href} onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-600 rounded-lg font-medium transition-colors">
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-4 border-l border-dark-500 pl-3 mt-1 space-y-1">
                      {item.dropdown.filter(d => d.href).map((d) => (
                        <Link key={d.label} to={d.href} onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-sm text-muted hover:text-white transition-colors">
                          {d.label}
                          {d.badge && <span className="text-xs badge-gold">{d.badge}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-3 pt-4 border-t border-dark-500">
                  <Link to="/auth/login" onClick={() => setIsOpen(false)} className="btn-outline flex-1 text-center text-sm py-2">Login</Link>
                  <Link to="/auth/register" onClick={() => setIsOpen(false)} className="btn-gold flex-1 text-center text-sm py-2">Join Now</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
