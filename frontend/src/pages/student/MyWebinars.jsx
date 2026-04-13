import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { webinarAPI } from '../../utils/api';
import { FiCalendar, FiClock, FiExternalLink, FiPlay, FiVideo } from 'react-icons/fi';

export default function MyWebinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Get all webinars — backend returns meetingLink only for registered users
    webinarAPI.getAll()
      .then(r => {
        const all = r.data.data || [];
        // Only show ones user is registered for (they will have meetingLink)
        setWebinars(all.filter(w => w.isRegistered || w.meetingLink));
      })
      .catch(() => setWebinars([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming  = webinars.filter(w => w.status === 'upcoming');
  const recorded  = webinars.filter(w => w.status === 'completed');

  return (
    <>
      <Helmet><title>My Webinars — ELITE Trading Academy</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Webinars</h1>
          <p className="text-gray-500 text-sm mt-1">Your registered webinars and join links</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_,i) => <div key={i} className="h-40 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)}
          </div>
        ) : webinars.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl">
            <FiVideo size={40} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">No webinars registered yet</h3>
            <p className="text-gray-500 text-sm mb-5">Register for upcoming webinars to see join links here</p>
            <Link to="/webinars" className="bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors">
              Browse Webinars
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Upcoming Webinars
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcoming.map((w, i) => (
                    <motion.div key={w._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-gray-900 border border-green-500/20 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        {w.isFree ? <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-semibold">🆓 FREE</span>
                          : <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full font-semibold">₹{w.price}</span>}
                        <span className="text-xs text-gray-500 capitalize">{w.platform?.replace('_',' ')}</span>
                      </div>
                      <h3 className="text-white font-bold mb-2">{w.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(w.scheduledAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                        <span className="flex items-center gap-1"><FiClock size={11} /> {new Date(w.scheduledAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })} IST</span>
                      </div>
                      {w.joinLink || w.meetingLink ? (
                        <a href={w.joinLink || w.meetingLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors w-full">
                          <FiExternalLink size={14} /> Join Webinar
                        </a>
                      ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5 text-center">
                          <p className="text-yellow-400 text-xs font-medium">✅ Registered — Join link will appear here before the session</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {recorded.length > 0 && (
              <div>
                <h2 className="text-white font-semibold mb-4">📁 Recorded Sessions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recorded.map((w, i) => (
                    <div key={w._id} className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
                      <h3 className="text-white font-bold mb-1 line-clamp-2">{w.title}</h3>
                      <p className="text-gray-500 text-xs mb-4">{new Date(w.scheduledAt).toLocaleDateString('en-IN')}</p>
                      {w.recordingUrl ? (
                        <a href={w.recordingUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 px-4 py-2.5 rounded-xl text-sm transition-all w-full">
                          <FiPlay size={14} /> Watch Recording
                        </a>
                      ) : (
                        <p className="text-gray-600 text-xs text-center">Recording processing...</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
