// FloatingContact.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiMessageCircle, FiPhone, FiMail } from 'react-icons/fi';
import { SiTelegram } from 'react-icons/si';
import { useSettingsStore } from '../../context/store';

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const { getSetting } = useSettingsStore();

  const contacts = [
    {
      icon: FiMessageCircle,
      label: 'WhatsApp',
      color: 'bg-green-500',
      href: `https://wa.me/${getSetting('contact_whatsapp', '919876543210').replace(/\D/g, '')}?text=Hi! I'm interested in your trading courses.`,
    },
    {
      icon: SiTelegram,
      label: 'Telegram',
      color: 'bg-blue-500',
      href: getSetting('social_telegram', 'https://t.me/elitetradingacademy'),
    },
    {
      icon: FiPhone,
      label: 'Call Us',
      color: 'bg-gold',
      href: `tel:${getSetting('contact_phone', '+919876543210')}`,
    },
    {
      icon: FiMail,
      label: 'Email',
      color: 'bg-purple-500',
      href: `mailto:${getSetting('contact_email', 'info@elitetradingacademy.in')}`,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-2 ${c.color} text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium hover:opacity-90 transition-opacity`}
            >
              <c.icon size={16} />
              <span>{c.label}</span>
            </motion.a>
          ))}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-gold text-dark-900 animate-glow-pulse"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiPlus size={24} strokeWidth={2.5} />
        </motion.div>
      </motion.button>
    </div>
  );
}
export default FloatingContact;
