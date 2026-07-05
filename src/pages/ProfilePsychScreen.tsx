import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, HeartPulse, Thermometer, FlaskConical,
  ShieldAlert, MessagesSquare, ArrowRight, Users,
  Sparkles, Brain,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const quizMeta: Record<string, { icon: React.ReactNode; color: string; title: string }> = {
  attachment: { icon: <HeartPulse size={18} />, color: 'var(--app-primary, #6366F1)', title: 'Attachment Style' },
  window: { icon: <Thermometer size={18} />, color: '#10B981', title: 'Window of Tolerance' },
  neurochemistry: { icon: <FlaskConical size={18} />, color: '#A855F7', title: 'Neurochemistry Profile' },
  trauma: { icon: <ShieldAlert size={18} />, color: '#64748B', title: 'Trauma & Programming' },
  communication: { icon: <MessagesSquare size={18} />, color: '#334155', title: 'Communication & Coping' },
};

const attachmentInfo: Record<string, { label: string; color: string; description: string }> = {
  secure: { label: 'Secure', color: '#10B981', description: 'Comfortable with intimacy and independence' },
  anxious: { label: 'Anxious', color: 'var(--app-primary, #6366F1)', description: 'Hypervigilance toward signs of rejection' },
  avoidant: { label: 'Avoidant', color: '#64748B', description: 'Withdraws when relationships feel intense' },
  disorganized: { label: 'Disorganized', color: '#A855F7', description: 'Craves closeness but fears it' },
};

export default function ProfilePsychScreen() {
  const navigate = useNavigate();
  const { partner, quizResults } = useApp();

  const attachmentResult = quizResults.find(r => r.quizId === 'attachment');
  const windowResult = quizResults.find(r => r.quizId === 'window');
  const neuroResult = quizResults.find(r => r.quizId === 'neurochemistry');
  const traumaResult = quizResults.find(r => r.quizId === 'trauma');
  const commResult = quizResults.find(r => r.quizId === 'communication');

  const completedCount = quizResults.length;
  const allCompleted = completedCount === 5;

  // Extract attachment style for partner comparison
  const myAttStyle = attachmentResult?.primaryResult?.toLowerCase().includes('anxious')
    ? 'anxious'
    : attachmentResult?.primaryResult?.toLowerCase().includes('avoidant')
    ? 'avoidant'
    : attachmentResult?.primaryResult?.toLowerCase().includes('secure')
    ? 'secure'
    : 'anxious'; // default

  const partnerAttStyle = 'avoidant'; // demo partner
  const myAtt = attachmentInfo[myAttStyle] || attachmentInfo.anxious;
  const partnerAtt = attachmentInfo[partnerAttStyle] || attachmentInfo.avoidant;

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">My Psychology</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-6 max-w-lg mx-auto">
        {/* Take assessments CTA */}
        {!allCompleted && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-charcoal rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Brain size={20} className="text-primary" />
              <h2 className="text-body-lg font-medium text-white">
                {completedCount === 0 ? 'Build Your Profile' : 'Continue Your Assessments'}
              </h2>
            </div>
            <p className="text-body-sm text-white/70 mb-4">
              {completedCount === 0
                ? "Take 5 neuroscience-based assessments to understand your attachment style, nervous system patterns, neurochemistry, trauma history, and communication dynamics."
                : `You've completed ${completedCount} of 5 assessments. Finish the rest for a complete picture of your relationship psychology.`}
            </p>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div className="h-full rounded-full bg-primary"
                initial={{ width: 0 }} animate={{ width: `${(completedCount / 5) * 100}%` }} transition={{ duration: 0.8 }} />
            </div>
            <button onClick={() => navigate('/quizzes')}
              className="w-full py-3 rounded-xl bg-primary text-white font-medium text-body-sm">
              {completedCount === 0 ? 'Start Assessments' : 'Continue'}
            </button>
          </motion.div>
        )}

        {/* Quiz Results */}
        {quizResults.length > 0 && (
          <>
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-label text-clay px-1">
              YOUR RESULTS
            </motion.h2>

            {/* Attachment Style Result */}
            {attachmentResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${quizMeta.attachment.color}15` }}>
                    <span style={{ color: quizMeta.attachment.color }}>{quizMeta.attachment.icon}</span>
                  </div>
                  <div>
                    <p className="text-caption text-clay">{quizMeta.attachment.title}</p>
                    <h3 className="text-display-sm text-charcoal dark:text-cream-soft">{attachmentResult.primaryResult}</h3>
                    {attachmentResult.secondaryResult && (
                      <p className="text-caption text-clay">with {attachmentResult.secondaryResult} tendencies</p>
                    )}
                  </div>
                </div>
                <p className="text-body-sm text-warm-stone dark:text-cream-soft/70 leading-relaxed mb-4">{attachmentResult.summary}</p>
                {Object.entries(attachmentResult.details).map(([key, value]) => (
                  <div key={key} className="mb-3 last:mb-0 pt-3 border-t border-clay/10">
                    <p className="text-caption font-medium text-charcoal dark:text-cream-soft mb-0.5">{key}</p>
                    <p className="text-caption text-clay">{value}</p>
                  </div>
                ))}
                {/* Score bars */}
                <div className="mt-4 space-y-2">
                  {Object.entries(attachmentResult.scores).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-caption text-clay w-20 capitalize">{k}</span>
                      <div className="flex-1 h-1.5 bg-clay/15 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: quizMeta.attachment.color }}
                          initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8 }} />
                      </div>
                      <span className="text-caption text-clay w-8 text-right">{v}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Window of Tolerance Result */}
            {windowResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${quizMeta.window.color}15` }}>
                    <span style={{ color: quizMeta.window.color }}>{quizMeta.window.icon}</span>
                  </div>
                  <div>
                    <p className="text-caption text-clay">{quizMeta.window.title}</p>
                    <h3 className="text-display-sm text-charcoal dark:text-cream-soft">{windowResult.primaryResult}</h3>
                  </div>
                </div>
                <p className="text-body-sm text-warm-stone dark:text-cream-soft/70 leading-relaxed mb-4">{windowResult.summary}</p>
                {Object.entries(windowResult.details).map(([key, value]) => (
                  <div key={key} className="mb-3 last:mb-0 pt-3 border-t border-clay/10">
                    <p className="text-caption font-medium text-charcoal dark:text-cream-soft mb-0.5">{key}</p>
                    <p className="text-caption text-clay">{value}</p>
                  </div>
                ))}
                <div className="mt-4 space-y-2">
                  {Object.entries(windowResult.scores).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-caption text-clay w-24">{k === 'hyperarousal' ? 'Hyper' : k === 'hypoarousal' ? 'Hypo' : 'Optimal'}</span>
                      <div className="flex-1 h-1.5 bg-clay/15 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: quizMeta.window.color }}
                          initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8 }} />
                      </div>
                      <span className="text-caption text-clay w-8 text-right">{v}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Neurochemistry Result */}
            {neuroResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${quizMeta.neurochemistry.color}15` }}>
                    <span style={{ color: quizMeta.neurochemistry.color }}>{quizMeta.neurochemistry.icon}</span>
                  </div>
                  <div>
                    <p className="text-caption text-clay">{quizMeta.neurochemistry.title}</p>
                    <h3 className="text-display-sm text-charcoal dark:text-cream-soft">{neuroResult.primaryResult}</h3>
                    {neuroResult.secondaryResult && (
                      <p className="text-caption text-clay">{neuroResult.secondaryResult}</p>
                    )}
                  </div>
                </div>
                <p className="text-body-sm text-warm-stone dark:text-cream-soft/70 leading-relaxed mb-4">{neuroResult.summary}</p>
                <div className="mt-4 space-y-2">
                  {Object.entries(neuroResult.scores).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-caption text-clay w-24 capitalize">{k.slice(0, 10)}</span>
                      <div className="flex-1 h-1.5 bg-clay/15 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: quizMeta.neurochemistry.color }}
                          initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8 }} />
                      </div>
                      <span className="text-caption text-clay w-8 text-right">{v}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Trauma Result */}
            {traumaResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${quizMeta.trauma.color}15` }}>
                    <span style={{ color: quizMeta.trauma.color }}>{quizMeta.trauma.icon}</span>
                  </div>
                  <div>
                    <p className="text-caption text-clay">{quizMeta.trauma.title}</p>
                    <h3 className="text-display-sm text-charcoal dark:text-cream-soft">{traumaResult.primaryResult}</h3>
                  </div>
                </div>
                <p className="text-body-sm text-warm-stone dark:text-cream-soft/70 leading-relaxed mb-4">{traumaResult.summary}</p>
                {Object.entries(traumaResult.details).map(([key, value]) => (
                  <div key={key} className={`mb-2 px-3 py-2.5 rounded-lg ${key.includes('Elevated') ? 'bg-red-50 dark:bg-red-900/10' : key.includes('Moderate') ? 'bg-amber-50 dark:bg-amber-900/10' : 'bg-sage/10 dark:bg-sage/5'}`}>
                    <p className="text-caption font-medium text-charcoal dark:text-cream-soft">{key}</p>
                    <p className="text-caption text-clay mt-0.5">{value}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Communication Result */}
            {commResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${quizMeta.communication.color}15` }}>
                    <span style={{ color: quizMeta.communication.color }}>{quizMeta.communication.icon}</span>
                  </div>
                  <div>
                    <p className="text-caption text-clay">{quizMeta.communication.title}</p>
                    <h3 className="text-display-sm text-charcoal dark:text-cream-soft">{commResult.primaryResult}</h3>
                  </div>
                </div>
                <p className="text-body-sm text-warm-stone dark:text-cream-soft/70 leading-relaxed mb-4">{commResult.summary}</p>
                {Object.entries(commResult.details).map(([key, value]) => (
                  <div key={key} className="mb-3 last:mb-0 pt-3 border-t border-clay/10">
                    <p className="text-caption font-medium text-charcoal dark:text-cream-soft mb-0.5">{key}</p>
                    <p className="text-caption text-clay">{value}</p>
                  </div>
                ))}
                <div className="mt-4 space-y-2">
                  {Object.entries(commResult.scores)
                    .filter(([k]) => !['self_soothing', 'signal_return'].includes(k))
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-caption text-clay w-24 capitalize">{k.replace(/_/g, ' ').slice(0, 12)}</span>
                      <div className="flex-1 h-1.5 bg-clay/15 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: quizMeta.communication.color }}
                          initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8 }} />
                      </div>
                      <span className="text-caption text-clay w-8 text-right">{v}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Partner Comparison */}
            {partner?.connected && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h3 className="text-label text-clay mb-3 px-1 flex items-center gap-2"><Users size={14} /> Partner Comparison</h3>
                <div className="bg-charcoal rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <p className="text-caption text-white/50 mb-1">You</p>
                      <p className="text-body font-medium" style={{ color: myAtt.color }}>{myAtt.label}</p>
                    </div>
                    <ArrowRight size={20} className="text-clay mx-4" />
                    <div className="text-center flex-1">
                      <p className="text-caption text-white/50 mb-1">{partner.name || 'Partner'}</p>
                      <p className="text-body font-medium" style={{ color: partnerAtt.color }}>{partnerAtt.label}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <p className="text-caption text-sage mb-2">Your Dynamic</p>
                    <p className="text-body-sm text-white leading-relaxed">
                      {myAttStyle === 'anxious'
                        ? "Your pursuit triggers their withdrawal, and their withdrawal triggers your panic. Neither is attacking — both are defending. Building a shared language for states ('I'm starting to spiral' / 'I'm getting flooded') is your highest-leverage intervention."
                        : myAttStyle === 'avoidant'
                        ? "Your withdrawal activates their abandonment fear, and their pursuit triggers your suffocation response. When you need space, signal your return explicitly: 'I need 30 minutes, and I'm coming back.'"
                        : "Your secure attachment creates a foundation of stability. You can help your partner co-regulate by staying present and curious when their nervous system gets activated."}
                    </p>
                  </div>
                  {(windowResult || commResult) && (
                    <div className="space-y-2">
                      {windowResult && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-caption text-white/50 mb-1">Window of Tolerance</p>
                          <p className="text-body-sm text-white">{windowResult.primaryResult}</p>
                          <p className="text-caption text-white/60 mt-1">
                            {windowResult.primaryResult.toLowerCase().includes('hyper')
                              ? "Your partner's window may collapse inward while yours blows open. Name your states before they escalate."
                              : windowResult.primaryResult.toLowerCase().includes('hypo')
                              ? "Your nervous system shuts down while your partner's may activate. Learn to signal return after taking space."
                              : "Your wide window is an asset. Help your partner recognize their own window states."}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Retake button */}
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/quizzes')}
              className="w-full flex items-center justify-center gap-2 py-4 text-body text-primary hover:text-primary/80 transition-colors"
            >
              <Sparkles size={18} /> Retake or Complete Assessments
            </motion.button>
          </>
        )}

        {/* If no results yet */}
        {quizResults.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Brain size={24} className="text-primary" />
            </div>
            <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-2">No Results Yet</h3>
            <p className="text-body-sm text-clay mb-4">
              Take the assessments to build your personalized psychological profile based on neuroscience research.
            </p>
            <button onClick={() => navigate('/quizzes')}
              className="px-8 py-3 rounded-full bg-primary text-white font-medium text-body-sm">
              Start Now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
