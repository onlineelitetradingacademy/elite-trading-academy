import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supportAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiMessageCircle,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';

const statusColors = {
  open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-gray-700 text-gray-400',
};
const statusIcons = {
  open: FiAlertCircle,
  in_progress: FiClock,
  resolved: FiCheckCircle,
  closed: FiCheckCircle,
};

export default function MyTickets() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchTickets = () => {
    setLoading(true);
    supportAPI
      .getMy()
      .then((r) => setTickets(r.data.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async (data) => {
    setSubmitting(true);
    try {
      await supportAPI.create(data);
      toast.success('Ticket created! We will respond within 24 hours. 🎉');
      setShowForm(false);
      reset();
      fetchTickets();
    } catch {
      toast.error('Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await supportAPI.reply(selected._id, { message: reply });
      toast.success('Reply sent!');
      setReply('');
      fetchTickets();
      const updated = tickets.find((t) => t._id === selected._id);
      if (updated) setSelected(updated);
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Support Tickets — ELITE Trading Academy</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
            <p className="text-gray-500 text-sm mt-1">Get help from our team</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm"
          >
            <FiPlus size={16} /> New Ticket
          </button>
        </div>

        {/* New Ticket Modal */}
        {showForm && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg"
            >
              <h3 className="text-white font-bold text-lg mb-5">
                Create Support Ticket
              </h3>
              <form onSubmit={handleSubmit(createTicket)} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">
                    Subject *
                  </label>
                  <input
                    placeholder="Brief description of your issue"
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder-gray-500"
                    {...register('subject', { required: true })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">
                    Category
                  </label>
                  <select
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
                    {...register('category')}
                  >
                    <option value="general">General</option>
                    <option value="course">Course Related</option>
                    <option value="payment">Payment Issue</option>
                    <option value="technical">Technical Problem</option>
                    <option value="affiliate">Affiliate</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all placeholder-gray-500"
                    {...register('message', { required: true })}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60"
                  >
                    {submitting ? 'Creating...' : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse"
                />
              ))
            ) : tickets.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 border border-gray-700 rounded-2xl">
                <FiMessageCircle
                  size={32}
                  className="text-gray-600 mx-auto mb-3"
                />
                <p className="text-gray-500 text-sm">
                  No tickets yet. Create one if you need help!
                </p>
              </div>
            ) : (
              tickets.map((ticket) => {
                const StatusIcon = statusIcons[ticket.status] || FiAlertCircle;
                return (
                  <button
                    key={ticket._id}
                    onClick={() => setSelected(ticket)}
                    className={`w-full text-left bg-gray-900 border rounded-2xl p-4 transition-all hover:border-yellow-500/30 ${selected?._id === ticket._id ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-gray-700'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-white text-sm font-medium line-clamp-1">
                        {ticket.subject}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 capitalize ${statusColors[ticket.status] || 'bg-gray-700 text-gray-400'}`}
                      >
                        {ticket.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2">
                      {ticket.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 text-xs capitalize">
                        {ticket.category}
                      </span>
                      <span className="text-gray-600 text-xs">
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-white font-bold">{selected.subject}</h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${statusColors[selected.status] || 'bg-gray-700 text-gray-400'}`}
                    >
                      {selected.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Category: {selected.category} •{' '}
                    {new Date(selected.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                {/* Messages */}
                <div className="p-5 space-y-4 max-h-80 overflow-y-auto">
                  {/* Original message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold flex-shrink-0">
                      {user?.name?.[0]}
                    </div>
                    <div className="flex-1 bg-gray-800 rounded-xl p-3">
                      <p className="text-white text-xs font-medium mb-1">
                        {user?.name}{' '}
                        <span className="text-gray-500 font-normal">
                          • Original message
                        </span>
                      </p>
                      <p className="text-gray-300 text-sm">
                        {selected.message}
                      </p>
                    </div>
                  </div>

                  {/* Replies */}
                  {selected.replies?.map((r, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 ${r.isAdmin ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${r.isAdmin ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
                      >
                        {r.isAdmin ? 'E' : user?.name?.[0]}
                      </div>
                      <div
                        className={`flex-1 rounded-xl p-3 ${r.isAdmin ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-gray-800'}`}
                      >
                        <p className="text-xs font-medium mb-1">
                          {r.isAdmin ? (
                            <span className="text-yellow-400">
                              ELITE Support
                            </span>
                          ) : (
                            <span className="text-white">{user?.name}</span>
                          )}
                          <span className="text-gray-500 font-normal ml-1">
                            •{' '}
                            {new Date(r.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </p>
                        <p className="text-gray-300 text-sm">{r.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                {selected.status !== 'closed' && (
                  <div className="px-5 pb-5 border-t border-gray-700 pt-4">
                    <textarea
                      rows={3}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all placeholder-gray-500 mb-2"
                    />
                    <button
                      onClick={sendReply}
                      disabled={sending || !reply.trim()}
                      className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-60"
                    >
                      {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl flex items-center justify-center h-64">
                <div className="text-center">
                  <FiMessageCircle
                    size={32}
                    className="text-gray-600 mx-auto mb-3"
                  />
                  <p className="text-gray-500 text-sm">
                    Select a ticket to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
