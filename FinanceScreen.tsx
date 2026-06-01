import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Dumbbell, Briefcase, Wallet, StickyNote,
  CalendarDays, Plug, Database, ChevronRight,
  TrendingUp, CheckCircle2, Droplets, Heart,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const categories = [
  { id: 'wellness', title: 'Mind & Wellness', subtitle: 'Mood, sleep, gratitude', icon: <Brain size={22} />, color: 'var(--app-primary, #6366F1)', route: '/hub/wellness' },
  { id: 'health', title: 'Physical Health', subtitle: 'Workouts, water, metrics', icon: <Dumbbell size={22} />, color: '#10B981', route: '/hub/health' },
  { id: 'work', title: 'Work & Productivity', subtitle: 'Tasks, pomodoro, time', icon: <Briefcase size={22} />, color: '#A855F7', route: '/hub/work' },
  { id: 'finance', title: 'Finance', subtitle: 'Income, expenses, bills', icon: <Wallet size={22} />, color: '#64748B', route: '/hub/finance' },
  { id: 'notes', title: 'Notes & Knowledge', subtitle: 'Notes, reading, habits', icon: <StickyNote size={22} />, color: '#64748B', route: '/hub/notes' },
  { id: 'calendar', title: 'Calendar & Social', subtitle: 'Events, birthdays, contacts', icon: <CalendarDays size={22} />, color: '#334155', route: '/hub/calendar' },
  { id: 'connectors', title: 'Connectors', subtitle: 'External integrations', icon: <Plug size={22} />, color: 'var(--app-primary, #6366F1)', route: '/hub/connectors' },
  { id: 'data', title: 'Data Manager', subtitle: 'Export, import, settings', icon: <Database size={22} />, color: '#64748B', route: '/hub/data' },
];

export default function EverythingHub() {
  const navigate = useNavigate();
  const { habits, tasks, bills, connectors } = useApp();
  const completedHabits = habits.filter(h => h.completedToday).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const unpaidBills = bills.filter(b => !b.paid);
  const connectedApps = connectors.filter(c => c.connected).length;

  const quickStats = [
    { label: 'Habits', value: `${completedHabits}/${habits.length}`, icon: <CheckCircle2 size={14} />, color: '#10B981' },
    { label: 'Tasks', value: `${pendingTasks}`, icon: <TrendingUp size={14} />, color: 'var(--app-primary, #6366F1)' },
    { label: 'Bills', value: `${unpaidBills.length}`, icon: <Heart size={14} />, color: '#A855F7' },
    { label: 'Connected', value: `${connectedApps}`, icon: <Plug size={14} />, color: '#64748B' },
  ];

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Everything Hub</h1>
        <p className="text-body-sm text-clay mt-1">Your life, tracked and managed</p>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Quick stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-2">
          {quickStats.map(s => (
            <div key={s.label} className="bg-cream-soft dark:bg-white/5 rounded-xl p-3 text-center shadow-card">
              <div className="flex justify-center mb-1" style={{ color: s.color }}>{s.icon}</div>
              <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{s.value}</p>
              <p className="text-caption text-clay">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Water quick-track */}
        <WaterQuickTrack />

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(cat.route)}
              className="text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-charcoal dark:text-cream-soft">{cat.title}</p>
                  <p className="text-caption text-clay">{cat.subtitle}</p>
                </div>
                <ChevronRight size={18} className="text-clay/40 flex-shrink-0" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WaterQuickTrack() {
  const navigate = useNavigate();
  const { waterLogs, addWater } = useApp();
  const todayLog = waterLogs.find(w => w.date === new Date().toISOString().split('T')[0]);
  const glasses = todayLog?.glasses || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      className="bg-charcoal rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-primary" />
          <p className="text-body-sm font-medium text-white">Water Today</p>
        </div>
        <button onClick={() => navigate('/hub/health')} className="text-caption text-white/50">View all</button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <button key={i} onClick={() => addWater({ id: Date.now().toString(), glasses: i + 1, date: new Date().toISOString().split('T')[0] })}
              className={`flex-1 h-8 rounded-lg transition-all ${i < glasses ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'}`} />
          ))}
        </div>
        <span className="text-body-sm text-white ml-2">{glasses}/8</span>
      </div>
    </motion.div>
  );
}
