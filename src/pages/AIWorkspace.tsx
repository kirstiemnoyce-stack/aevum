import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle, BarChart3, FileEdit, PenTool,
  Image, Video, FileSearch, FileText,
  Music, CheckCircle, RefreshCw, HeartHandshake,
  Clock, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { useAIWorkspace, WIDGETS } from '@/contexts/AIWorkspaceContext';
import type { AIWidgetId } from '@/contexts/AIWorkspaceContext';

const iconMap: Record<string, React.ReactNode> = {
  'message-circle': <MessageCircle size={22} />,
  'bar-chart-3': <BarChart3 size={22} />,
  'file-edit': <FileEdit size={22} />,
  'pen-tool': <PenTool size={22} />,
  'image': <Image size={22} />,
  'video': <Video size={22} />,
  'file-search': <FileSearch size={22} />,
  'file-text': <FileText size={22} />,
  'music': <Music size={22} />,
  'check-circle': <CheckCircle size={22} />,
  'refresh-cw': <RefreshCw size={22} />,
  'heart-handshake': <HeartHandshake size={22} />,
};

export default function AIWorkspace() {
  const navigate = useNavigate();
  const { createSession, savedChats } = useAIWorkspace();

  const handleWidgetTap = (widgetId: AIWidgetId) => {
    const sessionId = createSession(widgetId);
    navigate(`/ai/chat/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-4 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-clay/10 transition-colors">
            <ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" />
          </button>
          <div>
            <h1 className="text-display-lg text-charcoal dark:text-cream-soft">AI Workspace</h1>
            <p className="text-body-sm text-clay mt-0.5">Choose a tool to get started</p>
          </div>
        </div>
      </header>

      <div className="px-5 pb-8 space-y-6">
        {/* Recent sessions */}
        {savedChats.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-label text-clay">Recent</h3>
              <button onClick={() => navigate('/ai/conversations')} className="text-caption text-primary flex items-center gap-1">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
              {savedChats.slice(0, 6).map((chat, i) => {
                const widget = WIDGETS.find(w => w.id === chat.widgetId);
                return (
                  <motion.button key={chat.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/ai/chat/${chat.id}`)}
                    className="snap-start flex-shrink-0 w-40 bg-cream-soft dark:bg-white/5 rounded-2xl p-4 shadow-card text-left hover:shadow-card-hover transition-shadow">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${widget?.color}15` }}>
                      <span style={{ color: widget?.color }}>{widget && iconMap[widget.icon]}</span>
                    </div>
                    <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft truncate">{chat.title}</p>
                    <p className="text-caption text-clay flex items-center gap-1 mt-1"><Clock size={10} />{new Date(chat.updatedAt).toLocaleDateString()}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Widget grid */}
        <div>
          <h3 className="text-label text-clay mb-3">Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {WIDGETS.map((widget, i) => (
              <motion.button key={widget.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleWidgetTap(widget.id)}
                className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all text-left"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${widget.color}15` }}>
                  <span style={{ color: widget.color }}>{iconMap[widget.icon]}</span>
                </div>
                <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{widget.label}</p>
                <p className="text-caption text-clay mt-0.5 line-clamp-2">{widget.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
