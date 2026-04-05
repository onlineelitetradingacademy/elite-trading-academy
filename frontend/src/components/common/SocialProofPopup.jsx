import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../context/store';

export default function SocialProofPopup() {
  const { popups } = useSettingsStore();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const timerRef = useRef(null);
  const socialProofs = (popups || []).filter(p => p.type === 'social_proof' && p.isActive);

  useEffect(() => {
    if (!socialProofs.length) return;
    let index = 0;
    const show = () => {
      setCurrent(socialProofs[index % socialProofs.length]);
      setVisible(true);
      index++;
      setTimeout(() => setVisible(false), 5000);
    };
    const initial = setTimeout(() => {
      show();
      timerRef.current = setInterval(show, 30000);
    }, 8000);
    return () => { clearTimeout(initial); clearInterval(timerRef.current); };
  }, [socialProofs.length]);

  return (
    <AnimatePresence>
      {visible && current && (
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 z-40 glass-card p-4 max-w-[280px] shadow-card cursor-pointer"
          onClick={() => setVisible(false)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-lg flex-shrink-0">
              {current.userName?.[0]?.toUpperCase() || '★'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-tight">
                <span className="text-gold">{current.userName}</span>
                {current.city && <span className="text-muted"> from {current.city}</span>}
              </p>
              <p className="text-muted text-xs mt-0.5 leading-tight">{current.message}</p>
              <p className="text-muted text-[10px] mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-profit inline-block" />
                Just now
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
