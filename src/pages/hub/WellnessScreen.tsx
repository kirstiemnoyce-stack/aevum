import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Brain, Moon, Heart, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function WellnessScreen() {
  const navigate = useNavigate();
  const { moods, gratitudes, sleeps, meditations, addMood, addGratitude, addSleep, addMeditation } = useApp();
  const [activeTab, setActiveTab] = useState<'mood' | 'gratitude' | 'sleep' | 'meditate'>('mood');
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [gratitudeText, setGratitudeText] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(7);
  const [meditationMin, setMeditationMin] = useState(10);

  const today = new Date().toISOString().split('T')[0];

  const handleLogMood = () => {
    if (!moodNote.trim()) return;
    addMood({ id: Date.now().toString(), mood: moodIntensity >= 7 ? 'Happy' : moodIntensity >= 4 ? 'Calm' : 'Low', intensity: moodIntensity, note: moodNote, date: today });
    setMoodNote('');
  };

  const handleLogGratitude = () => {
    if (!gratitudeText.trim()) return;
    addGratitude({ id: Date.now().toString(), text: gratitudeText, date: today });
    setGratitudeText('');
  };

  const handleLogSleep = () => { addSleep({ id: Date.now().toString(), duration: sleepHours, quality: sleepQuality, date: today }); };
  const handleLogMeditation = () => { addMeditation({ id: Date.now().toString(), duration: meditationMin, date: today }); };

  const tabs = [
    { id: 'mood' as const, label: 'Mood', icon: <Brain size={16} /> },
    { id: 'gratitude' as const, label: 'Gratitude', icon: <Heart size={16} /> },
    { id: 'sleep' as const, label: 'Sleep', icon: <Moon size={16} /> },
    { id: 'meditate' as const, label: 'Meditate', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Mind & Wellness</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === t.id ? 'bg-primary text-white' : 'bg-cream-soft dark:bg-white/5 text-clay'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Mood Tracker */}
        {activeTab === 'mood' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
              <label className="text-body-sm text-charcoal dark:text-cream-soft mb-3 block">How are you feeling? (1-10)</label>
              <div className="flex items-center gap-3">
                <span className="text-caption text-clay">Low</span>
                <input type="range" min={1} max={10} value={moodIntensity} onChange={e => setMoodIntensity(Number(e.target.value))}
                  className="flex-1 h-2 bg-clay/20 rounded-full appearance-none accent-burnt-orange" />
                <span className="text-caption text-clay">High</span>
                <span className="w-8 text-center text-body font-medium text-primary">{moodIntensity}</span>
              </div>
              <input value={moodNote} onChange={e => setMoodNote(e.target.value)} placeholder="What's on your mind?"
                className="w-full mt-4 h-[48px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none focus:border-primary" />
              <button onClick={handleLogMood} disabled={!moodNote.trim()}
                className="w-full mt-3 h-[48px] rounded-full bg-primary text-white font-medium text-body disabled:opacity-40">Log Mood</button>
            </div>
            {moods.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-label text-clay px-1">Recent Entries</h3>
                {moods.slice(0, 5).map(m => (
                  <div key={m.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{m.mood}</span>
                      <span className="text-caption text-clay">{m.date}</span>
                    </div>
                    <p className="text-caption text-clay mt-1">{m.note}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Gratitude */}
        {activeTab === 'gratitude' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
              <label className="text-body-sm text-charcoal dark:text-cream-soft mb-3 block">What are you grateful for?</label>
              <textarea value={gratitudeText} onChange={e => setGratitudeText(e.target.value)} placeholder="Today I am grateful for..."
                className="w-full h-[100px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 p-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none focus:border-primary resize-none" />
              <button onClick={handleLogGratitude} disabled={!gratitudeText.trim()}
                className="w-full mt-3 h-[48px] rounded-full bg-primary text-white font-medium text-body disabled:opacity-40">Log Gratitude</button>
            </div>
            {gratitudes.length > 0 && (
              <div className="space-y-2">
                {gratitudes.slice(0, 5).map(g => (
                  <div key={g.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5">
                    <p className="text-body-sm text-warm-stone dark:text-cream-soft/80 italic">&ldquo;{g.text}&rdquo;</p>
                    <p className="text-caption text-clay mt-1">{g.date}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Sleep */}
        {activeTab === 'sleep' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
              <label className="text-body-sm text-charcoal dark:text-cream-soft mb-3 block">Hours slept: {sleepHours}h</label>
              <input type="range" min={0} max={12} value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))}
                className="w-full h-2 bg-clay/20 rounded-full appearance-none accent-burnt-orange mb-4" />
              <label className="text-body-sm text-charcoal dark:text-cream-soft mb-3 block">Quality: {sleepQuality}/10</label>
              <input type="range" min={1} max={10} value={sleepQuality} onChange={e => setSleepQuality(Number(e.target.value))}
                className="w-full h-2 bg-clay/20 rounded-full appearance-none accent-sage" />
              <button onClick={handleLogSleep}
                className="w-full mt-4 h-[48px] rounded-full bg-primary text-white font-medium text-body">Log Sleep</button>
            </div>
            {sleeps.length > 0 && (
              <div className="space-y-2">
                {sleeps.slice(0, 5).map(s => (
                  <div key={s.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5 flex items-center justify-between">
                    <span className="text-body-sm text-charcoal dark:text-cream-soft">{s.duration} hours</span>
                    <span className="text-caption text-sage">Quality: {s.quality}/10</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Meditation */}
        {activeTab === 'meditate' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
              <label className="text-body-sm text-charcoal dark:text-cream-soft mb-3 block">Meditation minutes: {meditationMin}</label>
              <input type="range" min={1} max={60} value={meditationMin} onChange={e => setMeditationMin(Number(e.target.value))}
                className="w-full h-2 bg-clay/20 rounded-full appearance-none accent-burnt-orange" />
              <button onClick={handleLogMeditation}
                className="w-full mt-4 h-[48px] rounded-full bg-sage text-white font-medium text-body">Log Session</button>
            </div>
            {meditations.length > 0 && (
              <div className="space-y-2">
                {meditations.slice(0, 5).map(m => (
                  <div key={m.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5 flex items-center justify-between">
                    <span className="text-body-sm text-charcoal dark:text-cream-soft">{m.duration} minutes</span>
                    <span className="text-caption text-clay">{m.date}</span>
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
