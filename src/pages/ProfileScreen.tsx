import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, User, Lock, Bell, Users, Download, Trash2,
  Moon, Globe, HelpCircle, Info, ChevronRight, LogOut, Brain, Settings,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingItem {
  icon: React.ReactNode;
  label: string;
  action?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  danger?: boolean;
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: <User size={20} />, label: 'Edit Profile' },
        { icon: <Lock size={20} />, label: 'Change Password' },
        { icon: <Bell size={20} />, label: 'Notification Preferences' },
      ],
    },
    {
      title: 'Partner',
      items: [
        { icon: <Users size={20} />, label: 'Manage Connection', action: () => navigate('/partner') },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { icon: <Download size={20} />, label: 'Data Export' },
        { icon: <Trash2 size={20} />, label: 'Delete Account', action: () => setShowDeleteConfirm(true), danger: true },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: <Settings size={20} />, label: 'Settings', action: () => navigate('/settings') },
        { icon: <Moon size={20} />, label: 'Dark Mode', toggle: true, toggleValue: theme === 'dark' },
        { icon: <Globe size={20} />, label: 'Language' },
        { icon: <Info size={20} />, label: 'About' },
        { icon: <HelpCircle size={20} />, label: 'Help & Support' },
      ],
    },
  ];

  const handleToggle = (label: string) => {
    if (label === 'Dark Mode') toggleTheme();
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Profile</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8">
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => navigate('/profile-psych')}
          className="w-full bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card flex items-center gap-4 mb-6 text-left hover:shadow-card-hover transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Brain size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-display-sm text-charcoal dark:text-cream-soft">My Psychology</h3>
            <p className="text-body-sm text-clay mt-0.5">Attachment, patterns &amp; self-awareness</p>
          </div>
          <ChevronRight size={20} className="text-clay" />
        </motion.button>

        <div className="flex flex-col items-center py-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl text-white font-medium mb-4"
            style={{ background: 'linear-gradient(135deg, var(--app-primary, #6366F1) 0%, #A855F7 100%)', border: '3px solid var(--app-primary, #6366F1)' }}>Y</div>
          <h2 className="text-body-lg font-medium text-charcoal dark:text-cream-soft">You</h2>
          <p className="text-body-sm text-clay mt-1">demo@aevum.app</p>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-label text-clay mb-3 px-1">{section.title}</h3>
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <button key={item.label}
                  onClick={() => { if (item.toggle) handleToggle(item.label); else if (item.action) item.action(); }}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left ${i < section.items.length - 1 ? 'border-b border-clay/10' : ''} ${item.danger ? 'hover:bg-red-50 dark:hover:bg-red-900/10' : 'hover:bg-parchment/50 dark:hover:bg-white/5'}`}>
                  <span className={item.danger ? 'text-red-500' : 'text-clay'}>{item.icon}</span>
                  <span className={`flex-1 text-body ${item.danger ? 'text-red-500' : 'text-charcoal dark:text-cream-soft'}`}>{item.label}</span>
                  {item.toggle ? (
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${item.toggleValue ? 'bg-primary' : 'bg-clay/30'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.toggleValue ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  ) : <ChevronRight size={16} className="text-clay" />}
                </button>
              ))}
            </div>
          </div>
        ))}

        <motion.button whileTap={{ scale: 0.98 }} onClick={logout} className="w-full flex items-center justify-center gap-2 py-4 text-body text-clay hover:text-primary transition-colors">
          <LogOut size={18} /> Sign Out
        </motion.button>
        <p className="text-caption text-clay text-center mt-4">Aevum v1.0.0</p>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[320px] bg-parchment dark:bg-espresso-deep rounded-2xl p-8">
              <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-2 text-center">Delete Account?</h3>
              <p className="text-body-sm text-clay text-center mb-6">This will permanently delete all your data. This action cannot be undone.</p>
              <div className="space-y-3">
                <button onClick={() => { setShowDeleteConfirm(false); logout(); }} className="w-full h-[48px] rounded-full bg-red-500 text-white font-medium text-body">Delete Account</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="w-full h-[48px] rounded-full border border-clay/50 text-warm-stone dark:text-cream-soft/70 font-medium text-body-sm">Cancel</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
