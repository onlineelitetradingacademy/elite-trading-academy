import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supportAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiMessageCircle, FiSearch, FiSend } from 'react-icons/fi';

const statusColors = { open:'bg-blue-500/10 text-blue-400 border-blue-500/20', in_progress:'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', resolved:'bg-green-500/10 text-green-400 border-green-500/20', closed:'bg-gray-700 text-gray-400' };

export default function AdminSupport() {
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply]       = useState('');
  const [sending, setSending]   = useState(false);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');

  const fetch = () => {
    setLoading(true);
    supportAPI.getAll({ status: filter === 'all' ? undefined : filter })
      .then(r => setTickets(r.data.data || [])).catch(() => setTickets([])).finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [filter]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await supportAPI.adminReply(selected._id, { message: reply, isAdmin: true });
      toast.success('Reply sent!');
      setReply('');
      fetch();
    } catch { toast.error('Failed'); }
    finally { setSending(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await supportAPI.update(id, { status });
      toast.success('Status updated');
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
      fetch();
    } catch { toast.error('Failed'); }
  };

  const filtered = tickets.filter(t =>
    t.subject?.toLowerCase().includes(search.toLowerCase()) ||
    t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = tickets.filter(t => t.status === 'open').length;

  return (
    <>
      <Helmet><title>Support Tickets — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
            <p className="text-gray-500 text-sm mt-1">{openCount} open tickets needing attention</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input type="text" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none placeholder-gray-500 w-60" />
          </div>
          {['all','open','in_progress','resolved','closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>
              {s.replace('_',' ')}
              {s === 'open' && openCount > 0 && <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{openCount}</span>}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {loading ? [...Array(4)].map((_,i) => <div key={i} className="h-24 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)
            : filtered.length === 0 ? <div className="text-center py-12 bg-gray-900 border border-gray-700 rounded-2xl"><FiMessageCircle size={28} className="text-gray-600 mx-auto mb-2" /><p className="text-gray-500 text-sm">No tickets found</p></div>
            : filtered.map(ticket => (
              <button key={ticket._id} onClick={() => setSelected(ticket)}
                className={`w-full text-left bg-gray-900 border rounded-2xl p-4 transition-all hover:border-yellow-500/30 ${selected?._id === ticket._id ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-gray-700'}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-white text-sm font-medium line-clamp-1">{ticket.subject}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 capitalize ${statusColors[ticket.status] || 'bg-gray-700 text-gray-400'}`}>{ticket.status?.replace('_',' ')}</span>
                </div>
                <p className="text-gray-500 text-xs">From: {ticket.user?.name} • {ticket.category}</p>
                <p className="text-gray-600 text-xs mt-0.5">{new Date(ticket.createdAt).toLocaleDateString('en-IN')}</p>
              </button>
            ))}
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-700">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white font-bold">{selected.subject}</h3>
                    <select value={selected.status} onChange={e => updateStatus(selected._id, e.target.value)}
                      className="bg-gray-800 border border-gray-600 text-white rounded-xl px-3 py-1.5 text-xs outline-none">
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <p className="text-gray-500 text-xs">From: <span className="text-white">{selected.user?.name}</span> ({selected.user?.email}) • {selected.category}</p>
                </div>

                <div className="p-5 space-y-4 max-h-80 overflow-y-auto">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">{selected.user?.name?.[0]}</div>
                    <div className="flex-1 bg-gray-800 rounded-xl p-3">
                      <p className="text-white text-xs font-medium mb-1">{selected.user?.name}</p>
                      <p className="text-gray-300 text-sm">{selected.message}</p>
                    </div>
                  </div>
                  {selected.replies?.map((r, i) => (
                    <div key={i} className={`flex gap-3 ${r.isAdmin ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${r.isAdmin ? 'bg-yellow-500 text-gray-900' : 'bg-blue-500/20 text-blue-400'}`}>{r.isAdmin ? 'E' : selected.user?.name?.[0]}</div>
                      <div className={`flex-1 rounded-xl p-3 ${r.isAdmin ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-gray-800'}`}>
                        <p className="text-xs font-medium mb-1">{r.isAdmin ? <span className="text-yellow-400">ELITE Support</span> : <span className="text-white">{selected.user?.name}</span>}</p>
                        <p className="text-gray-300 text-sm">{r.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selected.status !== 'closed' && (
                  <div className="px-5 pb-5 border-t border-gray-700 pt-4">
                    <textarea rows={3} value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply as admin..."
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all placeholder-gray-500 mb-2" />
                    <div className="flex gap-2">
                      <button onClick={sendReply} disabled={sending || !reply.trim()}
                        className="flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-60">
                        {sending ? 'Sending...' : <><FiSend size={13} /> Send Reply</>}
                      </button>
                      <button onClick={() => updateStatus(selected._id, 'resolved')}
                        className="px-4 py-2.5 rounded-xl text-sm bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all">
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl flex items-center justify-center h-64">
                <div className="text-center"><FiMessageCircle size={32} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-500 text-sm">Select a ticket to view and reply</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
