import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MessageSquare, Clock, Trash2, Search, X } from 'lucide-react';
import { useAISystems } from '@/contexts/AISystemContext';
import { useSettings } from '@/contexts/SettingsContext';

export default function ConversationsScreen() {
  const navigate = useNavigate();
  const { conversations, deleteConversation } = useAISystems();
  const { getPrimaryColor } = useSettings();
  const primary = getPrimaryColor();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = search.trim()
    ? conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase())))
    : conversations;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('/ai-hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Conversations</h1>
          <div className="w-10" />
        </div>
        <div className="flex items-center gap-2 bg-cream-soft dark:bg-white/5 rounded-xl px-4 py-2">
          <Search size={16} className="text-clay" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
            className="flex-1 bg-transparent text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
          {search && <button onClick={() => setSearch('')}><X size={16} className="text-clay" /></button>}
        </div>
      </header>

      <div className="px-5 pb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare size={48} className="text-clay/30 mx-auto mb-4" />
            <p className="text-body-sm text-clay">{search ? 'No matching conversations' : 'No saved conversations yet'}</p>
            {!search && <p className="text-caption text-clay/60 mt-1">Chat with Aevum and save your conversations here</p>}
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {filtered.map((conv, i) => (
              <motion.div key={conv.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primary}15` }}>
                    <MessageSquare size={18} style={{ color: primary }} />
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => navigate(`/ai/conversations/${conv.id}`)}>
                    <h3 className="text-body font-medium text-charcoal dark:text-cream-soft truncate">{conv.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-caption text-clay flex items-center gap-1"><Clock size={12} />{formatDate(conv.createdAt)}</span>
                      <span className="text-caption text-clay">{conv.messageCount} messages</span>
                    </div>
                    {conv.messages.length > 0 && (
                      <p className="text-caption text-clay/70 mt-2 line-clamp-2">{conv.messages[conv.messages.length - 1]?.content}</p>
                    )}
                  </div>
                  <button onClick={() => setDeletingId(deletingId === conv.id ? null : conv.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 size={16} className="text-clay hover:text-red-500" />
                  </button>
                </div>

                <AnimatePresence>
                  {deletingId === conv.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="flex gap-2 mt-3 pt-3 border-t border-clay/10">
                        <button onClick={() => { deleteConversation(conv.id); setDeletingId(null); }}
                          className="flex-1 py-2 rounded-xl bg-red-500 text-white text-body-sm font-medium">Delete</button>
                        <button onClick={() => setDeletingId(null)}
                          className="flex-1 py-2 rounded-xl border border-clay/20 text-clay text-body-sm">Cancel</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
