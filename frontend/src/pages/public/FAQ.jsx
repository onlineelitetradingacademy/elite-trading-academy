import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiMessageCircle } from 'react-icons/fi';

const faqs = [
  {
    category: 'Courses',
    q: 'Do I need prior experience to join?',
    a: 'No, we have courses for complete beginners. Our Free Beginner Workshop is the perfect starting point with zero prior knowledge required.',
  },
  {
    category: 'Courses',
    q: 'Are courses in Hindi or English?',
    a: 'Most courses are bilingual — available in both Hindi and English. We also have English-only versions for international students.',
  },
  {
    category: 'Courses',
    q: 'How long do I get access to a course?',
    a: 'Recorded courses give you lifetime access. Live batch access is for the duration of the batch plus 6 months of recorded session access.',
  },
  {
    category: 'Courses',
    q: 'Do you provide a certificate?',
    a: 'Yes! Upon completing a course, you receive a digital certificate from ELITE Trading Academy which you can share on LinkedIn.',
  },
  {
    category: 'Payments',
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Wallets via Razorpay. EMI options are also available on select courses.',
  },
  {
    category: 'Payments',
    q: 'What is your refund policy?',
    a: 'We offer a 7-day refund on recorded courses if you are not satisfied. Live batches are non-refundable once started. Contact support for refund requests.',
  },
  {
    category: 'Payments',
    q: 'Do you offer discounts?',
    a: 'Yes! We run festive offers, early bird discounts and referral programmes. Subscribe to our newsletter or follow us on Instagram for the latest deals.',
  },
  {
    category: 'Learning',
    q: 'How are live classes conducted?',
    a: 'Live classes are conducted via Zoom/Google Meet, embedded directly within our platform. You never need to leave the website to attend class.',
  },
  {
    category: 'Learning',
    q: 'Can I watch recorded sessions?',
    a: 'Yes. All live sessions are recorded and made available within 24 hours for enrolled students, accessible lifetime.',
  },
  {
    category: 'Learning',
    q: 'Is there mentor support available?',
    a: 'Yes! Every batch includes dedicated Q&A sessions. You can also post questions in the lesson Q&A section and get answers from our mentors.',
  },
  {
    category: 'General',
    q: 'Is trading legal in India?',
    a: 'Yes, trading in regulated markets (NSE, BSE, MCX, SEBI-registered exchanges) is completely legal in India. Forex trading is also legal through SEBI-registered brokers.',
  },
  {
    category: 'General',
    q: 'How do I become an affiliate?',
    a: 'You need to have purchased at least ₹1,000 worth of courses. Then apply from your dashboard. Alternatively, contact admin for a manual bypass.',
  },
  {
    category: 'General',
    q: 'Do you offer franchise opportunities?',
    a: 'Yes! We have an exclusive franchise programme. Visit our Franchise page to learn more and apply. Full details are shared after initial screening.',
  },
];

const categories = ['All', 'Courses', 'Payments', 'Learning', 'General'];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>FAQ — ELITE Trading Academy</title>
      </Helmet>
      <section
        className="relative pt-28 pb-14 overflow-hidden"
        style={{ background: '#0A0A0F' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(240,165,0,0.1), transparent)',
          }}
        />
        <div className="container-custom relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
            ❓ FAQ
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            FREQUENTLY ASKED{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              QUESTIONS
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Everything you need to know about ELITE Trading Academy.
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: '#0A0A0F' }}>
        <div className="container-custom max-w-4xl mx-auto">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpen(null);
                }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                >
                  <span
                    className={`font-semibold text-sm md:text-base ${open === i ? 'text-yellow-400' : 'text-white'}`}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    className="flex-shrink-0"
                  >
                    <FiChevronDown
                      size={18}
                      className={
                        open === i ? 'text-yellow-400' : 'text-gray-500'
                      }
                    />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-700 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-14 bg-gray-900 border border-yellow-500/20 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🤔</div>
            <h3 className="text-white font-bold text-xl mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Our team is ready to help you. Reach out anytime.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/contact"
                className="bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-2.5 rounded-xl text-sm hover:bg-green-500/20 transition-all"
              >
                <FiMessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
