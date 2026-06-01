import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Sparkles, Brain, TrendingUp, Heart, Sun, Moon,
  CloudRain, Zap, CheckCircle2, ChevronRight,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useSettings } from '@/contexts/SettingsContext';

const moodOptions = [
  { label: 'Happy', icon: <Sun size={20} />, color: '#F59E0B' },
  { label: 'Calm', icon: <CloudRain size={20} />, color: '#3B82F6' },
  { label: 'Grateful', icon: <Heart size={20} />, color: '#EC4899' },
  { label: 'Anxious', icon: <Zap size={20} />, color: '#F97316' },
  { label: 'Tired', icon: <Moon size={20} />, color: '#8B5CF6' },
  { label: 'Frustrated', icon: <CloudRain size={20} />, color: '#EF4444' },
];

const quickInsights = [
  { label: 'My Psychology', icon: <Brain size={20} />, desc: 'Attachment, patterns, self-awareness', route: '/profile-psych', color: '#6366F1' },
  { label: 'Assessments', icon: <CheckCircle2 size={20} />, desc: '5 neuroscience-based quizzes', route: '/quizzes', color: '#8B5CF6' },
  { label: 'Insights', icon: <TrendingUp size={20} />, desc: 'Weekly emotional rhythm', route: '/insights', color: '#10B981' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { moods, gratitudes, habits, addCheckIn } = useApp();
  const { getPrimaryColor } = useSettings();
  const primary = getPrimaryColor();
  const [selectedMood, setSelectedMood] = useState('');
  const [moodNote, setMoodNote] = useState('');

  const todayMood = moods[0];
  const todayGratitude = gratitudes[0];
  const completedHabits = habits.filter(h => h.completedToday).length;

  const handleLogMood = () => {
    if (!selectedMood) return;
    addCheckIn({
      id: Date.now().toString(),
      mood: selectedMood,
      intensity: 'medium',
      note: moodNote,
      shared: false,
      createdAt: new Date().toISOString(),
    });
    setSelectedMood('');
    setMoodNote('');
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-sm text-charcoal dark:text-cream-soft" style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
              Aevum
            </h1>
            <p className="text-caption text-clay mt-0.5" style={{ fontSize: 10, letterSpacing: '0.08em' }}>WHERE LOVE LEARNS TO LAST</p>
          </div>
          <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full flex items-center justify-center text-white text-body-sm font-medium" style={{ background: `linear-gradient(135deg, ${primary} 0%, #A855F7 100%)` }}>
            <User size={16} />
          </button>
        </div>
      </header>

      <div className="px-5 pb-24 space-y-6">
        {/* Daily greeting */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-body-lg text-charcoal dark:text-cream-soft">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'},
          </p>
          <p className="text-body-sm text-clay mt-1">How are you feeling today?</p>
        </motion.div>

        {/* Mood quick-check */}
        {!todayMood ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
            <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft mb-3">Tap your mood</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x pb-2">
              {moodOptions.map(m => (
                <button key={m.label} onClick={() => setSelectedMood(m.label)}
                  className={`snap-start flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all ${selectedMood === m.label ? 'text-white scale-105' : 'bg-parchment dark:bg-white/5'}`}
                  style={selectedMood === m.label ? { backgroundColor: m.color } : undefined}>
                  {m.icon}
                  <span className="text-caption">{m.label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence>
              {selectedMood && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="pt-3 space-y-2">
                    <input value={moodNote} onChange={e => setMoodNote(e.target.value)} placeholder="Why do you feel this way? (optional)"
                      className="w-full h-[40px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body-sm text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
                    <button onClick={handleLogMood}
                      className="w-full h-[40px] rounded-full text-white text-body-sm font-medium" style={{ backgroundColor: primary }}>Log Check-In</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primary}15` }}>
              <CheckCircle2 size={20} style={{ color: primary }} />
            </div>
            <div>
              <p className="text-body-sm text-charcoal dark:text-cream-soft font-medium">You checked in today</p>
              <p className="text-caption text-clay">Feeling {todayMood.mood} — {todayMood.note || 'No note'}</p>
            </div>
          </motion.div>
        )}

        {/* Habits streak */}
        {habits.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Today's Habits</p>
              <p className="text-caption text-clay">{completedHabits}/{habits.length} done</p>
            </div>
            <div className="space-y-2">
              {habits.slice(0, 4).map(h => (
                <div key={h.id} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${h.completedToday ? 'bg-emerald-500' : 'border-2 border-clay/30'}`}>
                    {h.completedToday && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <span className={`text-body-sm flex-1 ${h.completedToday ? 'text-charcoal/50 dark:text-cream-soft/50 line-through' : 'text-charcoal dark:text-cream-soft'}`}>{h.name}</span>
                  <span className="text-caption text-clay">{h.streak}d</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/hub/notes')} className="mt-3 text-caption flex items-center gap-1" style={{ color: primary }}>
              View all habits <ChevronRight size={12} />
            </button>
          </motion.div>
        )}

        {/* Gratitude reminder */}
        {!todayGratitude && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-charcoal rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Heart size={16} className="text-white/70" />
              <p className="text-body-sm font-medium text-white">Gratitude check</p>
            </div>
            <p className="text-caption text-white/60 mb-3">What are you grateful for today?</p>
            <button onClick={() => navigate('/hub/wellness')}
              className="px-5 h-[36px] rounded-full text-white text-body-sm font-medium" style={{ backgroundColor: primary }}>Reflect</button>
          </motion.div>
        )}

        {/* Quick insights */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-3">
          <h3 className="text-label text-clay">Your Space</h3>
          {quickInsights.map((item, i) => (
            <motion.button key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.route)}
              className="w-full text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-body font-medium text-charcoal dark:text-cream-soft">{item.label}</p>
                  <p className="text-caption text-clay mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight size={18} className="text-clay/40" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Floating AI button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/ai/workspace')}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full shadow-fab flex items-center justify-center text-white"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, #A855F7 100%)` }}
      >
        <Sparkles size={24} />
      </motion.button>
    </div>
  );
}
