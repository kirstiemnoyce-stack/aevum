import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckSquare, Clock, Briefcase, Plus, Play, Square } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function WorkScreen() {
  const navigate = useNavigate();
  const { tasks, pomodoroSessions, toggleTask, addTask, addPomodoro, addWorkLog } = useApp();
  const [tab, setTab] = useState<'tasks' | 'pomodoro' | 'log'>('tasks');
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [workHours, setWorkHours] = useState(8);
  const [workDesc, setWorkDesc] = useState('');

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask({ id: Date.now().toString(), title: newTask.trim(), priority, completed: false });
    setNewTask('');
  };

  const formatPomo = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Work</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[{ id: 'tasks' as const, label: 'Tasks', icon: <CheckSquare size={16} /> }, { id: 'pomodoro' as const, label: 'Pomodoro', icon: <Clock size={16} /> }, { id: 'log' as const, label: 'Time Log', icon: <Briefcase size={16} /> }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'bg-primary text-white' : 'bg-cream-soft dark:bg-white/5 text-clay'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'tasks' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-4 shadow-card flex gap-2">
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTask()} placeholder="Add a task..."
                className="flex-1 h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none focus:border-primary" />
              <div className="flex gap-1">
                {(['high', 'medium', 'low'] as const).map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`w-8 h-[44px] rounded-lg text-caption font-bold capitalize ${priority === p ? 'bg-primary text-white' : 'bg-parchment dark:bg-white/5 text-clay'}`}>
                    {p[0]}
                  </button>
                ))}
              </div>
              <button onClick={handleAddTask} className="w-10 h-[44px] rounded-lg bg-primary flex items-center justify-center"><Plus size={18} className="text-white" /></button>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {pending.map(t => (
                  <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                    className="p-4 rounded-xl bg-cream-soft dark:bg-white/5 flex items-center gap-3">
                    <button onClick={() => toggleTask(t.id)} className="w-6 h-6 rounded-full border-2 border-clay/30 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm text-charcoal dark:text-cream-soft">{t.title}</p>
                      {t.project && <span className="text-caption text-clay">{t.project}</span>}
                    </div>
                    <span className={`text-caption px-2 py-0.5 rounded-full ${
                      t.priority === 'high' ? 'bg-red-100 text-red-600' : t.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-sage/20 text-sage'
                    }`}>{t.priority}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {completed.length > 0 && (
                <>
                  <p className="text-label text-clay mt-4 mb-2">Completed ({completed.length})</p>
                  {completed.slice(-5).map(t => (
                    <div key={t.id} className="p-4 rounded-xl bg-cream-soft/50 dark:bg-white/[0.02] flex items-center gap-3 opacity-60">
                      <div className="w-6 h-6 rounded-full bg-sage flex items-center justify-center flex-shrink-0"><CheckSquare size={14} className="text-white" /></div>
                      <p className="text-body-sm text-charcoal dark:text-cream-soft line-through">{t.title}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'pomodoro' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-charcoal rounded-2xl p-8 text-center">
              <p className="text-display-lg text-white font-mono">{formatPomo(pomoTime)}</p>
              <p className="text-caption text-white/50 mt-2">{pomoActive ? 'Focus time' : 'Ready to start'}</p>
              <div className="flex justify-center gap-3 mt-6">
                {!pomoActive ? (
                  <button onClick={() => setPomoActive(true)} className="w-14 h-14 rounded-full bg-primary flex items-center justify-center"><Play size={24} className="text-white ml-1" /></button>
                ) : (
                  <button onClick={() => { setPomoActive(false); addPomodoro({ id: Date.now().toString(), minutes: Math.floor((25 * 60 - pomoTime) / 60), date: new Date().toISOString().split('T')[0] }); setPomoTime(25 * 60); }}
                    className="w-14 h-14 rounded-full bg-sage flex items-center justify-center"><Square size={20} className="text-white" /></button>
                )}
              </div>
            </div>
            {pomodoroSessions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-label text-clay">Recent Sessions</h3>
                {pomodoroSessions.slice(0, 5).map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-cream-soft dark:bg-white/5 flex items-center justify-between">
                    <span className="text-body-sm text-charcoal dark:text-cream-soft">{p.minutes} min session</span>
                    <span className="text-caption text-clay">{p.date}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'log' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
              <label className="text-body-sm text-charcoal dark:text-cream-soft block mb-2">Hours worked: {workHours}</label>
              <input type="range" min={1} max={16} value={workHours} onChange={e => setWorkHours(Number(e.target.value))}
                className="w-full h-2 bg-clay/20 rounded-full appearance-none accent-burnt-orange mb-3" />
              <input value={workDesc} onChange={e => setWorkDesc(e.target.value)} placeholder="What did you work on?"
                className="w-full h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none focus:border-primary" />
              <button onClick={() => { addWorkLog({ id: Date.now().toString(), hours: workHours, description: workDesc || 'General work', date: new Date().toISOString().split('T')[0] }); setWorkDesc(''); }}
                className="w-full mt-3 h-[48px] rounded-full bg-primary text-white font-medium text-body">Log Hours</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
