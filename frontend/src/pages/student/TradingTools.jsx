import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiBookOpen,
  FiCalendar,
  FiActivity,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';

const tabs = [
  { id: 'charts', label: 'Live Charts', icon: FiTrendingUp },
  { id: 'journal', label: 'Trading Journal', icon: FiBookOpen },
  { id: 'news', label: 'Market News', icon: FiActivity },
  { id: 'calendar', label: 'Economic Calendar', icon: FiCalendar },
];

// TradingView Widget
function TradingViewChart() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden h-[500px]">
      <iframe
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview&symbol=NIFTY&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Asia%2FKolkata&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart&utm_term=NIFTY"
        style={{ width: '100%', height: '100%' }}
        frameBorder="0"
        allowTransparency
        allowFullScreen
        title="TradingView Chart"
      />
    </div>
  );
}

// Market News Widget
function MarketNews() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden h-[500px]">
      <iframe
        src="https://s.tradingview.com/embed-widget/timeline/?locale=en#%7B%22feedMode%22%3A%22all_symbols%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22regular%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22colorTheme%22%3A%22dark%22%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22timeline%22%7D"
        style={{ width: '100%', height: '100%' }}
        frameBorder="0"
        title="Market News"
      />
    </div>
  );
}

// Economic Calendar Widget
function EconomicCalendar() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden h-[500px]">
      <iframe
        src="https://s.tradingview.com/embed-widget/events/?locale=en#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22importanceFilter%22%3A%22-1%2C0%2C1%22%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22events%22%7D"
        style={{ width: '100%', height: '100%' }}
        frameBorder="0"
        title="Economic Calendar"
      />
    </div>
  );
}

// Trading Journal
function TradingJournal() {
  const [trades, setTrades] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('eta_journal') || '[]');
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: '',
    type: 'buy',
    entry: '',
    exit: '',
    lots: '',
    pnl: '',
    notes: '',
  });
  const [showForm, setShowForm] = useState(false);

  const saveTrade = () => {
    if (!form.pair || !form.entry) {
      return;
    }
    const newTrades = [{ ...form, id: Date.now() }, ...trades];
    setTrades(newTrades);
    localStorage.setItem('eta_journal', JSON.stringify(newTrades));
    setShowForm(false);
    setForm({
      date: new Date().toISOString().split('T')[0],
      pair: '',
      type: 'buy',
      entry: '',
      exit: '',
      lots: '',
      pnl: '',
      notes: '',
    });
  };

  const deleteTrade = (id) => {
    const updated = trades.filter((t) => t.id !== id);
    setTrades(updated);
    localStorage.setItem('eta_journal', JSON.stringify(updated));
  };

  const totalPnl = trades.reduce((a, t) => a + (parseFloat(t.pnl) || 0), 0);
  const wins = trades.filter((t) => parseFloat(t.pnl) > 0).length;
  const winRate = trades.length ? Math.round((wins / trades.length) * 100) : 0;

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Trades', value: trades.length, color: 'text-white' },
          {
            label: 'Win Rate',
            value: `${winRate}%`,
            color: winRate >= 50 ? 'text-green-400' : 'text-red-400',
          },
          {
            label: 'Total P&L',
            value: `${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}`,
            color: totalPnl >= 0 ? 'text-green-400' : 'text-red-400',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center"
          >
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add Trade Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm"
      >
        <FiPlus size={16} /> Log New Trade
      </button>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4 text-sm">New Trade Entry</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Date', key: 'date', type: 'date' },
              {
                label: 'Pair/Symbol',
                key: 'pair',
                type: 'text',
                placeholder: 'EUR/USD',
              },
              {
                label: 'Entry Price',
                key: 'entry',
                type: 'number',
                placeholder: '1.0850',
              },
              {
                label: 'Exit Price',
                key: 'exit',
                type: 'number',
                placeholder: '1.0900',
              },
              {
                label: 'Lot Size',
                key: 'lots',
                type: 'number',
                placeholder: '0.1',
              },
              {
                label: 'P&L ($)',
                key: 'pnl',
                type: 'number',
                placeholder: '+50',
              },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs text-gray-400 block mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => f(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-3 py-2 text-sm outline-none transition-all placeholder-gray-600"
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs text-gray-400 block mb-1">Type</label>
            <div className="flex gap-2">
              {['buy', 'sell'].map((t) => (
                <button
                  key={t}
                  onClick={() => f('type', t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${form.type === t ? (t === 'buy' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-gray-700 text-gray-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-gray-400 block mb-1">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => f('notes', e.target.value)}
              placeholder="Trade notes, reason for entry..."
              className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-3 py-2 text-sm outline-none resize-none transition-all placeholder-gray-600"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={saveTrade}
              className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm hover:bg-yellow-400"
            >
              Save Trade
            </button>
          </div>
        </div>
      )}

      {/* Trades List */}
      {trades.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-700 rounded-2xl">
          <FiBookOpen size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No trades logged yet. Start tracking your trades!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center gap-4"
            >
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${trade.type === 'buy' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
              >
                {trade.type}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">
                    {trade.pair}
                  </span>
                  <span className="text-gray-500 text-xs">{trade.date}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  {trade.entry && <span>Entry: {trade.entry}</span>}
                  {trade.exit && <span>Exit: {trade.exit}</span>}
                  {trade.lots && <span>Lots: {trade.lots}</span>}
                </div>
                {trade.notes && (
                  <p className="text-gray-600 text-xs mt-0.5 truncate">
                    {trade.notes}
                  </p>
                )}
              </div>
              <div className="text-right">
                {trade.pnl && (
                  <span
                    className={`text-sm font-bold ${parseFloat(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {parseFloat(trade.pnl) >= 0 ? '+' : ''}
                    {trade.pnl}
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteTrade(trade.id)}
                className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all flex-shrink-0"
              >
                <FiTrash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TradingTools() {
  const [activeTab, setActiveTab] = useState('charts');

  return (
    <>
      <Helmet>
        <title>Trading Tools — ELITE Trading Academy</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Tools</h1>
          <p className="text-gray-500 text-sm mt-1">
            Professional tools to enhance your trading
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'charts' && <TradingViewChart />}
          {activeTab === 'journal' && <TradingJournal />}
          {activeTab === 'news' && <MarketNews />}
          {activeTab === 'calendar' && <EconomicCalendar />}
        </motion.div>
      </div>
    </>
  );
}
