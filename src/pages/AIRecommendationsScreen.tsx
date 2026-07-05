import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, TrendingUp, Clock, HeartHandshake, BrainCircuit,
  Sparkles, Shield, X, CheckCircle2,
} from 'lucide-react';
import { useAISystems } from '@/contexts/AISystemContext';

const categoryIcons: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  timing: { icon: <Clock size={16} />, color: 'var(--app-primary, #6366F1)', label: 'Timing' },
  activity: { icon: <Sparkles size={16} />, color: '#10B981', label: 'Activity' },
  conversation: { icon: <HeartHandshake size={16} />, color: '#A855F7', label: 'Conversation' },
  self_care: { icon: <Shield size={16} />, color: '#64748B', label: 'Self-Care' },
  connection: { icon: <BrainCircuit size={16} />, color: '#64748B', label: 'Connection' },
};

export default function AIRecommendationsScreen() {
  const navigate = useNavigate();
  const { recommendations, dismissRecommendation } = useAISystems();
  const active = recommendations.filter(r => !r.dismissed);
  const dismissed = recommendations.filter(r => r.dismissed);

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/ai-hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">For You</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Insight header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-primary" />
            <p className="text-body-sm font-medium text-white">Context-Aware Intelligence</p>
          </div>
          <p className="text-caption text-white/60">
            These recommendations adapt based on your check-ins, quiz results, conversation patterns, and partner dynamics.
          </p>
        </motion.div>

        {/* Active recommendations */}
        {active.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <h3 className="text-label text-clay px-1">Active ({active.length})</h3>
            {active.map((rec, i) => {
              const cat = categoryIcons[rec.category] || categoryIcons.connection;
              return (
                <motion.div key={rec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}15` }}>
                      <span style={{ color: cat.color }}>{cat.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-caption px-2 py-0.5 rounded-full bg-clay/10" style={{ color: cat.color }}>{cat.label}</span>
                        <span className={`text-caption px-2 py-0.5 rounded-full ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                          rec.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                          'bg-sage/20 text-sage'
                        }`}>{rec.priority}</span>
                      </div>
                      <h4 className="text-body-sm font-medium text-charcoal dark:text-cream-soft mb-1">{rec.title}</h4>
                      <p className="text-caption text-clay mb-2">{rec.description}</p>
                      <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-parchment dark:bg-white/5">
                        <BrainCircuit size={12} className="text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-caption text-clay">{rec.reason}</p>
                      </div>
                    </div>
                    <button onClick={() => dismissRecommendation(rec.id)} className="p-1 hover:bg-clay/10 rounded-full transition-colors">
                      <X size={16} className="text-clay" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-8 shadow-card text-center">
            <CheckCircle2 size={32} className="text-sage mx-auto mb-3" />
            <p className="text-body-sm text-charcoal dark:text-cream-soft">All caught up!</p>
            <p className="text-caption text-clay mt-1">Check back after more check-ins and conversations</p>
          </motion.div>
        )}

        {/* Dismissed */}
        {dismissed.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <h3 className="text-label text-clay px-1">Completed</h3>
            {dismissed.slice(0, 3).map(rec => {
              const cat = categoryIcons[rec.category] || categoryIcons.connection;
              return (
                <div key={rec.id} className="p-4 rounded-xl bg-cream-soft/50 dark:bg-white/[0.02] opacity-60">
                  <div className="flex items-center gap-2">
                    <span style={{ color: cat.color }}>{cat.icon}</span>
                    <p className="text-caption text-clay line-through">{rec.title}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
