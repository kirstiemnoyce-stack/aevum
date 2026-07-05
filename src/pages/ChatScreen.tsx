import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Leaf, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const starters = [
  { icon: '💬', title: 'Discuss today\'s check-ins', desc: 'Explore your emotions together' },
  { icon: '🌱', title: 'Explore a conversation topic', desc: 'Discover something new' },
  { icon: '💡', title: 'Get advice on a tension', desc: 'Navigate challenges together' },
  { icon: '✨', title: 'Plan something special', desc: 'Create a meaningful moment' },
];

export default function ChatScreen() {
  const navigate = useNavigate();
  const { chatMessages, addChatMessage, getAIResponse } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [chatMessages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;
    if (!text) setInput('');

    addChatMessage({ id: Date.now().toString(), role: 'user', content: messageText, timestamp: 'Just now' });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiContent = getAIResponse(messageText);
      addChatMessage({ id: (Date.now() + 1).toString(), role: 'ai', content: aiContent, timestamp: 'Just now' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep flex flex-col">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <div className="text-center">
            <h1 className="text-display-sm text-charcoal dark:text-cream-soft">Talk</h1>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <Leaf size={12} className="text-sage" />
              <span className="text-caption text-clay">Guided by Evergreen</span>
            </div>
          </div>
          <button className="p-2 -mr-2"><Settings size={24} className="text-clay" /></button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {chatMessages.length <= 1 && (
          <div className="space-y-3 py-4">
            <p className="text-body-sm text-clay text-center mb-4">How can I help you today?</p>
            {starters.map((s) => (
              <motion.button key={s.title} whileTap={{ scale: 0.98 }} onClick={() => handleSend(s.title)}
                className="w-full bg-cream-soft dark:bg-white/5 rounded-xl p-4 text-left flex items-start gap-4 hover:shadow-card transition-shadow">
                <span className="text-2xl">{s.icon}</span>
                <div><p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{s.title}</p><p className="text-caption text-clay mt-0.5">{s.desc}</p></div>
              </motion.button>
            ))}
          </div>
        )}

        {chatMessages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'ai' ? (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center mt-1">
                  <img src="./ai-avatar.png" alt="Aevum" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className="bg-cream-soft dark:bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-body text-warm-stone dark:text-cream-soft/80">{msg.content}</p>
                  </div>
                  <p className="text-caption text-clay mt-1 ml-1">Evergreen</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[80%]">
                  <div className="bg-primary rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-body text-white">{msg.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                <img src="./ai-avatar.png" alt="Aevum" className="w-6 h-6 object-contain" />
              </div>
              <div className="bg-cream-soft dark:bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-4 py-3 safe-bottom">
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-xl border border-clay/20 px-4 py-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..." className="flex-1 bg-transparent text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSend()} disabled={!input.trim()}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center disabled:opacity-40">
            <Send size={14} className="text-white ml-0.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
