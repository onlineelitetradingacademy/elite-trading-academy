import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from '../common/AnnouncementBar';
import { useSettingsStore } from '../../context/store';

export default function MainLayout() {
  const location = useLocation();
  const { announcement } = useSettingsStore();

  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {announcement && <AnnouncementBar data={announcement} />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
