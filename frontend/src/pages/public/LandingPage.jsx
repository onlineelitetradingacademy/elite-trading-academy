import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiCheckCircle, FiStar } from 'react-icons/fi';

export default function LandingPage() {
  const { variant } = useParams();
  const configs = {
    beginner: {
      headline: 'Start Trading From ZERO',
      sub: 'Complete beginner? Perfect. Our structured course takes you from zero to profitable in 90 days.',
      cta: 'Start For Free',
    },
    'loss-maker': {
      headline: 'Stop Losing Money in Markets',
      sub: 'Already trading but losing? Our proven system fixes bad habits and builds consistent profitability.',
      cta: 'Fix My Trading',
    },
    student: {
      headline: 'Learn Trading While You Study',
      sub: 'Special affordable programme for college students. Build financial skills that last a lifetime.',
      cta: 'Student Plans',
    },
    webinar: {
      headline: 'Join Our FREE Live Webinar',
      sub: "Learn proven trading strategies in 2 hours. Limited seats. Register now — it's completely free.",
      cta: 'Register Free',
    },
    mentorship: {
      headline: 'Personal 1-on-1 Mentorship',
      sub: 'Limited slots available. Get personalised guidance on your actual trades from our expert mentor.',
      cta: 'Apply Now',
    },
  };
  const c = configs[variant] || configs.beginner;

  return (
    <>
      <Helmet>
        <title>{c.headline} — ELITE Trading Academy</title>
      </Helmet>
      <div
        style={{ background: '#0A0A0F' }}
        className="min-h-screen flex flex-col"
      >
        {/* Minimal header */}
        <div className="flex justify-center p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center font-display text-gray-900 text-xl font-bold">
              E
            </div>
            <div>
              <div className="font-display text-white text-sm tracking-wider">
                ELITE
              </div>
              <div className="text-yellow-500 text-[9px] tracking-widest">
                TRADING ACADEMY
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 container-custom max-w-3xl mx-auto py-16 text-center">
          <div className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-6">
            🔥 Limited Time Offer
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-5 tracking-wide leading-tight">
            {c.headline}
          </h1>
          <p className="text-gray-400 text-xl mb-8 max-w-xl mx-auto">{c.sub}</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-10 py-5 rounded-xl hover:bg-yellow-400 transition-colors text-lg mb-4"
          >
            {c.cta} <FiArrowRight />
          </Link>
          <p className="text-gray-600 text-sm">
            No spam. No hidden fees. 7-day refund policy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              '5,000+ Students Trained',
              '8+ Years Experience',
              '95% Satisfaction Rate',
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center gap-2"
              >
                <FiCheckCircle
                  size={16}
                  className="text-yellow-400 flex-shrink-0"
                />
                <span className="text-white text-sm font-medium">{s}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1 mt-8">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={18}
                className="text-yellow-400"
                style={{ fill: '#FACC15' }}
              />
            ))}
            <span className="text-gray-400 text-sm ml-2">
              Rated 4.9/5 by 500+ students
            </span>
          </div>
        </div>

        <div className="text-center p-5 border-t border-gray-800">
          <p className="text-gray-600 text-xs">
            ⚠️ Trading involves risk. Educational content only — not financial
            advice.
          </p>
        </div>
      </div>
    </>
  );
}
