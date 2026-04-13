import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { supportAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiUser, FiUsers, FiArrowRight, FiCheckCircle, FiPhone } from 'react-icons/fi';

const plans = [
  {
    id: '1on1',
    label: '1 on 1',
    icon: FiUser,
    tagline: 'Complete Personal Attention',
    description: 'Dedicated 1-on-1 sessions with your personal mentor. Full focus on your trading journey, your charts, your mistakes.',
    price: 25000,
    originalPrice: 35000,
    sessions: '12 sessions',
    duration: '60 min each',
    features: [
      'Dedicated personal mentor',
      'Your charts analysed every session',
      'Custom trading plan built for you',
      'WhatsApp support between sessions',
      'Trade review after every session',
      'Certificate of completion',
    ],
    badge: '⭐ Most Personal',
    color: 'border-yellow-500/50 bg-yellow-500/5',
    btnClass: 'bg-yellow-500 hover:bg-yellow-400 text-gray-900',
  },
  {
    id: '1on2',
    label: '1 on 2',
    icon: FiUsers,
    tagline: 'Shared Learning, Better Value',
    description: 'Learn alongside one partner. Share costs, share insights, still get personalised attention from your mentor.',
    price: 15000,
    originalPrice: 22000,
    sessions: '12 sessions',
    duration: '75 min each',
    features: [
      'Mentor for 2 students',
      'Group chart analysis sessions',
      'Custom plan for each student',
      'Shared WhatsApp group with mentor',
      'Trade review included',
      'Certificate of completion',
    ],
    badge: '🔥 Best Value',
    color: 'border-blue-500/50 bg-blue-500/5',
    btnClass: 'bg-blue-500 hover:bg-blue-400 text-white',
  },
  {
    id: '1on3',
    label: '1 on 3',
    icon: FiUsers,
    tagline: 'Small Group, Big Results',
    description: 'Learn in a focused group of 3. Build peer accountability while getting expert guidance at an accessible price.',
    price: 10000,
    originalPrice: 16000,
    sessions: '12 sessions',
    duration: '90 min each',
    features: [
      'Mentor for 3 students',
      'Group trading sessions',
      'Individual progress tracking',
      'Group WhatsApp with mentor',
      'Weekly trade review',
      'Certificate of completion',
    ],
    badge: '💰 Most Affordable',
    color: 'border-green-500/50 bg-green-500/5',
    btnClass: 'bg-green-500 hover:bg-green-400 text-white',
  },
];

function EnquiryModal({ plan, onClose, isAuthenticated, navigate }) {
  const { register, handleSubmit } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('postLoginAction', JSON.stringify({ type: 'mentorship_enquiry', planId: plan.id, planLabel: plan.label, data }));
      navigate('/auth/login', { state: { from: { pathname: '/mentorship' }, message: 'Login to apply for mentorship' } });
      return;
    }
    setSubmitting(true);
    try {
      await supportAPI.create({
        subject: `Mentorship Enquiry: ${plan.label} Programme`,
        message: `I am interested in the ${plan.label} mentorship programme.\n\nPlan: ${plan.label} (${plan.sessions}, ${plan.duration})\nPrice: ₹${plan.price.toLocaleString()}\n\nMy query: ${data.message}`,
        category: 'course',
        phone: data.phone,
        name: data.name,
      });
      toast.success('Application submitted! Check your Support tab for our response. 🎉');
      onClose();
      navigate('/dashboard/support');
    } catch (err) {
      toast.error('Failed to submit. Please try WhatsApp.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-white font-bold text-lg mb-1">Apply for {plan.label} Mentorship</h3>
        <p className="text-yellow-400 text-sm mb-5">₹{plan.price.toLocaleString()} • {plan.sessions}</p>
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
            <label className="text-xs text-gray-400 block mb-1.5">Your Trading Experience</label>
            <select className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
              {...register('message')}>
              <option value="Complete beginner — never traded before">Complete beginner</option>
              <option value="Beginner — traded a few times">Beginner — traded a few times</option>
              <option value="Intermediate — trading for 1-2 years but inconsistent">Intermediate — 1-2 years, inconsistent</option>
              <option value="Experienced — looking to go professional">Experienced — going professional</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60 hover:bg-yellow-400">
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Mentorship() {
  const [selected, setSelected]       = useState(null);
  const { isAuthenticated }           = useAuthStore();
  const navigate                      = useNavigate();

  return (
    <>
      <Helmet><title>Personal Mentorship — ELITE Trading Academy</title></Helmet>
      {selected && (
        <EnquiryModal plan={selected} onClose={() => setSelected(null)}
          isAuthenticated={isAuthenticated} navigate={navigate} />
      )}

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden" style={{ background: '#0A0A0F' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(240,165,0,0.15), transparent)' }} />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
            👤 Personal Mentorship
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-5 tracking-wide leading-tight">
            LEARN DIRECTLY<br />
            <span style={{ background: 'linear-gradient(135deg,#F0A500,#FFD166)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FROM YOUR MENTOR</span>
          </h1>
          <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
            Personalised trading mentorship — 1 on 1, 1 on 2, or 1 on 3. Choose the format that works best for your learning style and budget.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-white mb-3">CHOOSE YOUR <span style={{ background: 'linear-gradient(135deg,#F0A500,#FFD166)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FORMAT</span></h2>
            <p className="text-gray-400">All plans include 12 structured sessions. Pick the one that fits you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className={`relative border-2 rounded-2xl p-6 transition-all hover:-translate-y-1 ${plan.color}`}>
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-900 border border-gray-600 text-xs font-semibold px-3 py-1 rounded-full text-white whitespace-nowrap">{plan.badge}</span>
                </div>

                {/* Icon + Label */}
                <div className="text-center mb-5 mt-2">
                  <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <plan.icon size={26} className="text-yellow-400" />
                  </div>
                  <h3 className="font-display text-3xl text-white tracking-wide">{plan.label}</h3>
                  <p className="text-yellow-400 text-sm font-medium mt-1">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-5">
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-4xl font-bold text-white">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm line-through mb-1">₹{plan.originalPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{plan.sessions} • {plan.duration}</p>
                  <p className="text-green-400 text-xs font-semibold mt-1">
                    Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm text-center mb-5 leading-relaxed">{plan.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCheckCircle size={13} className="text-yellow-400 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button onClick={() => setSelected(plan)}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all ${plan.btnClass}`}>
                  Apply for {plan.label} <FiArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Per-person note for shared plans */}
          <p className="text-gray-500 text-xs text-center mt-6">* Prices are per person. For 1 on 2 and 1 on 3 plans, each participant pays their individual fee.</p>
        </div>
      </section>

      {/* Why Mentorship */}
      <section className="py-16 bg-gray-900 border-y border-gray-700">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl text-white mb-3">WHY CHOOSE <span style={{ background: 'linear-gradient(135deg,#F0A500,#FFD166)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MENTORSHIP?</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: '🎯', title: 'Personalised Guidance', desc: 'Your specific trades, your specific mistakes, fixed by your mentor in real time.' },
              { icon: '📊', title: 'Live Chart Analysis', desc: 'Every session includes live analysis of actual market setups — not theory.' },
              { icon: '📱', title: 'WhatsApp Support', desc: 'Message your mentor between sessions for trade reviews and quick advice.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-gray-800 border border-gray-600 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" style={{ background: '#0A0A0F' }}>
        <div className="container-custom max-w-2xl mx-auto">
          <h2 className="font-display text-3xl text-white text-center mb-8">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How are sessions conducted?', a: 'All sessions are conducted via Zoom or Google Meet. You will receive the link in your Support section after registration.' },
              { q: 'Can I choose my session schedule?', a: 'Yes, session timings are fixed mutually between you and your mentor after registration.' },
              { q: 'What markets do you cover?', a: 'Forex, Stocks, Crypto, Commodity and Options — based on your interest and goals.' },
              { q: 'What if I miss a session?', a: 'Sessions can be rescheduled with 24 hours notice. All sessions are recorded and shared.' },
              { q: 'Is EMI available?', a: 'Yes, EMI options are available via Razorpay on select cards. Mention this in your enquiry.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
                <p className="text-white font-semibold text-sm mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
