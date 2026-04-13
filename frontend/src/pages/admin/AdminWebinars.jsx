import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { webinarAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiClock,
  FiMail,
  FiPhone,
  FiX,
} from 'react-icons/fi';

const empty = {
  title: '',
  description: '',
  scheduledAt: '',
  platform: 'zoom',
  joinLink: '',
  price: 0,
  isFree: true,
  maxAttendees: 100,
  status: 'upcoming',
};
const statusColors = {
  upcoming: 'bg-blue-500/10 text-blue-400',
  live: 'bg-green-500/10 text-green-400',
  completed: 'bg-gray-700 text-gray-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

export default function AdminWebinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [registrants, setRegistrants] = useState(null); // { webinar, users }
  const [loadingReg, setLoadingReg] = useState(false);

  const fetch = () => {
    setLoading(true);
    webinarAPI
      .getAll()
      .then((r) => setWebinars(r.data.data || []))
      .catch(() => setWebinars([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetch();
  }, []);

  const save = async () => {
    if (!form.title || !form.scheduledAt) {
      toast.error('Title and date required');
      return;
    }
    setSaving(true);
    try {
      if (editing) await webinarAPI.update(editing._id, form);
      else await webinarAPI.create(form);
      toast.success(editing ? 'Updated!' : 'Created!');
      setShowForm(false);
      setEditing(null);
      setForm(empty);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this webinar?')) return;
    try {
      await webinarAPI.delete(id);
      toast.success('Deleted');
      fetch();
    } catch {
      toast.error('Failed');
    }
  };

  const startEdit = (w) => {
    setEditing(w);
    setForm({
      ...w,
      scheduledAt: w.scheduledAt
        ? new Date(w.scheduledAt).toISOString().slice(0, 16)
        : '',
    });
    setShowForm(true);
  };

  const viewRegistrants = async (webinar) => {
    setLoadingReg(true);
    setRegistrants({ webinar, users: [] });
    try {
      const res = await webinarAPI.getRegistrants(webinar._id);
      setRegistrants({ webinar, users: res.data.data || [] });
    } catch {
      toast.error('Failed to load registrants');
      setRegistrants(null);
    } finally {
      setLoadingReg(false);
    }
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <>
      <Helmet>
        <title>Manage Webinars — Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Webinars</h1>
            <p className="text-gray-500 text-sm mt-1">
              {webinars.length} webinars
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setForm(empty);
              setShowForm(true);
            }}
            className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm"
          >
            <FiPlus size={16} /> New Webinar
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg"
            >
              <h3 className="text-white font-bold text-lg mb-5">
                {editing ? 'Edit Webinar' : 'New Webinar'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Title *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => f('title', e.target.value)}
                    placeholder="Free Forex Strategy Session"
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => f('description', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={(e) => f('scheduledAt', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Platform
                    </label>
                    <select
                      value={form.platform}
                      onChange={(e) => f('platform', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
                    >
                      <option value="zoom">Zoom</option>
                      <option value="google_meet">Google Meet</option>
                      <option value="youtube">YouTube Live</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Join Link (Zoom/Meet URL)
                  </label>
                  <input
                    value={form.joinLink}
                    onChange={(e) => f('joinLink', e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      disabled={form.isFree}
                      onChange={(e) => f('price', Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Max Attendees
                    </label>
                    <input
                      type="number"
                      value={form.maxAttendees}
                      onChange={(e) =>
                        f('maxAttendees', Number(e.target.value))
                      }
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => f('status', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(e) => {
                      f('isFree', e.target.checked);
                      if (e.target.checked) f('price', 0);
                    }}
                    className="accent-yellow-500"
                  />
                  <span className="text-sm text-gray-300">Free Webinar</span>
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Registrants Modal */}
        {registrants && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
            onClick={() => setRegistrants(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white font-bold text-lg">Registrants</h3>
                  <p className="text-gray-500 text-sm">
                    {registrants.webinar.title} • {registrants.users.length}{' '}
                    registered
                  </p>
                </div>
                <button
                  onClick={() => setRegistrants(null)}
                  className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <FiX size={16} />
                </button>
              </div>

              {loadingReg ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : registrants.users.length === 0 ? (
                <div className="text-center py-10">
                  <FiUsers size={32} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No registrants yet</p>
                </div>
              ) : (
                <>
                  {/* Export info */}
                  <div className="bg-gray-800 rounded-xl p-3 mb-4 text-xs text-gray-400">
                    💡 To export: select all text below and copy to Excel
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          {['#', 'Name', 'Email', 'Phone', 'Joined'].map(
                            (h) => (
                              <th
                                key={h}
                                className="text-left px-3 py-2 text-xs font-semibold text-gray-400 uppercase"
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {registrants.users.map((u, i) => (
                          <tr
                            key={u._id}
                            className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="px-3 py-3 text-gray-500 text-xs">
                              {i + 1}
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold overflow-hidden">
                                  {u.avatar ? (
                                    <img
                                      src={u.avatar}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    u.name?.[0]
                                  )}
                                </div>
                                <span className="text-white font-medium">
                                  {u.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <a
                                href={`mailto:${u.email}`}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs"
                              >
                                <FiMail size={11} /> {u.email}
                              </a>
                            </td>
                            <td className="px-3 py-3">
                              {u.phone ? (
                                <a
                                  href={`tel:${u.phone}`}
                                  className="text-green-400 hover:text-green-300 flex items-center gap-1 text-xs"
                                >
                                  <FiPhone size={11} /> {u.phone}
                                </a>
                              ) : (
                                <span className="text-gray-600 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap">
                              {new Date(u.createdAt).toLocaleDateString(
                                'en-IN',
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Webinar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-52 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse"
              />
            ))
          ) : webinars.length === 0 ? (
            <div className="col-span-3 text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl">
              <p className="text-gray-500">No webinars yet</p>
            </div>
          ) : (
            webinars.map((w) => (
              <div
                key={w._id}
                className="bg-gray-900 border border-gray-700 hover:border-yellow-500/20 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[w.status] || 'bg-gray-700 text-gray-400'}`}
                  >
                    {w.status}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(w)}
                      className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20"
                    >
                      <FiEdit2 size={12} />
                    </button>
                    <button
                      onClick={() => del(w._id)}
                      className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-bold mb-1 line-clamp-2">
                  {w.title}
                </h3>
                <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                  <FiClock size={10} />{' '}
                  {w.scheduledAt
                    ? new Date(w.scheduledAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'TBD'}{' '}
                  IST
                </p>
                <div className="flex items-center justify-between text-xs mb-3">
                  <button
                    onClick={() => viewRegistrants(w)}
                    className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                  >
                    <FiUsers size={12} /> {w.registeredUsers?.length || 0}{' '}
                    registered
                    <span className="text-yellow-400 ml-1">→ View</span>
                  </button>
                  <span
                    className={
                      w.isFree
                        ? 'text-green-400 font-bold'
                        : 'text-yellow-400 font-bold'
                    }
                  >
                    {w.isFree ? 'FREE' : `₹${w.price}`}
                  </span>
                </div>
                {w.joinLink && (
                  <a
                    href={w.joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate block"
                  >
                    🔗 {w.joinLink}
                  </a>
                )}
                <p className="text-gray-600 text-xs mt-1 capitalize">
                  {w.platform?.replace('_', ' ')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
