import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Key, ExternalLink, Check, Eye, EyeOff,
  Zap, CreditCard, AlertCircle, Sparkles,
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import {
  IMAGE_PROVIDERS, storeApiKey, getApiKey, removeApiKey,
  hasApiKey, setDefaultProvider, getDefaultProvider,
} from '@/utils/imageGenApi';
import type { ImageProvider } from '@/utils/imageGenApi';

export default function ImageGenSettingsScreen() {
  const navigate = useNavigate();
  const { getPrimaryColor } = useSettings();
  const primary = getPrimaryColor();
  const [defaultProv, setDefaultProv] = useState<ImageProvider>(getDefaultProvider());
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [keys, setKeys] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const p of IMAGE_PROVIDERS) {
      initial[p.id] = getApiKey(p.id);
    }
    return initial;
  });
  const [saved, setSaved] = useState<string | null>(null);

  const handleSaveKey = (provider: ImageProvider) => {
    const key = keys[provider]?.trim();
    if (key) {
      storeApiKey(provider, key);
    } else {
      removeApiKey(provider);
    }
    setSaved(provider);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleSetDefault = (provider: ImageProvider) => {
    setDefaultProv(provider);
    setDefaultProvider(provider);
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-4 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/settings')} className="p-2 -ml-2 rounded-full hover:bg-clay/10 transition-colors">
            <ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primary}15` }}>
              <Key size={16} style={{ color: primary }} />
            </div>
            <h1 className="text-body font-medium text-charcoal dark:text-cream-soft">Image Generation Keys</h1>
          </div>
        </div>
      </header>

      <div className="px-5 pb-12 space-y-6">
        {/* Intro */}
        <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-body-sm text-charcoal dark:text-cream-soft font-medium">Add API keys to generate real images</p>
              <p className="text-caption text-clay mt-1">
                Your API keys are encrypted and stored locally on your device. They are never sent to our servers.
                Images are generated directly by the provider you choose.
              </p>
            </div>
          </div>
        </div>

        {/* Provider cards */}
        {IMAGE_PROVIDERS.map((provider) => {
          const hasKey = hasApiKey(provider.id);
          const isDefault = defaultProv === provider.id;
          return (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 space-y-4"
            >
              {/* Provider header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primary}15` }}>
                    <Zap size={20} style={{ color: primary }} />
                  </div>
                  <div>
                    <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{provider.name}</h3>
                    <p className="text-caption text-clay">{provider.description}</p>
                  </div>
                </div>
                {hasKey && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10">
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-caption text-emerald-500 font-medium">Active</span>
                  </div>
                )}
              </div>

              {/* Cost info */}
              <div className="flex items-center gap-4 text-caption text-clay">
                <span className="flex items-center gap-1">
                  <CreditCard size={12} /> ~{provider.costPerImage}/image
                </span>
                <a
                  href={provider.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                  style={{ color: primary }}
                >
                  Get key <ExternalLink size={10} />
                </a>
              </div>

              {/* API Key input */}
              <div className="space-y-2">
                <label className="text-label text-clay">API Key</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showKey[provider.id] ? 'text' : 'password'}
                      value={keys[provider.id] || ''}
                      onChange={(e) => setKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                      placeholder={`Paste your ${provider.name} API key...`}
                      className="w-full h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 pr-10 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none"
                      style={{ outlineColor: primary }}
                    />
                    <button
                      onClick={() => setShowKey(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-clay"
                    >
                      {showKey[provider.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSaveKey(provider.id)}
                    className="h-[44px] px-4 rounded-xl text-white font-medium text-body-sm"
                    style={{ backgroundColor: primary }}
                  >
                    {saved === provider.id ? 'Saved!' : 'Save'}
                  </motion.button>
                </div>
                {keys[provider.id]?.trim() && !keys[provider.id]?.startsWith('sk-') && provider.id === 'openai' && (
                  <p className="text-caption text-amber-600 flex items-center gap-1">
                    <AlertCircle size={11} /> OpenAI keys usually start with "sk-"
                  </p>
                )}
              </div>

              {/* Set as default */}
              {hasKey && (
                <button
                  onClick={() => handleSetDefault(provider.id)}
                  className={`w-full py-2.5 rounded-xl text-body-sm font-medium transition-all ${
                    isDefault
                      ? 'text-white'
                      : 'bg-parchment dark:bg-white/5 text-clay hover:text-charcoal'
                  }`}
                  style={isDefault ? { backgroundColor: primary } : {}}
                >
                  {isDefault ? 'Default Provider' : 'Set as Default'}
                </button>
              )}
            </motion.div>
          );
        })}

        {/* Note about Midjourney */}
        <div className="flex items-start gap-3 px-2 py-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-caption text-clay">
              <strong className="text-charcoal dark:text-cream-soft">Note about Midjourney:</strong> Midjourney does not offer a public API directly. 
              To use Midjourney, you would need a third-party wrapper or Discord bot integration, which is complex and not officially supported. 
              We recommend using OpenAI DALL-E or Replicate (Flux) for the best experience.
            </p>
          </div>
        </div>

        {/* How to get keys guide */}
        <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 space-y-4">
          <h3 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">How to Get API Keys</h3>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-caption text-white flex-shrink-0" style={{ backgroundColor: primary }}>1</span>
              <p className="text-caption text-clay">Click "Get key" on any provider above to go to their signup page</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-caption text-white flex-shrink-0" style={{ backgroundColor: primary }}>2</span>
              <p className="text-caption text-clay">Create an account and add a payment method (credit card)</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-caption text-white flex-shrink-0" style={{ backgroundColor: primary }}>3</span>
              <p className="text-caption text-clay">Navigate to the API Keys section and create a new key</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-caption text-white flex-shrink-0" style={{ backgroundColor: primary }}>4</span>
              <p className="text-caption text-clay">Copy the key and paste it above, then tap "Save"</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-caption text-white flex-shrink-0" style={{ backgroundColor: primary }}>5</span>
              <p className="text-caption text-clay">Set your preferred provider as the default</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
