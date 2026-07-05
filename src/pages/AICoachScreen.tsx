import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Brain, Sparkles, RefreshCw, BookOpen, Target } from 'lucide-react';
import { useAISystems } from '@/contexts/AISystemContext';
import type { GeneratedContentType } from '@/contexts/AISystemContext';

const categories: { type: GeneratedContentType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'conversation_starter', label: 'Conversation', icon: <BookOpen size={20} />, description: 'Deepen your dialogue' },
  { type: 'growth_challenge', label: 'Growth', icon: <Target size={20} />, description: 'Challenges to grow together' },
  { type: 'conflict_resolution', label: 'Resolution', icon: <Brain size={20} />, description: 'Navigate hard moments' },
];

export default function AICoachScreen() {
  const navigate = useNavigate();
  const { generatedContent, generateContent, toggleSaveContent, getSavedContent } = useAISystems();
  const [activeType, setActiveType] = useState<GeneratedContentType>('conversation_starter');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    generateContent(activeType);
    setLoading(false);
  };

  const savedContent = getSavedContent();
  const filteredContent = generatedContent.filter(c => c.type === activeType);

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-4 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-clay/10 transition-colors">
            <ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" />
          </button>
          <div>
            <h1 className="text-display-lg text-charcoal dark:text-cream-soft">AI Coach</h1>
            <p className="text-caption text-clay">{savedContent.length} saved</p>
          </div>
        </div>
      </header>

      <div className="px-5 pb-12">
        {/* Category tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {categories.map(c => (
            <button key={c.type} onClick={() => setActiveType(c.type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-body-sm font-medium transition-colors
                ${activeType === c.type ? 'bg-primary text-white' : 'bg-cream-soft dark:bg-white/5 text-clay'}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <p className="text-caption text-clay mt-3 mb-4">
          {categories.find(c => c.type === activeType)?.description}
        </p>

        {/* Generate button */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-white font-medium text-body mb-6">
          {loading
            ? <><RefreshCw size={18} className="animate-spin" /> Thinking...</>
            : <><Sparkles size={18} /> Generate Insight</>}
        </motion.button>

        {/* Content list */}
        <div className="space-y-3">
          {filteredContent.length === 0 && (
            <div className="text-center py-10 text-clay text-body-sm">
              Tap the button above to generate your first insight.
            </div>
          )}
          {filteredContent.map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-cream-soft dark:bg-white/5 border border-clay/10">
              <p className="text-body text-charcoal dark:text-cream-soft mb-3">{item.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-caption text-clay">{item.createdAt.toLocaleDateString()}</span>
                <button onClick={() => toggleSaveContent(item.id)}
                  className={`text-caption font-medium px-3 py-1 rounded-full transition-colors
                    ${item.saved ? 'bg-primary/10 text-primary' : 'bg-clay/10 text-clay'}`}>
                  {item.saved ? '★ Saved' : '☆ Save'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
