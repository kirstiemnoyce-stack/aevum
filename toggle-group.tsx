import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', visible, onClose, duration = 3000 }: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!visible) return;
    setProgress(100);
    const timer = setTimeout(onClose, duration);
    const interval = setInterval(() => {
      setProgress(p => Math.max(0, p - 100 / (duration / 50)));
    }, 50);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [visible, onClose, duration]);

  const icon = type === 'success' ? <Check size={16} /> : type === 'error' ? <AlertTriangle size={16} /> : <Check size={16} />;
  const iconColor = type === 'success' ? '#A8B5A0' : type === 'error' ? '#C9A9A6' : '#C45D2B';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-4 right-4 z-[60] flex justify-center"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg max-w-sm w-full"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <span style={{ color: iconColor }}>{icon}</span>
            <p className="flex-1 text-body-sm text-white">{message}</p>
            <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
              <X size={16} className="text-white" />
            </button>
            <div
              className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: iconColor,
                opacity: 0.5,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
