import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Heart, Zap, Meh, Frown, Smile, Wind, Brain, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { CheckIn } from '@/contexts/AppContext';

const moods = [
  { label: 'Joyful', icon: <Smile size={22} />, color: '#F59E0B' },
  { label: 'Loving', icon: <Heart size={22} />, color: '#EC4899' },
  { label: 'Calm', icon: <Wind size={22} />, color: '#6366F1' },
  { label: 'Energised', icon: <Zap size={22} />, color: '#10B981' },
  { label: 'Thoughtful', icon: <Brain size={22} />, color: '#8B5CF6' },
  { label: 'Neutral', icon: <Meh size={22} />, color: '#64748B' },
  { label: 'Anxious', icon: <Frown size={22} />, color: '#F97316' },
  { label: 'Sad', icon: <Frown size={22} />, color: '#3B82F6' },
];

const intensities = ['Subtle', 'Moderate', 'Strong', 'Overwhelming'];

export default function CheckInScreen() {
  const navigate = useNavigate();
  const { addCheckIn } = useApp();
  const [step, setStep] = useState<'mood' | 'intensity' | 'note' | 'done'>('mood');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [shared, setShared] = useState(true);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setStep('intensity');
  };

  const handleIntensitySelect = (intensity: string) => {
    setSelectedIntensity(intensity);
    setStep('note');
  };

  const handleSubmit = () => {
    if (!selectedMood || !selectedIntensity) return;
    const checkIn: CheckIn = {
      id: Date.now().toString(),
      mood: selectedMood,
      intensity: selectedIntensity,
      note,
      shared,
      createdAt: new Date().toISOString(),
    };
    addCheckIn(checkIn);
    setStep('done');
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-4 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-clay/10 transition-colors">
            <ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" />
          </button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Check In</h1>
        </div>
      </header>

      <div className="px-5 pb-12">
        <AnimatePresence mode="wait">
          {step === 'mood' && (
            <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-body text-clay mb-6 mt-4">How are you feeling right now?</p>
              <div className="grid grid-cols-2 gap-3">
                {moods.map(m => (
                  <button key={m.label} onClick={() => handleMoodSelect(m.label)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-cream-soft dark:bg-white/5 hover:scale-[1.02] transition-transform">
                    <span style={{ color: m.color }}>{m.icon}</span>
                    <span className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{m.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'intensity' && (
            <motion.div key="intensity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-body text-clay mb-6 mt-4">How intense is this feeling?</p>
              <div className="space-y-3">
                {intensities.map(i => (
                  <button key={i} onClick={() => handleIntensitySelect(i)}
                    className="w-full p-4 text-left rounded-2xl bg-cream-soft dark:bg-white/5 hover:scale-[1.01] transition-transform text-body-sm font-medium text-charcoal dark:text-cream-soft">
                    {i}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'note' && (
            <motion.div key="note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-4">
              <p className="text-body text-clay mb-4">Anything you'd like to add? <span className="text-caption">(optional)</span></p>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="What's on your mind..."
                className="w-full h-32 rounded-2xl border border-clay/20 bg-cream-soft dark:bg-white/5 p-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none resize-none" />
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => setShared(s => !s)}
                  className={`w-10 h-6 rounded-full transition-colors ${shared ? 'bg-primary' : 'bg-clay/30'}`}>
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform mx-1 ${shared ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="text-body-sm text-clay">Share with partner</span>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                className="w-full mt-6 py-4 rounded-full bg-primary text-white font-medium text-body">
                Complete Check-In
              </motion.button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Heart size={28} className="text-emerald-500" />
              </div>
              <h2 className="text-display-lg text-charcoal dark:text-cream-soft mb-2">Checked in!</h2>
              <p className="text-body text-clay mb-8">Your {selectedMood?.toLowerCase()} feeling has been logged.</p>
              <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full bg-primary text-white font-medium text-body">
                Back Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
