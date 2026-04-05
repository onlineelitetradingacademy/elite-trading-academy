import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../utils/api';
import { useSettingsStore } from '../../context/store';
import { FiSave, FiGlobe, FiPhone, FiInstagram, FiBarChart2, FiFileText, FiSettings, FiUsers, FiDollarSign } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const groups = [
  { key: 'brand',       label: 'Brand & Identity',    icon: FiSettings },
  { key: 'contact',     label: 'Contact Details',      icon: FiPhone },
  { key: 'social',      label: 'Social Media Links',   icon: FiInstagram },
  { key: 'stats',       label: 'Homepage Stats',       icon: FiBarChart2 },
  { key: 'about',       label: 'About & Founder',      icon: FiUsers },
  { key: 'seo',         label: 'SEO & Analytics',      icon: FiGlobe },
  { key: 'integrations',label: 'Integrations',         icon: FiSettings },
  { key: 'affiliate',   label: 'Affiliate Settings',   icon: FiDollarSign },
  { key: 'footer',      label: 'Footer',               icon: FiFileText },
  { key: 'policies',    label: 'Policy Pages',         icon: FiFileText },
];

export default function AdminSettings() {
  const [activeGroup, setActiveGroup] = useState('brand');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { fetchSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsAPI.getAll();
      setSettings(res.data.data);
    } catch { toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveGroup = async () => {
    setSaving(true);
    try {
      const groupSettings = getGroupSettings(activeGroup);
      const payload = groupSettings.map(s => ({ key: s.key, value: settings[s.key] ?? s.default, group: activeGroup, type: s.type, label: s.label }));
      await settingsAPI.bulkUpdate({ settings: payload });
      await fetchSettings();
      toast.success('Settings saved successfully! ✅');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const getGroupSettings = (group) => {
    const allSettings = {
      brand: [
        { key: 'site_name',    label: 'Site Name',    type: 'text',  default: 'ELITE Trading Academy' },
        { key: 'site_tagline', label: 'Tagline',      type: 'text',  default: 'Where Traders Become Elite' },
        { key: 'site_logo',    label: 'Logo URL',     type: 'url',   default: '' },
        { key: 'site_favicon', label: 'Favicon URL',  type: 'url',   default: '' },
        { key: 'primary_color',label: 'Primary Color (Gold)', type: 'color', default: '#F0A500' },
      ],
      contact: [
        { key: 'contact_phone',    label: 'Phone Number',    type: 'text', default: '+91 98765 43210' },
        { key: 'contact_whatsapp', label: 'WhatsApp Number', type: 'text', default: '+91 98765 43210' },
        { key: 'contact_email',    label: 'Email Address',   type: 'text', default: 'info@elitetradingacademy.in' },
        { key: 'contact_address',  label: 'Full Address',    type: 'textarea', default: 'Ludhiana, Punjab 141001, India' },
        { key: 'google_maps_link', label: 'Google Maps Link (click opens maps)', type: 'url', default: '' },
        { key: 'business_hours',   label: 'Business Hours',  type: 'text', default: 'Mon–Sat: 10:00 AM – 7:00 PM IST' },
      ],
      social: [
        { key: 'social_instagram',           label: 'Instagram URL',        type: 'url', default: '' },
        { key: 'social_youtube',             label: 'YouTube URL',          type: 'url', default: '' },
        { key: 'social_telegram',            label: 'Telegram Group Link',  type: 'url', default: '' },
        { key: 'social_whatsapp_community',  label: 'WhatsApp Community Link', type: 'url', default: '' },
        { key: 'social_instagram_followers', label: 'Instagram Followers (display text)', type: 'text', default: '12K+' },
      ],
      stats: [
        { key: 'stat_students',     label: 'Students Trained (e.g. 5,000+)', type: 'text', default: '5,000+' },
        { key: 'stat_experience',   label: 'Years Experience (e.g. 8+)',      type: 'text', default: '8+' },
        { key: 'stat_courses',      label: 'Courses Available (e.g. 20+)',    type: 'text', default: '20+' },
        { key: 'stat_satisfaction', label: 'Satisfaction Rate (e.g. 95%)',    type: 'text', default: '95%' },
        { key: 'stat_webinars',     label: 'Webinars Conducted (e.g. 500+)', type: 'text', default: '500+' },
        { key: 'stat_instagram',    label: 'Instagram Followers stat',        type: 'text', default: '12K+' },
      ],
      about: [
        { key: 'founder_name',  label: 'Founder Name',   type: 'text',     default: 'Your Name' },
        { key: 'founder_title', label: 'Founder Title',  type: 'text',     default: 'Founder & Head Mentor' },
        { key: 'founder_photo', label: 'Founder Photo URL', type: 'url',   default: '' },
        { key: 'founder_bio',   label: 'Founder Bio',    type: 'textarea', default: '' },
        { key: 'about_mission', label: 'Mission Statement', type: 'textarea', default: '' },
        { key: 'about_vision',  label: 'Vision Statement',  type: 'textarea', default: '' },
      ],
      seo: [
        { key: 'meta_title',          label: 'Default Page Title',        type: 'text',     default: 'ELITE Trading Academy' },
        { key: 'meta_description',    label: 'Default Meta Description',  type: 'textarea', default: '' },
        { key: 'meta_keywords',       label: 'Meta Keywords (comma separated)', type: 'text', default: '' },
        { key: 'google_analytics_id', label: 'Google Analytics ID (G-XXXXXX)', type: 'text', default: '' },
        { key: 'meta_pixel_id',       label: 'Meta (Facebook) Pixel ID',  type: 'text',     default: '' },
      ],
      integrations: [
        { key: 'tawkto_id',         label: 'Tawk.to Property ID (live chat)', type: 'text', default: '' },
        { key: 'default_zoom_link', label: 'Default Zoom Meeting Link',       type: 'url',  default: '' },
      ],
      affiliate: [
        { key: 'affiliate_global_commission', label: 'Global Commission % (e.g. 20)', type: 'text', default: '20' },
        { key: 'affiliate_min_purchase',      label: 'Min Purchase to Become Affiliate (₹)', type: 'text', default: '1000' },
        { key: 'affiliate_min_payout',        label: 'Minimum Payout Amount (₹)',     type: 'text', default: '500' },
        { key: 'affiliate_cookie_days',       label: 'Cookie Tracking Duration (days)', type: 'text', default: '30' },
      ],
      footer: [
        { key: 'footer_copyright', label: 'Copyright Text', type: 'text',     default: '© 2026 ELITE Trading Academy. All rights reserved.' },
        { key: 'footer_tagline',   label: 'Footer Tagline', type: 'text',     default: 'Where Traders Become Elite' },
      ],
      policies: [
        { key: 'policy_refund',  label: 'Refund Policy',  type: 'richtext', default: '' },
        { key: 'policy_privacy', label: 'Privacy Policy', type: 'richtext', default: '' },
        { key: 'policy_terms',   label: 'Terms of Service', type: 'richtext', default: '' },
      ],
    };
    return allSettings[group] || [];
  };

  const groupSettings = getGroupSettings(activeGroup);

  return (
    <>
      <Helmet><title>Site Settings — ELITE Trading Academy Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Site Settings</h1>
            <p className="text-muted text-sm mt-1">Control every element of your website — just type and save.</p>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={saveGroup} disabled={saving}
            className="btn-gold px-6 py-2.5 flex items-center gap-2 disabled:opacity-60">
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="glass-card p-2 space-y-1">
              {groups.map(g => (
                <button key={g.key} onClick={() => setActiveGroup(g.key)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${activeGroup === g.key ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted hover:text-white hover:bg-dark-600'}`}>
                  <g.icon size={15} /> {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 glass-card p-6">
            <h2 className="text-white font-semibold text-lg mb-6 pb-4 border-b border-dark-500">
              {groups.find(g => g.key === activeGroup)?.label}
            </h2>
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-14 shimmer rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-5">
                {groupSettings.map(setting => (
                  <div key={setting.key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {setting.label}
                      <span className="text-muted text-xs font-normal ml-2">(key: {setting.key})</span>
                    </label>
                    {setting.type === 'textarea' || setting.type === 'richtext' ? (
                      <textarea
                        value={settings[setting.key] ?? setting.default}
                        onChange={e => handleChange(setting.key, e.target.value)}
                        rows={setting.type === 'richtext' ? 8 : 3}
                        className="input-field resize-none"
                        placeholder={`Enter ${setting.label.toLowerCase()}...`}
                      />
                    ) : setting.type === 'color' ? (
                      <div className="flex items-center gap-3">
                        <input type="color" value={settings[setting.key] ?? setting.default}
                          onChange={e => handleChange(setting.key, e.target.value)}
                          className="h-11 w-20 rounded-lg border border-dark-400 bg-dark-700 cursor-pointer p-1" />
                        <input type="text" value={settings[setting.key] ?? setting.default}
                          onChange={e => handleChange(setting.key, e.target.value)}
                          className="input-field flex-1" placeholder="#F0A500" />
                      </div>
                    ) : (
                      <input
                        type={setting.type === 'url' ? 'url' : 'text'}
                        value={settings[setting.key] ?? setting.default}
                        onChange={e => handleChange(setting.key, e.target.value)}
                        className="input-field"
                        placeholder={`Enter ${setting.label.toLowerCase()}...`}
                      />
                    )}
                    {(setting.type === 'url' || setting.key.includes('link')) && settings[setting.key] && (
                      <a href={settings[setting.key]} target="_blank" rel="noopener noreferrer" className="text-gold text-xs mt-1 hover:underline inline-block">
                        Preview link →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 pt-4 border-t border-dark-500 flex justify-end">
              <motion.button whileTap={{ scale: 0.97 }} onClick={saveGroup} disabled={saving}
                className="btn-gold px-8 py-3 flex items-center gap-2 disabled:opacity-60">
                <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
