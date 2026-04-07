import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { couponAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';

const emptyForm = { code: '', description: '', type: 'percentage', value: 20, maxDiscount: '', minCartValue: 0, usageLimit: '', usagePerUser: 1, isActive: true, endDate: '' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => { setLoading(true); couponAPI.getAll().then(r => setCoupons(r.data.data || [])).catch(() => setCoupons([])).finally(() => setLoading(false)); };
  useEffect(() => { fetchCoupons(); }, []);

  const handleSave = async () => {
    if (!form.code || !form.value) { toast.error('Code and value are required'); return; }
    setSaving(true);
    try {
      if (editing) await couponAPI.update(editing._id, form);
      else await couponAPI.create({ ...form, code: form.code.toUpperCase() });
      toast.success(editing ? 'Coupon updated!' : 'Coupon created!');
      setShowForm(false); setEditing(null); setForm(emptyForm); fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try { await couponAPI.delete(id); toast.success('Deleted'); fetchCoupons(); }
    catch { toast.error('Failed'); }
  };

  const startEdit = (c) => { setEditing(c); setForm({ ...c, endDate: c.endDate ? c.endDate.split('T')[0] : '' }); setShowForm(true); };
  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <>
      <Helmet><title>Manage Coupons — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-2xl font-bold text-white">Coupons & Discounts</h1><p className="text-gray-500 text-sm mt-1">{coupons.length} coupons</p></div>
          <button onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
            className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm">
            <FiPlus size={16} /> Create Coupon
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-white font-bold text-lg mb-5">{editing ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Code *</label>
                    <input value={form.code} onChange={e => f('code', e.target.value.toUpperCase())} placeholder="SAVE20" className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none uppercase" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Type</label>
                    <select value={form.type} onChange={e => f('type', e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none">
                      <option value="percentage">Percentage %</option>
                      <option value="flat">Flat ₹</option>
                      <option value="free">100% Free</option>
                    </select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Value *</label>
                    <input type="number" value={form.value} onChange={e => f('value', Number(e.target.value))} placeholder={form.type === 'percentage' ? '20' : '500'}
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Max Discount (for %)</label>
                    <input type="number" value={form.maxDiscount} onChange={e => f('maxDiscount', e.target.value)} placeholder="e.g. 2000"
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Min Cart Value (₹)</label>
                    <input type="number" value={form.minCartValue} onChange={e => f('minCartValue', Number(e.target.value))} placeholder="0"
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Total Usage Limit</label>
                    <input type="number" value={form.usageLimit} onChange={e => f('usageLimit', e.target.value)} placeholder="Unlimited"
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400 block mb-1">Per User Limit</label>
                    <input type="number" value={form.usagePerUser} onChange={e => f('usagePerUser', Number(e.target.value))} placeholder="1"
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">Expiry Date</label>
                    <input type="date" value={form.endDate} onChange={e => f('endDate', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div><label className="text-xs text-gray-400 block mb-1">Description</label>
                  <input value={form.description} onChange={e => f('description', e.target.value)} placeholder="Diwali special offer"
                    className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => f('isActive', e.target.checked)} className="accent-yellow-500" />
                  <span className="text-sm text-gray-300">Active</span>
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-xl text-sm hover:text-white">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? 'Saving...' : 'Save Coupon'}</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(6)].map((_,i) => <div key={i} className="h-32 bg-gray-900 border border-gray-700 rounded-2xl animate-pulse" />)
          : coupons.length === 0 ? <div className="col-span-3 text-center py-16 bg-gray-900 border border-gray-700 rounded-2xl"><FiTag size={32} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-500">No coupons yet. Create your first coupon!</p></div>
          : coupons.map(coupon => (
            <div key={coupon._id} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${coupon.isActive ? 'border-yellow-500/20' : 'border-gray-700 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <code className="text-yellow-400 font-bold text-lg tracking-widest">{coupon.code}</code>
                  <p className="text-gray-500 text-xs mt-0.5">{coupon.description}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(coupon)} className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all"><FiEdit2 size={12} /></button>
                  <button onClick={() => deleteCoupon(coupon._id)} className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"><FiTrash2 size={12} /></button>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm mb-3">
                <span className="bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-full font-bold text-sm">
                  {coupon.type === 'percentage' ? `${coupon.value}% OFF` : coupon.type === 'flat' ? `₹${coupon.value} OFF` : '100% FREE'}
                </span>
                {coupon.minCartValue > 0 && <span className="text-gray-500 text-xs">Min ₹{coupon.minCartValue}</span>}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Used: {coupon.usedCount}/{coupon.usageLimit || '∞'}</span>
                <span className={`px-2 py-0.5 rounded-full ${coupon.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'}`}>{coupon.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              {coupon.endDate && <p className="text-xs text-gray-600 mt-2">Expires: {new Date(coupon.endDate).toLocaleDateString('en-IN')}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
