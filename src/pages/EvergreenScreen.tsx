import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, BrainCircuit, TrendingUp, ThumbsUp,
  ThumbsDown, AlertTriangle, Target, Zap,
} from 'lucide-react';
import { useAISystems } from '@/contexts/AISystemContext';

export default function EvergreenScreen() {
  const navigate = useNavigate();
  const { evergreenMetrics, aevumMessages } = useAISystems();

  const ratedMessages = aevumMessages.filter(m => m.role === 'ai' && m.feedback);
  const satisfactionRate = evergreenMetrics.totalInteractions > 0
    ? Math.round((evergreenMetrics.positiveFeedback / evergreenMetrics.totalInteractions) * 100)
    : 0;

  const metrics = [
    { label: 'Accuracy', value: evergreenMetrics.accuracyScore, icon: <Target size={16} />, color: 'var(--app-primary, #6366F1)' },
    { label: 'Personalization', value: evergreenMetrics.personalizationScore, icon: <Zap size={16} />, color: '#10B981' },
    { label: 'Emotional Understanding', value: evergreenMetrics.emotionalUnderstanding, icon: <BrainCircuit size={16} />, color: '#A855F7' },
    { label: 'Response Satisfaction', value: evergreenMetrics.responseSatisfaction, icon: <TrendingUp size={16} />, color: '#64748B' },
  ];

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/ai-hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Evergreen</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-6">
        {/* Overall score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal rounded-2xl p-6 text-center">
          <p className="text-caption text-white/50 mb-2">Intelligence Score</p>
          <div className="relative inline-flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <motion.circle cx="60" cy="60" r="52" fill="none" stroke="var(--app-primary, #6366F1)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52 * (evergreenMetrics.accuracyScore / 100)} ${2 * Math.PI * 52}`}
                strokeDashoffset={2 * Math.PI * 52 * 0.25}
                initial={{ strokeDasharray: `0 ${2 * Math.PI * 52}` }}
                animate={{ strokeDasharray: `${2 * Math.PI * 52 * (evergreenMetrics.accuracyScore / 100)} ${2 * Math.PI * 52}` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                transform="rotate(-90 60 60)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-display-md text-white">{evergreenMetrics.accuracyScore}</span>
              <span className="text-caption text-white/50">/100</span>
            </div>
          </div>
          <p className="text-body-sm text-white/70 mt-3">{evergreenMetrics.learningCycles} learning cycles completed</p>
        </motion.div>

        {/* Metric bars */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card space-y-5">
          <h3 className="text-display-sm text-charcoal dark:text-cream-soft">Performance Metrics</h3>
          {metrics.map(m => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: m.color }}>{m.icon}</span>
                  <span className="text-body-sm text-charcoal dark:text-cream-soft">{m.label}</span>
                </div>
                <span className="text-body-sm font-medium" style={{ color: m.color }}>{m.value}%</span>
              </div>
              <div className="w-full h-2 bg-clay/15 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: m.color }}
                  initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1, delay: 0.2 }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Interaction stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4">
          <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
            <ThumbsUp size={20} className="text-sage mb-2" />
            <p className="text-display-sm text-charcoal dark:text-cream-soft">{evergreenMetrics.positiveFeedback}</p>
            <p className="text-caption text-clay">Positive ratings</p>
          </div>
          <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
            <ThumbsDown size={20} className="text-clay mb-2" />
            <p className="text-display-sm text-charcoal dark:text-cream-soft">{evergreenMetrics.negativeFeedback}</p>
            <p className="text-caption text-clay">Negative ratings</p>
          </div>
          <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
            <AlertTriangle size={20} className="text-amber-500 mb-2" />
            <p className="text-display-sm text-charcoal dark:text-cream-soft">{evergreenMetrics.lowConfidenceFlags}</p>
            <p className="text-caption text-clay">Low confidence flags</p>
          </div>
          <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
            <TrendingUp size={20} className="text-primary mb-2" />
            <p className="text-display-sm text-charcoal dark:text-cream-soft">{satisfactionRate}%</p>
            <p className="text-caption text-clay">Satisfaction rate</p>
          </div>
        </motion.div>

        {/* Feedback history */}
        {ratedMessages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
            <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-4">Recent Feedback</h3>
            <div className="space-y-3">
              {ratedMessages.slice(-5).reverse().map(msg => (
                <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-parchment dark:bg-white/5">
                  {msg.feedback === 'up' ? <ThumbsUp size={14} className="text-sage mt-0.5" /> : <ThumbsDown size={14} className="text-red-400 mt-0.5" />}
                  <p className="text-caption text-clay line-clamp-2">{msg.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
