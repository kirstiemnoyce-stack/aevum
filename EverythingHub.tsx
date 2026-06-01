import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Dumbbell, Droplets, Weight, Plus, Minus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const workoutTypes = ['Cardio', 'Strength', 'Yoga', 'Swimming', 'Running', 'Walking', 'Cycling', 'HIIT', 'Other'];

export default function HealthScreen() {
  const navigate = useNavigate();
  const { workouts, waterLogs, bodyMetrics, addWorkout, addWater, addBodyMetric } = useApp();
  const [tab, setTab] = useState<'workout' | 'water' | 'body'>('workout');
  const [wType, setWType] = useState('Cardio');
  const [wDuration, setWDuration] = useState(30);
  const [wIntensity, setWIntensity] = useState('moderate');
  const [weight, setWeight] = useState(70);
  const today = new Date().toISOString().split('T')[0];
  const todayWater = waterLogs.find(w => w.date === today)?.glasses || 0;

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Physical Health</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[{ id: 'workout' as const, label: 'Workouts', icon: <Dumbbell size={16} /> }, { id: 'water' as const, label: 'Water', icon: <Droplets size={16} /> }, { id: 'body' as const, label: 'Body', icon: <Weight size={16} /> }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'bg-primary text-white' : 'bg-cream-soft dark:bg-white/5 text-clay'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'workout' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card space-y-4">
              <label className="text-body-sm text-charcoal dark:text-cream-soft block">Workout Type</label>
              <div className="flex flex-wrap gap-2">
                {workoutTypes.map(t => (
                  <button key={t} onClick={() => setWType(t)}
                    className={`px-3 py-1.5 rounded-full text-body-sm transition-colors ${wType === t ? 'bg-primary text-white' : 'bg-parchment dark:bg-white/5 text-clay'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <label className="text-body-sm text-charcoal dark:text-cream-soft block">Duration: {wDuration} min</label>
              <input type="range" min={5} max={120} step={5} value={wDuration} onChange={e => setWDuration(Number(e.target.value))}
                className="w-full h-2 bg-clay/20 rounded-full appearance-none accent-burnt-orange" />
              <label className="text-body-sm text-charcoal dark:text-cream-soft block">Intensity</label>
              <div className="flex gap-2">
                {['light', 'moderate', 'high'].map(i => (
                  <button key={i} onClick={() => setWIntensity(i)}
                    className={`flex-1 py-2 rounded-xl text-body-sm capitalize transition-colors ${wIntensity === i ? 'bg-primary text-white' : 'bg-parchment dark:bg-white/5 text-clay'}`}>
                    {i}
                  </button>
                ))}
              </div>
              <button onClick={() => addWorkout({ id: Date.now().toString(), type: wType, duration: wDuration, intensity: wIntensity, date: today })}
                className="w-full h-[48px] rounded-full bg-primary text-white font-medium text-body">Log Workout</button>
            </div>
            {workouts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-label text-clay px-1">Recent</h3>
                {workouts.slice(0, 5).map(w => (
                  <div key={w.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{w.type}</p>
                      <p className="text-caption text-clay capitalize">{w.intensity} intensity</p>
                    </div>
                    <span className="text-body-sm text-sage">{w.duration} min</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'water' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card text-center">
              <p className="text-display-md text-charcoal dark:text-cream-soft mb-2">{todayWater} <span className="text-body text-clay">/ 8 glasses</span></p>
              <div className="flex gap-2 justify-center mt-4">
                <button onClick={() => addWater({ id: Date.now().toString(), glasses: Math.max(0, todayWater - 1), date: today })}
                  className="w-12 h-12 rounded-full bg-parchment dark:bg-white/5 flex items-center justify-center"><Minus size={20} className="text-clay" /></button>
                <button onClick={() => addWater({ id: Date.now().toString(), glasses: todayWater + 1, date: today })}
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center"><Plus size={20} className="text-white" /></button>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'body' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
              <label className="text-body-sm text-charcoal dark:text-cream-soft block mb-3">Weight (kg): {weight}</label>
              <input type="range" min={30} max={200} value={weight} onChange={e => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-clay/20 rounded-full appearance-none accent-burnt-orange" />
              <button onClick={() => addBodyMetric({ id: Date.now().toString(), weight, date: today })}
                className="w-full mt-4 h-[48px] rounded-full bg-primary text-white font-medium text-body">Log Weight</button>
            </div>
            {bodyMetrics.length > 0 && (
              <div className="space-y-2">
                {bodyMetrics.slice(0, 5).map(b => (
                  <div key={b.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5 flex items-center justify-between">
                    <span className="text-body-sm text-charcoal dark:text-cream-soft">{b.weight} kg</span>
                    <span className="text-caption text-clay">{b.date}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
