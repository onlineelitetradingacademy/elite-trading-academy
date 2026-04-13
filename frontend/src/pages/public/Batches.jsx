import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { batchAPI, supportAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiMonitor, FiArrowRight, FiMessageCircle } from 'react-icons/fi';

function EnquiryModal({ batch, onClose, isAuthenticated, navigate, location }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      // Save intent and redirect to login
      sessionStorage.setItem('postLoginAction', JSON.stringify({ type: 'batch_enquiry', batchId: batch._id, batchTitle: batch.title, data }));
      navigate('/auth/login', { state: { from: { pathname: '/batches' }, message: 'Login to submit your course enquiry' } });
      return;
    }
    setSubmitting(true);
    try {
      await supportAPI.create({
        subject: `Course Enquiry: ${batch.title}`,
        message: `Hi, I am interested in the batch: ${batch.title}.\n\nSchedule: ${batch.schedule}\nType: ${batch.type}\n\nMy query: ${data.message}`,
        category: 'course',
        phone: data.phone,
        name: data.name,
      });
      toast.success('Enquiry submitted! Check your Support tab for our response. 🎉');
      onClose();
      navigate('/dashboard/support');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-white font-bold text-lg mb-1">Course Enquiry</h3>
        <p className="text-yellow-400 text-sm mb-5">{batch.title}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Your Name *</label>
            <input placeholder="Full name" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none placeholder-gray-500"
              {...register('name', { required: true })} />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Phone / WhatsApp *</label>
            <input placeholder="+91 98765 43210" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none placeholder-gray-500"
              {...register('phone', { required: true })} />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">Your Question / Message *</label>
            <textarea rows={3} placeholder="What would you like to know about this batch?" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none placeholder-gray-500"
              {...register('message', { required: true })} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60 hover:bg-yellow-400">
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </div>
        </form>
        {!isAuthenticated && (
          <p className="text-gray-500 text-xs text-center mt-3">You'll be asked to login — your enquiry will be saved.</p>
        )}
      </div>
    </div>
  );
}

export default function Batches() {
  const [batches, setBatches]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [enquiryBatch, setEnquiryBatch] = useState(null);
  const { isAuthenticated }       = useAuthStore();
  const navigate                  = useNavigate();

  useEffect(() => {
    batchAPI.getAll({ isActive: true })
      .then(r => setBatches(r.data.data || []))
      .catch(() => setBatches([]))
      .finally(() => setLoading(false));
  }, []);

  // Handle post-login batch enquiry
  useEffect(() => {
    if (!isAuthenticated) return;
    const saved = sessionStorage.getItem('postLoginAction');
    if (!saved) return;
    try {
      const action = JSON.parse(saved);
      if (action.type === 'batch_enquiry') {
        sessionStorage.removeItem('postLoginAction');
        supportAPI.create({
          subject: `Course Enquiry: ${action.batchTitle}`,
          message: `Hi, I am interested in the batch: ${action.batchTitle}.\n\nMy query: ${action.data?.message}`,
          category: 'course',
          phone: action.data?.phone,
          name: action.data?.name,
        }).then(() => {
          toast.success('Enquiry submitted! Check your Support tab. 🎉');
          navigate('/dashboard/support');
        }).catch(() => {});
      }
    } catch { sessionStorage.removeItem('postLoginAction'); }
  }, [isAuthenticated]);

  const filtered = filter === 'all' ? batches : batches.filter(b => b.type === filter);

  return (
    <>
      <Helmet><title>Live Batches — ELITE Trading Academy</title></Helmet>
      {enquiryBatch && (
        <EnquiryModal batch={enquiryBatch} onClose={() => setEnquiryBatch(null)}
          isAuthenticated={isAuthenticated} navigate={navigate} />
      )}

      <section className="relative pt-28 pb-14 overflow-hidden" style={{ background: '#0A0A0F' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(240,165,0,0.1), transparent)' }} />
        <div className="container-custom relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
            <FiCalendar size={12} /> Live Batches
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            UPCOMING <span style={{ background: 'linear-gradient(135deg,#F0A500,#FFD166)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BATCHES</span>
          </h1>
          <p className="text-gray-400 text-lg">Join our structured live batches — online and offline — with fixed schedules and mentor-led sessions.</p>
        </div>
      </section>

      <section className="py-10" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {['all','online','offline'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === f ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>
                {f === 'all' ? 'All Batches' : f === 'online' ? '🖥️ Online' : '🏢 Offline'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_,i) => <div key={i} className="h-64 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-white text-xl font-bold mb-2">No batches available</h3>
              <p className="text-gray-500 mb-6">Check back soon or contact us for the next batch schedule.</p>
              <Link to="/contact" className="bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl text-sm">Contact Us</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((batch, i) => (
                <motion.div key={batch._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-6 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${batch.type === 'online' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                      {batch.type === 'online' ? <span className="flex items-center gap-1"><FiMonitor size={11} /> Online</span> : <span className="flex items-center gap-1"><FiMapPin size={11} /> Offline</span>}
                    </span>
                    {batch.isFeatured && <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">⭐ Popular</span>}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-4">{batch.title}</h3>
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiCalendar size={14} className="text-yellow-400" />
                      Starts {new Date(batch.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiClock size={14} className="text-yellow-400" /> {batch.schedule}
                    </div>
                    {batch.venue && <div className="flex items-center gap-2 text-sm text-gray-400"><FiMapPin size={14} className="text-yellow-400" /> {batch.venue}</div>}
                    <div className="flex items-center gap-2 text-sm">
                      <FiUsers size={14} className="text-yellow-400" />
                      <span className="text-gray-400">Seats: </span>
                      <span className={`font-semibold ${batch.totalSeats - batch.enrolledSeats < 5 ? 'text-red-400' : 'text-white'}`}>
                        {batch.totalSeats - batch.enrolledSeats} left of {batch.totalSeats}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${(batch.enrolledSeats/batch.totalSeats)*100}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div>
                      <span className="text-yellow-400 font-bold text-2xl">₹{batch.price?.toLocaleString()}</span>
                      {batch.originalPrice && <span className="text-gray-500 text-sm line-through ml-2">₹{batch.originalPrice?.toLocaleString()}</span>}
                    </div>
                    <button onClick={() => setEnquiryBatch(batch)}
                      className="flex items-center gap-1.5 bg-yellow-500 text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors">
                      <FiMessageCircle size={14} /> Enquire Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
