import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { userAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiEdit2, FiShield, FiUser, FiSlash, FiCheck } from 'react-icons/fi';

const roleColors = { admin:'bg-red-500/10 text-red-400 border-red-500/20', sub_admin:'bg-orange-500/10 text-orange-400 border-orange-500/20', mentor:'bg-purple-500/10 text-purple-400 border-purple-500/20', student:'bg-blue-500/10 text-blue-400 border-blue-500/20' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter !== 'all') params.role = roleFilter;
      const res = await userAPI.getAll(params);
      setUsers(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter, page]);

  const updateUser = async (id, data) => {
    setSaving(true);
    try {
      await userAPI.update(id, data);
      toast.success('User updated');
      setSelected(null);
      fetchUsers();
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Helmet><title>Manage Users — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Users</h1>
            <p className="text-gray-500 text-sm mt-1">{total} total users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input type="text" placeholder="Search name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all placeholder-gray-500 w-64" />
          </div>
          {['all','student','mentor','sub_admin','admin'].map(r => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${roleFilter === r ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>
              {r === 'all' ? 'All Users' : r.replace('_',' ')}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800">
                  {['User', 'Role', 'Enrolled', 'Spent', 'Verified', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_,i) => (
                    <tr key={i} className="border-b border-gray-800">
                      {[...Array(8)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>)}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">No users found</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold overflow-hidden flex-shrink-0">
                            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name?.[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{user.name}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${roleColors[user.role] || 'bg-gray-700 text-gray-400'}`}>{user.role?.replace('_',' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{user.enrolledCourses?.length || 0}</td>
                      <td className="px-4 py-3 text-yellow-400 text-sm font-medium">₹{user.totalSpent?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${user.isEmailVerified ? 'bg-green-400' : 'bg-gray-600'}`} title={user.isEmailVerified ? 'Email verified' : 'Email not verified'} />
                          <span className={`w-2 h-2 rounded-full ${user.isPhoneVerified ? 'bg-green-400' : 'bg-gray-600'}`} title={user.isPhoneVerified ? 'Phone verified' : 'Phone not verified'} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${user.isBlocked ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelected(user)} title="Edit user"
                            className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-all">
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => updateUser(user._id, { isBlocked: !user.isBlocked })} title={user.isBlocked ? 'Unblock' : 'Block'}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${user.isBlocked ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'}`}>
                            {user.isBlocked ? <FiCheck size={13} /> : <FiSlash size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-700">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-400 text-sm disabled:opacity-40 hover:text-white">Prev</button>
              <span className="px-4 py-2 text-gray-400 text-sm">Page {page} of {Math.ceil(total/20)}</span>
              <button onClick={() => setPage(p => p+1)} disabled={page>=Math.ceil(total/20)} className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-gray-400 text-sm disabled:opacity-40 hover:text-white">Next</button>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-white font-bold text-lg mb-5">Edit User: {selected.name}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Role</label>
                  <select defaultValue={selected.role} id="edit-role"
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="sub_admin">Sub Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {/* Sub-admin permissions */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Sub-Admin Permissions (if applicable)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['courses','users','blogs','webinars','payments','coupons','affiliates','franchise','gallery','settings','notifications','support','careers'].map(perm => (
                      <label key={perm} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                        <input type="checkbox" defaultChecked={selected.permissions?.[perm]} id={`perm-${perm}`} className="accent-yellow-500" />
                        <span className="capitalize">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setSelected(null)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white transition-colors">Cancel</button>
                <button disabled={saving} onClick={() => {
                  const role = document.getElementById('edit-role').value;
                  const permissions = {};
                  ['courses','users','blogs','webinars','payments','coupons','affiliates','franchise','gallery','settings','notifications','support','careers'].forEach(p => {
                    permissions[p] = document.getElementById(`perm-${p}`)?.checked || false;
                  });
                  updateUser(selected._id, { role, permissions });
                }} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
