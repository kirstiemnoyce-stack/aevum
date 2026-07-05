import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle, HeartHandshake, BarChart3, Users,
  Lightbulb, TrendingUp, BrainCircuit, Sparkles,
  ChevronRight, Zap, AlertTriangle,
} from 'lucide-react';
import { useAISystems } from '@/contexts/AISystemContext';
import { useApp } from '@/contexts/AppContext';
import { useSettings } from '@/contexts/SettingsContext';

interface HubCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  alert?: boolean;
}

export default function AIHubScreen() {
  const navigate = useNavigate();
  const { partner } = useApp();
  const { evergreenMetrics, partnerDynamic, getUnreadAlerts, getActiveRecommendations } = useAISystems();
  const { getPrimaryColor } = useSettings();
  const primary = getPrimaryColor();

  const unreadAlerts = getUnreadAlerts();
  const activeRecs = getActiveRecommendations();

  const cards: HubCard[] = [
    {
      id: 'coach',
      title: 'Relationship Coach',
      subtitle: 'AI support for your relationship',
      icon: <MessageCircle size={22} />,
      color: '#E11D48',
      route: '/ai/coach',
    },
    {
      id: 'analysis',
      title: 'Relationship Analysis',
      subtitle: 'Health predictions & patterns',
      icon: <BarChart3 size={22} />,
      color: '#3B82F6',
      route: '/ai/analysis',
      alert: unreadAlerts.length > 0,
    },
    {
      id: 'conflict',
      title: 'Conflict Resolution',
      subtitle: 'De-escalation & repair guidance',
      icon: <HeartHandshake size={22} />,
      color: '#F59E0B',
      route: '/ai/conflict',
    },
    {
      id: 'content',
      title: 'Couple Activities',
      subtitle: 'Date ideas, prompts & exercises',
      icon: <Lightbulb size={22} />,
      color: '#8B5CF6',
      route: '/ai/content',
    },
    {
      id: 'recommendations',
      title: 'Smart Suggestions',
      subtitle: 'Context-aware for couples',
      icon: <TrendingUp size={22} />,
      color: '#10B981',
      route: '/ai/recommendations',
      alert: activeRecs.length > 0,
    },
    {
      id: 'evergreen',
      title: 'Evergreen Intelligence',
      subtitle: 'AI learning & performance',
      icon: <BrainCircuit size={22} />,
      color: '#06B6D4',
      route: '/ai/evergreen',
    },
  ];

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Aevum Hub</h1>
        <p className="text-body-sm text-clay mt-1">Your relationship space</p>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Partner status */}
        {partner?.connected ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-charcoal rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-body-sm font-medium" style={{ background: `linear-gradient(135deg, ${primary} 0%, #A855F7 100%)` }}>
                {partner.name?.[0] || 'P'}
              </div>
              <div>
                <p className="text-body-sm font-medium text-white">{partner.name || 'Your Partner'}</p>
                <p className="text-caption text-white/50">Connected - {partner.lastCheckIn || 'Active'}</p>
              </div>
            </div>
            <button onClick={() => navigate('/partner')}
              className="w-full h-[40px] rounded-full text-white text-body-sm font-medium border border-white/20 hover:bg-white/10 transition-colors">
              Manage Connection
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-charcoal rounded-2xl p-5 text-center">
            <Users size={24} className="text-white/50 mx-auto mb-2" />
            <p className="text-body-sm text-white/70 mb-3">Connect with your partner to unlock relationship features</p>
            <button onClick={() => navigate('/partner')}
              className="h-[40px] px-6 rounded-full text-white text-body-sm font-medium" style={{ backgroundColor: primary }}>
              Link Partner
            </button>
          </motion.div>
        )}

        {/* Status banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={16} style={{ color: primary }} />
            <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Evergreen Active</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Accuracy', value: `${evergreenMetrics.accuracyScore}%` },
              { label: 'Personal', value: `${evergreenMetrics.personalizationScore}%` },
              { label: 'Emotion', value: `${evergreenMetrics.emotionalUnderstanding}%` },
              { label: 'Satisfaction', value: `${evergreenMetrics.responseSatisfaction}%` },
            ].map(m => (
              <div key={m.label} className="bg-parchment dark:bg-white/5 rounded-lg p-2 text-center">
                <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{m.value}</p>
                <p className="text-caption text-clay">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Partner Dynamic */}
        {partnerDynamic && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} style={{ color: primary }} />
              <p className="text-caption font-medium text-charcoal dark:text-cream-soft">Partner Dynamic</p>
            </div>
            <p className="text-body-sm text-warm-stone dark:text-cream-soft/70 capitalize mb-3">
              {partnerDynamic.pursuerWithdrawerPattern.replace(/_/g, ' ')} pattern
            </p>
            <div className="space-y-2">
              {[
                { label: 'Emotional Sync', value: partnerDynamic.emotionalSynchronization },
                { label: 'Communication', value: partnerDynamic.communicationBalance },
                { label: 'Attachment Match', value: 100 - partnerDynamic.attachmentMismatch },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-caption text-clay w-28">{s.label}</span>
                  <div className="flex-1 h-1.5 bg-clay/15 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <span className="text-caption text-clay w-8 text-right">{s.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Alerts */}
        {unreadAlerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-2">
            {unreadAlerts.slice(0, 2).map(alert => (
              <button key={alert.id} onClick={() => navigate('/ai/analysis')}
                className={`w-full text-left rounded-xl p-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/10 border border-red-200' :
                  alert.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200' :
                  'bg-emerald-50 dark:bg-emerald-900/10'
                }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className={`mt-0.5 flex-shrink-0 ${
                    alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                  }`} />
                  <div>
                    <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{alert.title}</p>
                    <p className="text-caption text-clay mt-0.5">{alert.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Cards */}
        <div className="space-y-3">
          {cards.map((card, i) => (
            <motion.button key={card.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.route)}
              className="w-full text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center relative" style={{ backgroundColor: `${card.color}15` }}>
                  <span style={{ color: card.color }}>{card.icon}</span>
                  {card.alert && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-cream-soft dark:border-espresso-deep" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-body font-medium text-charcoal dark:text-cream-soft">{card.title}</h3>
                    {card.alert && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-caption text-clay">{card.subtitle}</p>
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
