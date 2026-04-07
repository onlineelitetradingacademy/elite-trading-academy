import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

function SIPCalc() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const n = years * 12;
  const r = rate / 100 / 12;
  const fv = monthly * (((1 + r) ** n - 1) / r) * (1 + r);
  const invested = monthly * n;
  return (
    <div className="space-y-4">
      {[
        {
          label: 'Monthly Investment (₹)',
          val: monthly,
          set: setMonthly,
          min: 100,
          max: 100000,
          step: 100,
        },
        {
          label: 'Expected Return (%)',
          val: rate,
          set: setRate,
          min: 1,
          max: 30,
          step: 0.5,
        },
        {
          label: 'Time Period (Years)',
          val: years,
          set: setYears,
          min: 1,
          max: 30,
          step: 1,
        },
      ].map((f) => (
        <div key={f.label}>
          <div className="flex justify-between mb-1">
            <label className="text-gray-400 text-sm">{f.label}</label>
            <span className="text-yellow-400 font-semibold text-sm">
              {f.val}
            </span>
          </div>
          <input
            type="range"
            min={f.min}
            max={f.max}
            step={f.step}
            value={f.val}
            onChange={(e) => f.set(Number(e.target.value))}
            className="w-full accent-yellow-500"
          />
        </div>
      ))}
      <div className="bg-gray-800 rounded-xl p-4 mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-gray-500 text-xs">Invested</p>
          <p className="text-white font-bold">
            ₹{(invested / 100000).toFixed(1)}L
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Returns</p>
          <p className="text-green-400 font-bold">
            ₹{((fv - invested) / 100000).toFixed(1)}L
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total</p>
          <p className="text-yellow-400 font-bold text-lg">
            ₹{(fv / 100000).toFixed(1)}L
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskCalc() {
  const [capital, setCapital] = useState(100000);
  const [riskPct, setRiskPct] = useState(2);
  const [entry, setEntry] = useState(100);
  const [sl, setSl] = useState(95);
  const riskAmt = (capital * riskPct) / 100;
  const slPct = Math.abs(((entry - sl) / entry) * 100);
  const qty = slPct > 0 ? Math.floor(riskAmt / ((entry * slPct) / 100)) : 0;
  return (
    <div className="space-y-4">
      {[
        {
          label: 'Trading Capital (₹)',
          val: capital,
          set: setCapital,
          min: 1000,
          max: 1000000,
          step: 1000,
        },
        {
          label: 'Risk per Trade (%)',
          val: riskPct,
          set: setRiskPct,
          min: 0.5,
          max: 10,
          step: 0.5,
        },
        {
          label: 'Entry Price (₹)',
          val: entry,
          set: setEntry,
          min: 1,
          max: 10000,
          step: 1,
        },
        {
          label: 'Stop Loss (₹)',
          val: sl,
          set: setSl,
          min: 1,
          max: 10000,
          step: 1,
        },
      ].map((f) => (
        <div key={f.label}>
          <div className="flex justify-between mb-1">
            <label className="text-gray-400 text-sm">{f.label}</label>
            <span className="text-yellow-400 font-semibold text-sm">
              {f.val}
            </span>
          </div>
          <input
            type="range"
            min={f.min}
            max={f.max}
            step={f.step}
            value={f.val}
            onChange={(e) => f.set(Number(e.target.value))}
            className="w-full accent-yellow-500"
          />
        </div>
      ))}
      <div className="bg-gray-800 rounded-xl p-4 mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-gray-500 text-xs">Risk Amount</p>
          <p className="text-red-400 font-bold">₹{riskAmt.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">SL %</p>
          <p className="text-white font-bold">{slPct.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Position Size</p>
          <p className="text-yellow-400 font-bold text-lg">{qty} shares</p>
        </div>
      </div>
    </div>
  );
}

function CompoundCalc() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(15);
  const [years, setYears] = useState(10);
  const fv = principal * (1 + rate / 100) ** years;
  return (
    <div className="space-y-4">
      {[
        {
          label: 'Principal Amount (₹)',
          val: principal,
          set: setPrincipal,
          min: 1000,
          max: 1000000,
          step: 1000,
        },
        {
          label: 'Annual Return (%)',
          val: rate,
          set: setRate,
          min: 1,
          max: 50,
          step: 1,
        },
        {
          label: 'Time Period (Years)',
          val: years,
          set: setYears,
          min: 1,
          max: 30,
          step: 1,
        },
      ].map((f) => (
        <div key={f.label}>
          <div className="flex justify-between mb-1">
            <label className="text-gray-400 text-sm">{f.label}</label>
            <span className="text-yellow-400 font-semibold text-sm">
              {f.val}
            </span>
          </div>
          <input
            type="range"
            min={f.min}
            max={f.max}
            step={f.step}
            value={f.val}
            onChange={(e) => f.set(Number(e.target.value))}
            className="w-full accent-yellow-500"
          />
        </div>
      ))}
      <div className="bg-gray-800 rounded-xl p-4 mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-gray-500 text-xs">Principal</p>
          <p className="text-white font-bold">
            ₹{(principal / 100000).toFixed(1)}L
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Growth</p>
          <p className="text-green-400 font-bold">
            ₹{((fv - principal) / 100000).toFixed(1)}L
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Final Value</p>
          <p className="text-yellow-400 font-bold text-lg">
            ₹{(fv / 100000).toFixed(1)}L
          </p>
        </div>
      </div>
    </div>
  );
}

const calcs = [
  {
    id: 'sip',
    label: 'SIP Calculator',
    emoji: '📈',
    desc: 'Calculate SIP returns',
    component: SIPCalc,
  },
  {
    id: 'risk',
    label: 'Position Sizing',
    emoji: '🛡️',
    desc: 'Calculate trade size by risk',
    component: RiskCalc,
  },
  {
    id: 'compound',
    label: 'Compound Interest',
    emoji: '💰',
    desc: 'Power of compounding',
    component: CompoundCalc,
  },
];

export default function Calculators() {
  const [active, setActive] = useState('sip');
  const ActiveCalc = calcs.find((c) => c.id === active)?.component || SIPCalc;

  return (
    <>
      <Helmet>
        <title>Financial Calculators — ELITE Trading Academy</title>
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
            🧮 Free Tools
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            FINANCIAL{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CALCULATORS
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Free tools to help you make smarter trading and investment
            decisions.
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: '#0A0A0F' }}>
        <div className="container-custom max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {calcs.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${active === c.id ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-8"
          >
            <h2 className="text-white font-bold text-xl mb-1">
              {calcs.find((c) => c.id === active)?.label}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {calcs.find((c) => c.id === active)?.desc}
            </p>
            <ActiveCalc />
          </motion.div>
          <p className="text-gray-600 text-xs text-center mt-6">
            ⚠️ These calculators are for educational purposes only. Not
            financial advice.
          </p>
        </div>
      </section>
    </>
  );
}
