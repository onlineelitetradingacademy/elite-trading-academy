import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { webinarAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiUsers, FiPlay, FiCheckCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export default function Webinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    webinarAPI.getAll().then(r => setWebinars(r.data.data || [])).catch(() => setWebinars([])).finally(() => setLoading(false));
  }, []);

  const handleRegister = async (id) => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      navigate('/auth/login', { state: { from: { pathname: '/webinars' } } });
      return;
    }
    try {
      await webinarAPI.register(id);
      toast.success('Registered! Redirecting to your dashboard... 🎉');
      setWebinars(prev => prev.map(w => w._id === id ? { ...w, _registered: true } : w));
      setTimeout(() => navigate('/dashboard/webinars'), 1500);
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
  };

  const upcoming = webinars.filter(w => w.status === 'upcoming');
  const recorded  = webinars.filter(w => w.status === 'completed' && w.recordingUrl);

  return (
    <>
      <Helmet><title>Webinars — ELITE Trading Academy</title></Helmet>
      <section className="relative pt-28 pb-14 overflow-hidden" style={{ background: '#0A0A0F' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(240,165,0,0.1), transparent)' }} />
        <div className="container-custom relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">🎥 Live Sessions</span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            LIVE <span style={{ background: 'linear-gradient(135deg,#F0A500,#FFD166)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WEBINARS</span>
          </h1>
          <p className="text-gray-400 text-lg">Join our live sessions — free and paid — on trading strategies, market analysis and more.</p>
        </div>
      </section>

      <section className="py-12" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_,i) => <div key={i} className="h-48 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)}
            </div>
          ) : upcoming.length === 0 && recorded.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-white text-xl font-bold mb-2">No webinars scheduled</h3>
              <p className="text-gray-500 mb-6">Follow us on Instagram to get notified of upcoming webinars.</p>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Upcoming Webinars
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {upcoming.map((w, i) => (
                      <motion.div key={w._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-6 transition-all">
                        <div className="flex items-center gap-2 mb-3">
                          {w.isFree ? <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-semibold">🆓 FREE</span>
                            : <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full font-semibold">₹{w.price}</span>}
                          <span className="text-xs text-gray-500 capitalize">{w.platform}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-3">{w.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{w.description}</p>
                        <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(w.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1"><FiClock size={11} /> {new Date(w.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                          {w.duration && <span className="flex items-center gap-1"><FiPlay size={11} /> {w.duration} mins</span>}
                          {w.maxAttendees && <span className="flex items-center gap-1"><FiUsers size={11} /> {w.registeredUsers?.length || 0}/{w.maxAttendees}</span>}
                        </div>
                        {w._registered ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                            <FiCheckCircle size={16} /> Registered! Check dashboard for link.
                          </div>
                        ) : w.isFree ? (
                          <button onClick={() => handleRegister(w._id)}
                            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                            Register Free
                          </button>
                        ) : (
                          <Link to={`/checkout?item=${w._id}&type=Webinar`}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl text-sm transition-colors block text-center">
                            Register ₹{w.price}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {recorded.length > 0 && (
                <div>
                  <h2 className="text-white font-bold text-xl mb-5">📁 Recorded Sessions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recorded.map((w, i) => (
                      <motion.div key={w._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
                        <div className="relative">
                          <video src={w.recordingUrl} className="w-full h-40 object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center"><FiPlay size={18} className="text-gray-900 ml-1" /></div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{w.title}</h3>
                          <p className="text-gray-500 text-xs">{new Date(w.scheduledAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
