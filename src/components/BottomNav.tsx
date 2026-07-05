import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, LayoutGrid } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/ai-hub', icon: Sparkles, label: 'Aevum' },
  { path: '/hub', icon: LayoutGrid, label: 'Hub' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/ai-hub') return currentPath.startsWith('/ai');
    if (path === '/hub') return currentPath === '/hub' || currentPath.startsWith('/hub/');
    return currentPath === path;
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-1 px-2 h-16 rounded-full backdrop-blur-xl shadow-float"
        style={{
          backgroundColor: 'rgba(248, 250, 252, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex items-center justify-center gap-1.5 px-5 h-12 rounded-full transition-all duration-300"
              style={{ minWidth: active ? 90 : 48 }}
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.5}
                className="relative z-10 transition-colors duration-200"
                style={{ color: active ? '#0F172A' : '#64748B' }}
              />
              {active && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative z-10 text-body-sm font-medium whitespace-nowrap overflow-hidden"
                  style={{ color: '#0F172A' }}
                >
                  {tab.label}
                </motion.span>
              )}
              {active && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary"
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
