import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Flame, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const rhythmData = [
  { day: 'Mon', you: 3, partner: 2 },
  { day: 'Tue', you: 4, partner: 3 },
  { day: 'Wed', you: 2, partner: 4 },
  { day: 'Thu', you: 5, partner: 3 },
  { day: 'Fri', you: 4, partner: 5 },
  { day: 'Sat', you: 3, partner: 2 },
  { day: 'Sun', you: 4, partner: 4 },
];

const moodData = [
  { mood: 'Happy', count: 12, color: '#10B981' },
  { mood: 'Calm', count: 8, color: '#64748B' },
  { mood: 'Grateful', count: 15, color: 'var(--app-primary, #6366F1)' },
  { mood: 'Anxious', count: 5, color: '#A855F7' },
  { mood: 'Frustrated', count: 3, color: '#334155' },
  { mood: 'Sad', count: 4, color: '#64748B' },
];

export default function InsightsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Insights</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
          <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-6">Your Emotional Rhythm</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rhythmData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradYou" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--app-primary, #6366F1)" stopOpacity={0.15} /><stop offset="95%" stopColor="var(--app-primary, #6366F1)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gradPartner" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#A855F7" stopOpacity={0.15} /><stop offset="95%" stopColor="#A855F7" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} domain={[-5, 5]} />
                <Area type="monotone" dataKey="you" stroke="var(--app-primary, #6366F1)" strokeWidth={2} fill="url(#gradYou)" dot={{ r: 4, fill: 'var(--app-primary, #6366F1)', stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="partner" stroke="#A855F7" strokeWidth={2} fill="url(#gradPartner)" dot={{ r: 4, fill: '#A855F7', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-primary rounded-full" /><span className="text-caption text-clay">You</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-rose-dusty rounded-full" /><span className="text-caption text-clay">Partner</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-charcoal rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3"><Flame size={24} className="text-primary" /><h3 className="text-display-sm text-white">5 day streak</h3></div>
          <p className="text-body-sm text-white/70 mb-4">You and Alex have checked in 5 days in a row</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => <div key={d} className={`flex-1 h-2 rounded-full ${d <= 5 ? 'bg-sage' : 'bg-white/15'}`} />)}
          </div>
          <p className="text-caption text-white/50 mt-2">2 more days for a perfect week!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
          <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-4">This Week&apos;s Moods</h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="mood" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis hide />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {moodData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-charcoal rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 5 18 2 18 2s.5 4.5-2 7c-2.5 2.5-5 4-5 4" /><path d="M15 13.5a3 3 0 0 0-2.5-4" /><path d="M9 17.5c1-1 2-3.5 2-3.5" /></svg>
            <span className="text-caption text-sage">Evergreen Insight</span>
          </div>
          <p className="text-body-lg text-white italic leading-relaxed" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            &ldquo;You both tend to feel most connected on Friday evenings. Consider making that your dedicated check-in time.&rdquo;
          </p>
          <button className="text-body-sm text-primary mt-4 hover:opacity-80 transition-opacity">Learn more →</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card flex flex-col items-center">
          <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-4">Communication Health</h3>
          <div className="relative w-[120px] h-[120px]">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#64748B" strokeWidth="4" opacity="0.2" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--app-primary, #6366F1)" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52 * 0.87} ${2 * Math.PI * 52 * 0.13}`}
                strokeDashoffset={2 * Math.PI * 52 * 0.25} transform="rotate(-90 60 60)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-display-md text-charcoal dark:text-cream-soft">87</span>
            </div>
          </div>
          <p className="text-caption text-clay mt-3">Great communication this week</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={24} className="text-sage" />
            <h3 className="text-display-sm text-charcoal dark:text-cream-soft">Trending Up</h3>
          </div>
          <p className="text-body text-warm-stone dark:text-cream-soft/70">
            Your &ldquo;Grateful&rdquo; check-ins have increased by 40% this month. Keep nurturing that appreciation!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
