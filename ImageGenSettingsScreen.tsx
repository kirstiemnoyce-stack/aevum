import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

export default function LoginScreen() {
  const { login } = useApp();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(./onboarding-bg.jpg)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.7) 60%, rgba(26,26,26,0.95) 100%)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center px-8 w-full max-w-sm">
        <h1 className="text-display-xl text-white text-center mb-3" style={{ fontStyle: 'italic' }}>Aevum</h1>
        <p className="text-body text-white/80 text-center mb-12">Begin your journey</p>

        <motion.button whileTap={{ scale: 0.98 }} onClick={login}
          className="w-full h-[52px] rounded-full bg-primary text-white font-medium text-body mb-4 transition-shadow hover:shadow-lg flex items-center justify-center gap-3">
          Enter App
        </motion.button>

        <p className="text-body-sm text-white/40 text-center max-w-[240px]">
          A safe space for emotional connection
        </p>
      </motion.div>
    </div>
  );
}
