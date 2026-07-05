import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, TrendingUp, AlertTriangle, CheckCircle2,
  HeartPulse, Zap, Users,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useAISystems } from '@/contexts/AISystemContext';

const timelineData = [
  { day: 'Mon', you: 3, partner: 2, sync: 60 },
  { day: 'Tue', you: 4, partner: 3, sync: 72 },
  { day: 'Wed', you: 2, partner: 4, sync: 45 },
  { day: 'Thu', you: 5, partner: 3, sync: 55 },
  { day: 'Fri', you: 4, partner: 5, sync: 80 },
  { day: 'Sat', you: 3, partner: 2, sync: 62 },
  { day: 'Sun', you: 4, partner: 4, sync: 85 },
];

export default function AIAnalysisScreen() {
  const navigate = useNavigate();
  const { relationshipAlerts, weeklyReports, partnerDynamic, dismissAlert } = useAISystems();

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/ai-hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Analysis</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-6">
        {/* Health score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <HeartPulse size={20} className="text-primary" />
            <p className="text-body-sm font-medium text-white">Relationship Health</p>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-display-md text-white">78</span>
            <span className="text-body-sm text-sage mb-1">/100</span>
          </div>
          <p className="text-caption text-white/50">Based on check-in patterns, communication frequency, and emotional synchronization</p>
        </motion.div>

        {/* Alerts */}
        {relationshipAlerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-3">
            <h3 className="text-label text-clay px-1">Active Alerts</h3>
            {relationshipAlerts.filter(a => !a.read).map(alert => (
              <div key={alert.id}
                className={`rounded-xl p-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/10 border border-red-200' :
                  alert.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200' :
                  'bg-sage/10'
                }`}>
                <div className="flex items-start gap-3">
                  {alert.severity === 'critical' ? <AlertTriangle size={16} className="text-red-500 mt-0.5" /> :
                   alert.severity === 'warning' ? <AlertTriangle size={16} className="text-amber-500 mt-0.5" /> :
                   <CheckCircle2 size={16} className="text-sage mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{alert.title}</p>
                    <p className="text-caption text-clay mt-0.5">{alert.description}</p>
                    <p className="text-caption text-clay/60 mt-1">{alert.date}</p>
                  </div>
                  <button onClick={() => dismissAlert(alert.id)} className="text-caption text-clay hover:text-sage">Mark read</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Sync timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
          <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-4">Emotional Synchronization</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSync" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--app-primary, #6366F1)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--app-primary, #6366F1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis hide />
                <Area type="monotone" dataKey="sync" stroke="var(--app-primary, #6366F1)" strokeWidth={2} fill="url(#gradSync)" dot={{ r: 3, fill: 'var(--app-primary, #6366F1)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Partner Dynamic */}
        {partnerDynamic && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} className="text-primary" />
              <h3 className="text-display-sm text-charcoal dark:text-cream-soft">Partner Dynamic</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-parchment dark:bg-white/5 rounded-xl">
                <span className="text-body-sm text-charcoal dark:text-cream-soft">Pattern</span>
                <span className="text-body-sm font-medium text-primary capitalize">
                  {partnerDynamic.pursuerWithdrawerPattern.replace(/_/g, ' ')}
                </span>
              </div>
              {[
                { label: 'Emotional Sync', value: partnerDynamic.emotionalSynchronization },
                { label: 'Communication', value: partnerDynamic.communicationBalance },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-caption text-clay">{s.label}</span>
                    <span className="text-caption font-medium text-charcoal dark:text-cream-soft">{s.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-clay/15 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: s.value > 70 ? '#10B981' : s.value > 40 ? 'var(--app-primary, #6366F1)' : '#A855F7' }}
                      initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weekly reports */}
        {weeklyReports.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
            <h3 className="text-label text-clay px-1">Weekly Reports</h3>
            {weeklyReports.map((report, i) => (
              <div key={i} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{report.week}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className={report.emotionalHealthScore > 75 ? 'text-sage' : 'text-amber-500'} />
                    <span className="text-body-sm font-medium" style={{ color: report.emotionalHealthScore > 75 ? '#10B981' : 'var(--app-primary, #6366F1)' }}>{report.emotionalHealthScore}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-parchment dark:bg-white/5 rounded-lg">
                    <p className="text-caption text-clay">Check-ins</p>
                    <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{report.checkInConsistency}%</p>
                  </div>
                  <div className="text-center p-2 bg-parchment dark:bg-white/5 rounded-lg">
                    <p className="text-caption text-clay">Conflicts</p>
                    <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{report.conflictCount}</p>
                  </div>
                  <div className="text-center p-2 bg-parchment dark:bg-white/5 rounded-lg">
                    <p className="text-caption text-clay">Top Mood</p>
                    <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{report.topMood}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-parchment dark:bg-white/5 rounded-lg">
                  <Zap size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-caption text-clay">{report.aiInsight}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
