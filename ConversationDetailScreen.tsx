import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Plus, MessageSquare, ShieldCheck,
  HeartHandshake, Send, X, CheckCircle2,
} from 'lucide-react';
import { useAISystems } from '@/contexts/AISystemContext';

export default function ConflictResolutionScreen() {
  const navigate = useNavigate();
  const { conflictSessions, startConflictSession, addConflictMessage, resolveConflict } = useAISystems();
  const [showNew, setShowNew] = useState(false);
  const [topic, setTopic] = useState('');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const session = conflictSessions.find(s => s.id === activeSession);

  const handleStart = () => {
    if (!topic.trim()) return;
    const id = startConflictSession(topic.trim());
    setTopic('');
    setShowNew(false);
    setActiveSession(id);
  };

  const handleSend = () => {
    if (!input.trim() || !activeSession) return;
    addConflictMessage(activeSession, 'user', input.trim());
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      addConflictMessage(activeSession, 'ai', "I hear you. Let's slow this down together. Before we work on solutions, I want to check: what are you feeling in your body right now? Tightness, heat, numbness? This tells us where your nervous system is.");
    }, 1000);
  };

  if (activeSession && session) {
    return (
      <div className="min-h-screen bg-parchment dark:bg-espresso-deep flex flex-col">
        <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setActiveSession(null)} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
            <div className="text-center">
              <h1 className="text-display-sm text-charcoal dark:text-cream-soft">Conflict Session</h1>
              <p className="text-caption text-clay truncate max-w-[200px]">{session.topic}</p>
            </div>
            <button onClick={() => { resolveConflict(session.id); setActiveSession(null); }} className="p-2 -mr-2">
              <CheckCircle2 size={22} className="text-sage" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* De-escalation scripts */}
          {session.messages.length <= 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-label text-clay px-1">De-escalation Scripts</p>
              {session.deEscalationScripts.map((script, i) => (
                <button key={i} onClick={() => addConflictMessage(session.id, 'user', script)}
                  className="w-full text-left p-4 rounded-xl bg-cream-soft dark:bg-white/5 hover:shadow-card transition-shadow">
                  <p className="text-body-sm text-charcoal dark:text-cream-soft italic">&ldquo;{script}&rdquo;</p>
                  <p className="text-caption text-sage mt-1">Tap to use</p>
                </button>
              ))}
            </motion.div>
          )}

          {/* Messages */}
          {session.messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex gap-3'}>
              {msg.role === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-sage" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'user' ? 'bg-primary rounded-tr-sm' : 'bg-cream-soft dark:bg-white/5 rounded-tl-sm'
                }`}>
                  <p className={`text-body ${msg.role === 'user' ? 'text-white' : 'text-warm-stone dark:text-cream-soft/80'}`}>{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Repair strategies */}
          {session.messages.length > 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-4">
              <p className="text-label text-clay px-1">Repair Strategies</p>
              {session.repairStrategies.map((strategy, i) => (
                <button key={i} onClick={() => addConflictMessage(session.id, 'user', strategy)}
                  className="w-full text-left p-4 rounded-xl bg-sage/10 hover:bg-sage/20 transition-colors">
                  <p className="text-caption text-charcoal dark:text-cream-soft">{strategy}</p>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="sticky bottom-0 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-4 py-3 safe-bottom">
          <div className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-xl border border-clay/20 px-4 py-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Describe what's happening..." className="flex-1 bg-transparent text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend} disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center disabled:opacity-40">
              <Send size={14} className="text-white ml-0.5" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/ai-hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Conflict Aid</h1>
          <button onClick={() => setShowNew(true)} className="p-2 -mr-2"><Plus size={24} className="text-primary" /></button>
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* New session modal */}
        <AnimatePresence>
          {showNew && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNew(false)} className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[320px] bg-parchment dark:bg-espresso-deep rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-display-sm text-charcoal dark:text-cream-soft">New Session</h3>
                  <button onClick={() => setShowNew(false)}><X size={20} className="text-clay" /></button>
                </div>
                <p className="text-body-sm text-clay mb-4">What's the conflict about? Keep it brief.</p>
                <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleStart()}
                  placeholder="e.g., We keep arguing about..." autoFocus
                  className="w-full h-[48px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none focus:border-primary mb-4" />
                <button onClick={handleStart} disabled={!topic.trim()}
                  className="w-full h-[48px] rounded-full bg-primary text-white font-medium text-body disabled:opacity-40">Start Session</button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Quick help cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <button onClick={() => { setTopic('I need help de-escalating'); handleStart(); }}
            className="w-full text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <HeartHandshake size={22} className="text-amber-500" />
              </div>
              <div>
                <p className="text-body font-medium text-charcoal dark:text-cream-soft">I need immediate help</p>
                <p className="text-caption text-clay">Start a guided de-escalation session</p>
              </div>
            </div>
          </button>

          <button onClick={() => { setTopic('How do I repair after a fight'); handleStart(); }}
            className="w-full text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center">
                <MessageSquare size={22} className="text-sage" />
              </div>
              <div>
                <p className="text-body font-medium text-charcoal dark:text-cream-soft">Post-conflict repair</p>
                <p className="text-caption text-clay">Guided repair conversation scripts</p>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Past sessions */}
        {conflictSessions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
            <h3 className="text-label text-clay px-1">Past Sessions</h3>
            {conflictSessions.slice().reverse().map(s => (
              <button key={s.id} onClick={() => setActiveSession(s.id)}
                className="w-full text-left p-4 rounded-xl bg-cream-soft dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft truncate pr-4">{s.topic}</p>
                  <span className={`text-caption px-2 py-0.5 rounded-full ${
                    s.status === 'resolved' ? 'bg-sage/20 text-sage' : 'bg-amber-500/10 text-amber-500'
                  }`}>{s.status}</span>
                </div>
                <p className="text-caption text-clay mt-1">{s.messages.length} messages</p>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
