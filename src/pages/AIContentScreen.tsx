import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Heart, MessageCircle, CalendarDays, Gift,
  Sparkles, Bookmark, BookmarkCheck, X,
} from 'lucide-react';
import { useAISystems } from '@/contexts/AISystemContext';
import type { GeneratedContent } from '@/contexts/AISystemContext';

const categories = [
  { id: 'date_idea' as const, label: 'Date Ideas', icon: <Heart size={18} />, color: 'var(--app-primary, #6366F1)', description: 'Novel experiences to deepen connection' },
  { id: 'conversation_starter' as const, label: 'Conversation Starters', icon: <MessageCircle size={18} />, color: '#10B981', description: 'Meaningful dialogue prompts' },
  { id: 'checkin_prompt' as const, label: 'Check-In Prompts', icon: <CalendarDays size={18} />, color: '#A855F7', description: 'Daily emotional connection questions' },
  { id: 'activity' as const, label: 'Activities', icon: <Sparkles size={18} />, color: '#64748B', description: 'Shared practices and exercises' },
  { id: 'love_letter' as const, label: 'Love Letters', icon: <Gift size={18} />, color: '#64748B', description: 'Guided appreciation writing' },
];

export default function AIContentScreen() {
  const navigate = useNavigate();
  const { generatedContent, generateContent, toggleSaveContent, getSavedContent } = useAISystems();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const filtered = activeCategory
    ? generatedContent.filter(c => c.type === activeCategory)
    : generatedContent;

  const saved = getSavedContent();

  const handleGenerate = (type: GeneratedContent['type']) => {
    generateContent(type);
    setActiveCategory(type);
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/ai-hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Generator</h1>
          <button onClick={() => setShowSaved(true)} className="p-2 -mr-2 relative">
            <Bookmark size={22} className="text-clay" />
            {saved.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border border-parchment dark:border-espresso-deep" />}
          </button>
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Saved drawer */}
        <AnimatePresence>
          {showSaved && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSaved(false)} className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm" />
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-parchment dark:bg-espresso-deep rounded-t-2xl max-h-[80%] overflow-y-auto">
                <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 rounded-full bg-clay/40" /></div>
                <div className="px-6 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-display-sm text-charcoal dark:text-cream-soft">Saved ({saved.length})</h3>
                    <button onClick={() => setShowSaved(false)}><X size={20} className="text-clay" /></button>
                  </div>
                  {saved.length === 0 ? (
                    <p className="text-body-sm text-clay text-center py-8">No saved items yet</p>
                  ) : (
                    <div className="space-y-3">
                      {saved.map(item => (
                        <div key={item.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5">
                          <p className="text-caption font-medium text-charcoal dark:text-cream-soft mb-1">{item.title}</p>
                          <p className="text-caption text-clay">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenerate(cat.id)}
              className="text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-body font-medium text-charcoal dark:text-cream-soft">{cat.label}</p>
                  <p className="text-caption text-clay">{cat.description}</p>
                </div>
                <Sparkles size={18} className="text-clay/40" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Generated content */}
        {filtered.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-label text-clay">
                {activeCategory ? categories.find(c => c.id === activeCategory)?.label : 'All Generated'}
              </h3>
              {activeCategory && (
                <button onClick={() => handleGenerate(activeCategory as GeneratedContent['type'])}
                  className="text-body-sm text-primary">Generate More</button>
              )}
            </div>
            {filtered.slice(0, 6).map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{item.title}</h4>
                  <button onClick={() => toggleSaveContent(item.id)}>
                    {item.saved ? <BookmarkCheck size={18} className="text-primary" /> : <Bookmark size={18} className="text-clay" />}
                  </button>
                </div>
                <p className="text-caption text-warm-stone dark:text-cream-soft/70 mt-2 leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
