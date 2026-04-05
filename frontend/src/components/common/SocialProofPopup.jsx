// SocialProofPopup.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../context/store';

export function SocialProofPopup() {
  const { popups } = useSettingsStore();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const timerRef = useRef(null);

  const socialProofs = popups.filter(p => p.type === 'social_proof' && p.isActive);

  useEffect(() => {
    if (!socialProofs.length) return;
    let index = 0;
    const show = () => {
      setCurrent(socialProofs[index % socialProofs.length]);
      setVisible(true);
      index++;
      setTimeout(() => setVisible(false), 5000);
    };
    const timer = setTimeout(() => {
      show();
      timerRef.current = setInterval(show, 30000);
    }, 8000);
    return () => { clearTimeout(timer); clearInterval(timerRef.current); };
  }, [socialProofs.length]);

  if (!visible || !current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100, y: 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="fixed bottom-24 left-4 z-40 glass-card p-4 max-w-xs shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold flex-shrink-0">
            {current.userName?.[0] || '👤'}
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              <span className="text-gold">{current.userName}</span> from {current.city}
            </p>
            <p className="text-muted text-xs">{current.message}</p>
            <p className="text-muted text-xs mt-0.5">Just now</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
export default SocialProofPopup;
