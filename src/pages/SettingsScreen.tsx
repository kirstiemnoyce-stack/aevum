import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Palette, Type, Brain, Globe, Bell, Volume2, Smartphone,
  MessageSquare, RotateCcw, Check, ChevronRight, Image, Shield, FileText,
  Zap,
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import type { ThemeColor, FontSize, AIPersonality } from '@/contexts/SettingsContext';
import { trpc } from '@/providers/trpc';
import { requestNotificationPermission, subscribeToPush, unsubscribeFromPush, isPushSupported } from '@/utils/pushNotifications';

const themeOptions: { id: ThemeColor; label: string; color: string }[] = [
  { id: 'indigo', label: 'Indigo', color: '#6366F1' },
  { id: 'violet', label: 'Violet', color: '#A855F7' },
  { id: 'emerald', label: 'Emerald', color: '#10B981' },
  { id: 'rose', label: 'Rose', color: '#F43F5E' },
  { id: 'amber', label: 'Amber', color: '#F59E0B' },
];

const fontOptions: { id: FontSize; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
];

const personalityOptions: { id: AIPersonality; label: string; desc: string }[] = [
  { id: 'warm', label: 'Warm & Gentle', desc: 'Soft, nurturing, emotionally attuned' },
  { id: 'direct', label: 'Direct & Clear', desc: 'Straightforward, concise, no fluff' },
  { id: 'playful', label: 'Playful & Light', desc: 'Fun, casual, uses humour' },
];

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { settings, updateSetting, resetSettings, getPrimaryColor } = useSettings();
  const primary = getPrimaryColor();

  // Push notification state
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  // Credits from backend
  const { data: credits } = trpc.status.credits.useQuery(undefined, { refetchInterval: 30000 });
  const pushSubMut = trpc.push.subscribe.useMutation();
  const pushUnsubMut = trpc.push.unsubscribe.useMutation();
  const pushTestMut = trpc.push.sendTest.useMutation();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setPushEnabled(!!sub);
      });
    });
  }, []);

  const togglePush = async () => {
    setPushLoading(true);
    try {
      if (pushEnabled) {
        await unsubscribeFromPush();
        setPushEnabled(false);
      } else {
        const perm = await requestNotificationPermission();
        if (perm === "granted") {
          const sub = await subscribeToPush();
          if (sub) {
            await pushSubMut.mutateAsync({ subscription: sub.toJSON() as any });
            setPushEnabled(true);
          }
        }
      }
    } catch (e) {
      console.error("Push toggle error:", e);
    }
    setPushLoading(false);
  };

  const sendTestNotification = () => {
    pushTestMut.mutate();
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Settings</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 pb-8 space-y-6">
        {/* Theme Colour */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Palette size={18} style={{ color: primary }} />
            <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Theme Colour</h3>
          </div>
          <div className="flex gap-3">
            {themeOptions.map(t => (
              <button key={t.id} onClick={() => updateSetting('themeColor', t.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${settings.themeColor === t.id ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                style={{ backgroundColor: t.color, outline: settings.themeColor === t.id ? `3px solid ${t.color}` : 'none', outlineOffset: '3px' }}>
                {settings.themeColor === t.id && <Check size={18} className="text-white" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Font Size */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Type size={18} style={{ color: primary }} />
            <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Font Size</h3>
          </div>
          <div className="flex gap-2">
            {fontOptions.map(f => (
              <button key={f.id} onClick={() => updateSetting('fontSize', f.id)}
                className={`flex-1 py-3 rounded-xl text-body-sm font-medium transition-colors ${settings.fontSize === f.id ? 'text-white' : 'bg-parchment dark:bg-white/5 text-clay'}`}
                style={settings.fontSize === f.id ? { backgroundColor: primary } : undefined}>
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI Personality */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Brain size={18} style={{ color: primary }} />
            <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Aevum Personality</h3>
          </div>
          <div className="space-y-2">
            {personalityOptions.map(p => (
              <button key={p.id} onClick={() => updateSetting('aiPersonality', p.id)}
                className={`w-full text-left p-4 rounded-xl transition-colors ${settings.aiPersonality === p.id ? 'text-white' : 'bg-parchment dark:bg-white/5'}`}
                style={settings.aiPersonality === p.id ? { backgroundColor: primary } : undefined}>
                <p className="text-body-sm font-medium">{p.label}</p>
                <p className={`text-caption ${settings.aiPersonality === p.id ? 'text-white/70' : 'text-clay'}`}>{p.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={18} style={{ color: primary }} />
            <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Language</h3>
          </div>
          <button onClick={() => updateSetting('language', settings.language === 'en-AU' ? 'en-US' : 'en-AU')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-parchment dark:bg-white/5">
            <span className="text-body-sm text-charcoal dark:text-cream-soft">{settings.language === 'en-AU' ? 'English (Australian)' : 'English (US)'}</span>
            <ChevronRight size={16} className="text-clay" />
          </button>
        </motion.div>

        {/* Toggles */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card space-y-4">
          <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft mb-2">Preferences</h3>
          {[
            { key: 'notifications' as const, label: 'Notifications', icon: <Bell size={18} /> },
            { key: 'soundEffects' as const, label: 'Sound Effects', icon: <Volume2 size={18} /> },
            { key: 'hapticFeedback' as const, label: 'Haptic Feedback', icon: <Smartphone size={18} /> },
            { key: 'autoSaveConversations' as const, label: 'Auto-Save Conversations', icon: <MessageSquare size={18} /> },
            { key: 'darkMode' as const, label: 'Dark Mode', icon: <Palette size={18} /> },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span style={{ color: primary }}>{item.icon}</span>
                <span className="text-body-sm text-charcoal dark:text-cream-soft">{item.label}</span>
              </div>
              <button onClick={() => updateSetting(item.key, !settings[item.key])}
                className={`w-12 h-7 rounded-full transition-colors ${settings[item.key] ? '' : 'bg-clay/20'}`}
                style={settings[item.key] ? { backgroundColor: primary } : undefined}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </motion.div>

        {/* Push Notifications */}
        {isPushSupported() && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} style={{ color: primary }} />
                <div className="text-left">
                  <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Push Notifications</p>
                  <p className="text-caption text-clay">Daily mood reminders and partner alerts</p>
                </div>
              </div>
              <button
                onClick={togglePush}
                disabled={pushLoading}
                className={`w-12 h-7 rounded-full transition-colors ${pushEnabled ? '' : 'bg-clay/20'}`}
                style={pushEnabled ? { backgroundColor: primary } : {}}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {pushEnabled && (
              <button
                onClick={sendTestNotification}
                className="text-caption px-3 py-1.5 rounded-lg bg-parchment dark:bg-white/5 text-clay hover:text-charcoal transition-colors"
              >
                Send test notification
              </button>
            )}
          </motion.div>
        )}

        {/* Daily Credits */}
        {credits && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.225 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <Zap size={18} style={{ color: primary }} />
              <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Daily Credits</h3>
            </div>
            <div className="space-y-2">
              {Object.values(credits).map((c: any) => (
                <div key={c.label} className="flex items-center justify-between">
                  <span className="text-caption text-clay">{c.label}</span>
                  <span className={`text-caption font-medium ${c.remaining <= 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {c.remaining} / {c.limit} left
                  </span>
                </div>
              ))}
            </div>
            <p className="text-caption text-clay">Resets every 10 minutes during development.</p>
          </motion.div>
        )}

        {/* Image Generation API Keys */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
          <button onClick={() => navigate('/settings/image-keys')}
            className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image size={18} style={{ color: primary }} />
              <div className="text-left">
                <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Image Generation Keys</p>
                <p className="text-caption text-clay">Add API keys for DALL-E, Stability, Replicate</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-clay" />
          </button>
        </motion.div>

        {/* Legal */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft mb-1">Legal</h3>
          <button onClick={() => navigate('/privacy')}
            className="w-full flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Shield size={18} style={{ color: primary }} />
              <span className="text-body-sm text-charcoal dark:text-cream-soft">Privacy Policy</span>
            </div>
            <ChevronRight size={16} className="text-clay" />
          </button>
          <div className="border-t border-clay/10" />
          <button onClick={() => navigate('/terms')}
            className="w-full flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <FileText size={18} style={{ color: primary }} />
              <span className="text-body-sm text-charcoal dark:text-cream-soft">Terms of Service</span>
            </div>
            <ChevronRight size={16} className="text-clay" />
          </button>
        </motion.div>

        {/* Reset */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <button onClick={resetSettings}
            className="w-full flex items-center justify-center gap-2 py-4 text-body text-clay hover:text-red-500 transition-colors">
            <RotateCcw size={16} /> Reset All Settings
          </button>
        </motion.div>
      </div>
    </div>
  );
}
