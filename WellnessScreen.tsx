import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plug, HeartPulse, Activity, Calendar, Music, DollarSign, CheckSquare, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const iconMap: Record<string, React.ReactNode> = {
  'heart-pulse': <HeartPulse size={20} />, 'activity': <Activity size={20} />, 'calendar': <Calendar size={20} />,
  'music': <Music size={20} />, 'dollar-sign': <DollarSign size={20} />, 'check-square': <CheckSquare size={20} />,
};

const catColors: Record<string, string> = { Health: 'var(--app-primary, #6366F1)', Fitness: '#10B981', Productivity: '#A855F7', Entertainment: '#64748B', Finance: '#64748B' };

export default function ConnectorsScreen() {
  const navigate = useNavigate();
  const { connectors, toggleConnector } = useApp();
  const connected = connectors.filter(c => c.connected);
  const available = connectors.filter(c => !c.connected);

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Connectors</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Plug size={20} className="text-primary" />
            <p className="text-body-sm font-medium text-white">Integrations</p>
          </div>
          <p className="text-display-md text-white">{connected.length} <span className="text-body text-white/50">/ {connectors.length} connected</span></p>
        </motion.div>

        {/* Connected */}
        {connected.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h3 className="text-label text-clay px-1">Connected</h3>
            {connected.map(c => (
              <div key={c.id} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${catColors[c.category]}15` }}>
                    <span style={{ color: catColors[c.category] }}>{iconMap[c.icon] || <Plug size={20} />}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-body font-medium text-charcoal dark:text-cream-soft">{c.name}</p>
                    <div className="flex items-center gap-2">
                      <Wifi size={12} className="text-sage" />
                      <span className="text-caption text-sage">Connected</span>
                      {c.lastSync && <span className="text-caption text-clay">- {c.lastSync}</span>}
                    </div>
                  </div>
                  <button onClick={() => toggleConnector(c.id)}
                    className="px-4 py-2 rounded-full border border-red-300 text-red-500 text-caption hover:bg-red-50 transition-colors">Disconnect</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Available */}
        {available.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h3 className="text-label text-clay px-1">Available</h3>
            {available.map(c => (
              <div key={c.id} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card opacity-70">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${catColors[c.category] || '#64748B'}15` }}>
                    <span style={{ color: catColors[c.category] || '#64748B' }}>{iconMap[c.icon] || <Plug size={20} />}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-body font-medium text-charcoal dark:text-cream-soft">{c.name}</p>
                    <div className="flex items-center gap-2">
                      <WifiOff size={12} className="text-clay" />
                      <span className="text-caption text-clay">{c.category}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleConnector(c.id)}
                    className="px-4 py-2 rounded-full bg-primary text-white text-caption hover:opacity-90 transition-opacity">Connect</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
