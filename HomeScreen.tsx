import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Sparkles, ThumbsUp, ThumbsDown, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAISystems } from '@/contexts/AISystemContext';
import { useSettings } from '@/contexts/SettingsContext';

export default function ConversationDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getConversation } = useAISystems();
  const { getPrimaryColor } = useSettings();
  const primary = getPrimaryColor();
  const conv = getConversation(id || '');
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);

  if (!conv) {
    return (
      <div className="min-h-screen bg-parchment dark:bg-espresso-deep flex flex-col items-center justify-center px-8">
        <MessageSquare size={48} className="text-clay/30 mb-4" />
        <p className="text-body-sm text-clay">Conversation not found</p>
        <button onClick={() => navigate('/ai/conversations')} className="mt-4 px-6 py-2 rounded-full text-white text-body-sm" style={{ backgroundColor: primary }}>
          Back to Conversations
        </button>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ai/conversations')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-display-sm text-charcoal dark:text-cream-soft truncate">{conv.title}</h1>
            <p className="text-caption text-clay">{formatDate(conv.createdAt)} - {conv.messageCount} messages</p>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 space-y-6">
        {conv.messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'ai' ? (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primary}15` }}>
                  <Sparkles size={18} style={{ color: primary }} />
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="bg-cream-soft dark:bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-body text-warm-stone dark:text-cream-soft/80 leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.confidence && (
                    <div className="mt-2 px-1">
                      <button onClick={() => setExpandedReasoning(expandedReasoning === msg.id ? null : msg.id)}
                        className="flex items-center gap-2 text-caption hover:opacity-70 transition-opacity" style={{ color: primary }}>
                        <ShieldCheck size={12} />
                        <span>{msg.confidence}% confidence</span>
                        {msg.moodContext && <span className="text-clay">- {msg.moodContext}</span>}
                        {expandedReasoning === msg.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                      {expandedReasoning === msg.id && msg.reasoning && (
                        <div className="mt-2 p-3 rounded-lg bg-clay/5 dark:bg-white/5">
                          <p className="text-caption text-clay">{msg.reasoning}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className={`text-caption ${msg.feedback === 'up' ? 'text-emerald-500' : 'text-clay'}`}><ThumbsUp size={12} /></span>
                    <span className={`text-caption ${msg.feedback === 'down' ? 'text-red-500' : 'text-clay'}`}><ThumbsDown size={12} /></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[80%]">
                  <div className="rounded-2xl rounded-tr-sm px-4 py-3 text-white" style={{ backgroundColor: primary }}>
                    <p className="text-body">{msg.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
