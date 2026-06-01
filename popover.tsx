import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Heart, Users, MessageCircle } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/checkin', icon: Heart, label: 'Check-In' },
  { path: '/partner', icon: Users, label: 'Us' },
  { path: '/chat', icon: MessageCircle, label: 'Talk' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-1 px-2 h-16 rounded-full backdrop-blur-xl shadow-float"
        style={{
          backgroundColor: 'rgba(245, 240, 232, 0.85)',
          border: '1px solid rgba(184, 168, 154, 0.2)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex items-center justify-center gap-1.5 px-4 h-12 rounded-full transition-all duration-300"
              style={{
                minWidth: isActive ? 90 : 48,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: 'rgba(196, 93, 43, 0.1)' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.5}
                className="relative z-10 transition-colors duration-200"
                style={{ color: isActive ? '#1A1A1A' : '#B8A89A' }}
              />
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative z-10 text-body-sm font-medium whitespace-nowrap overflow-hidden"
                  style={{ color: '#1A1A1A' }}
                >
                  {tab.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-burnt-orange"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
