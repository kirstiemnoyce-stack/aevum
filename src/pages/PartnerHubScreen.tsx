import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Copy, Check, Link2, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Toast from '@/components/Toast';

const modules = [
  { icon: 'heart-pulse', label: 'Check-In', color: 'var(--app-primary, #6366F1)' },
  { icon: 'activity', label: 'History', color: '#10B981' },
  { icon: 'message-square-text', label: 'Talk', color: 'var(--app-primary, #6366F1)' },
  { icon: 'brain', label: 'Psychology', color: 'var(--app-primary, #6366F1)', route: '/profile-psych' },
  { icon: 'sparkles', label: 'Languages', color: '#A855F7' },
  { icon: 'calendar-heart', label: 'Dates', color: 'var(--app-primary, #6366F1)' },
  { icon: 'book-open', label: 'Gratitude', color: '#10B981' },
  { icon: 'target', label: 'Goals', color: 'var(--app-primary, #6366F1)' },
  { icon: 'images', label: 'Memories', color: '#A855F7' },
  { icon: 'handshake', label: 'Resolve', color: '#10B981' },
  { icon: 'sticky-note', label: 'Notes', color: 'var(--app-primary, #6366F1)' },
  { icon: 'flame', label: 'Intimacy', color: '#A855F7' },
  { icon: 'music', label: 'Music', color: 'var(--app-primary, #6366F1)' },
  { icon: 'list-checks', label: 'Bucket List', color: '#10B981' },
  { icon: 'help-circle', label: 'Quiz', color: 'var(--app-primary, #6366F1)' },
  { icon: 'trophy', label: 'Challenges', color: '#A855F7' },
];

const IconSvg = ({ name, color }: { name: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'heart-pulse': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.28" /></svg>,
    'activity': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    'message-square-text': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M13 8H7" /><path d="M17 12H7" /></svg>,
    'sparkles': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>,
    'calendar-heart': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" /><path d="M8 2v4" /><path d="M16 2v4" /><path d="M21 14.5a2.5 2.5 0 0 0-3.5-3.5 2.5 2.5 0 0 0-3.5 3.5 2.5 2.5 0 0 0 3.5 3.5 2.5 2.5 0 0 0 3.5-3.5" /></svg>,
    'book-open': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
    'target': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    'images': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 22H4a2 2 0 0 1-2-2V6" /><path d="m22 13-4.5-4.5a2.12 2.12 0 0 0-3 0L9 14" /><path d="m22 17-7.5-7.5a2.12 2.12 0 0 0-3 0L2 19" /><path d="M6 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>,
    'handshake': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 8" /><path d="m21 3 1.5 1.5a1 1 0 1 1-3 3L17 5" /><path d="m2 17 2.5 2.5a1 1 0 1 0 3-3" /><path d="M4 14 7 11a1 1 0 0 1 3 3l-2.81 2.81A5.79 5.79 0 0 1 2.13 16l-.47-.28a2 2 0 0 0-1.42-.25L0 15.5" /><path d="M5 8l3 3" /><path d="M9 8 6 5" /></svg>,
    'sticky-note': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" /><path d="M15 3v4a2 2 0 0 0 2 2h4" /></svg>,
    'flame': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>,
    'music': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>,
    'list-checks': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>,
    'help-circle': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>,
    'trophy': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
    'brain': <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.2-1.8" /><path d="M19.2 16.2a4 4 0 0 1-1.2 1.8" /></svg>,
  };
  return icons[name] || null;
};

export default function PartnerHubScreen() {
  const navigate = useNavigate();
  const { partner, setPartner } = useApp();
  const [copied, setCopied] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [enterCode, setEnterCode] = useState('');
  const [showToast, setShowToast] = useState(false);

  const inviteCode = 'HS7-K9M2';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    if (enterCode.length > 3) {
      setPartner({ id: 2, name: 'Alex', connected: true, lastCheckIn: 'Just now' });
      setShowConnectModal(false);
      setShowToast(true);
    }
  };

  const handleDisconnect = () => {
    setPartner(null);
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Us</h1>
          <div className="w-10" />
        </div>
        <p className="text-body text-clay text-center -mt-1">Your shared space</p>
      </header>

      <div className="px-5 pb-8 space-y-6">
        <div className="flex justify-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${partner?.connected ? 'bg-sage/15' : 'bg-clay/15'}`}>
            <span className={`w-2 h-2 rounded-full ${partner?.connected ? 'bg-sage' : 'bg-clay'}`} />
            <span className="text-body-sm font-medium text-charcoal dark:text-cream-soft">
              {partner?.connected ? `Connected with ${partner.name}` : 'No partner connected'}
            </span>
          </div>
        </div>

        {!partner?.connected ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-cream-soft dark:bg-white/5 rounded-2xl p-8 text-center shadow-card">
            <img src="./partner-connect.png" alt="Connect" className="w-28 h-28 object-contain mx-auto mb-5" />
            <h2 className="text-display-sm text-charcoal dark:text-cream-soft mb-2">Connect with your partner</h2>
            <p className="text-body-sm text-clay mb-6">Share this code or enter theirs to link your spaces</p>
            <button onClick={handleCopyCode}
              className="inline-flex items-center gap-3 px-6 py-3 bg-parchment dark:bg-white/5 rounded-xl mb-4">
              <span className="text-display-md text-primary tracking-widest" style={{ fontFamily: 'monospace' }}>{inviteCode}</span>
              {copied ? <Check size={18} className="text-sage" /> : <Copy size={18} className="text-clay" />}
            </button>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-clay/20" /><span className="text-caption text-clay">OR</span><div className="flex-1 h-px bg-clay/20" /></div>
            <button onClick={() => setShowConnectModal(true)} className="w-full h-[48px] rounded-full border border-clay/50 text-warm-stone dark:text-cream-soft/70 font-medium text-body-sm flex items-center justify-center gap-2">
              <Link2 size={16} /> Enter their code
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative bg-charcoal rounded-2xl p-6 overflow-hidden">
            <img src="./connection-success.jpg" alt="Connected" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl text-white font-medium">{partner.name[0]}</div>
                <div>
                  <p className="text-body-lg font-medium text-white">{partner.name}</p>
                  <p className="text-caption text-white/70">Connected</p>
                </div>
              </div>
              <button onClick={handleDisconnect} className="text-body-sm text-white/60 hover:text-white/90">Unlink partner</button>
            </div>
          </motion.div>
        )}

        <div>
          <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-4">Modules</h3>
          <div className="grid grid-cols-2 gap-3">
            {modules.map((mod: { icon: string; label: string; color: string; route?: string }, i: number) => (
              <motion.button key={mod.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.96 }} onClick={() => mod.route ? navigate(mod.route) : undefined}
                className="bg-cream-soft dark:bg-white/5 rounded-xl p-5 flex flex-col items-center gap-3 hover:shadow-card transition-shadow">
                <IconSvg name={mod.icon} color={mod.color} />
                <span className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{mod.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConnectModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConnectModal(false)} className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[320px] bg-parchment dark:bg-espresso-deep rounded-2xl p-8">
              <button onClick={() => setShowConnectModal(false)} className="absolute top-4 right-4 p-1"><X size={20} className="text-clay" /></button>
              <h3 className="text-display-sm text-charcoal dark:text-cream-soft mb-2">Enter invite code</h3>
              <p className="text-body-sm text-clay mb-6">Ask your partner for their code</p>
              <input value={enterCode} onChange={(e) => setEnterCode(e.target.value.toUpperCase())} placeholder="e.g. HS7-K9M2"
                className="w-full h-12 bg-cream-soft dark:bg-white/5 rounded-xl px-4 text-body text-center tracking-widest font-medium mb-4" maxLength={8} />
              <button onClick={handleConnect} disabled={enterCode.length < 4}
                className="w-full h-[48px] rounded-full bg-primary text-white font-medium disabled:opacity-40">Connect</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast message={partner?.connected ? 'Partner connected!' : 'Partner unlinked'} visible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
