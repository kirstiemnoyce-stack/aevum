import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, StickyNote, BookOpen, CheckCircle2, Plus, X, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function NotesScreen() {
  const navigate = useNavigate();
  const { notes, readingList, habits, toggleHabit, addNote, deleteNote } = useApp();
  const [tab, setTab] = useState<'notes' | 'reading' | 'habits'>('notes');
  const [showNewNote, setShowNewNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;
    addNote({ id: Date.now().toString(), title: noteTitle.trim(), content: noteContent.trim(), tags: noteTags.split(',').map(t => t.trim()).filter(Boolean), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setNoteTitle(''); setNoteContent(''); setNoteTags(''); setShowNewNote(false);
  };

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Notes</h1>
          <button onClick={() => setShowNewNote(true)} className="p-2 -mr-2"><Plus size={24} className="text-primary" /></button>
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[{ id: 'notes' as const, label: 'Notes', icon: <StickyNote size={16} /> }, { id: 'reading' as const, label: 'Reading', icon: <BookOpen size={16} /> }, { id: 'habits' as const, label: 'Habits', icon: <CheckCircle2 size={16} /> }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'bg-primary text-white' : 'bg-cream-soft dark:bg-white/5 text-clay'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* New Note Modal */}
        <AnimatePresence>
          {showNewNote && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewNote(false)} className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm" />
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-parchment dark:bg-espresso-deep rounded-t-2xl max-h-[85%] overflow-y-auto">
                <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 rounded-full bg-clay/40" /></div>
                <div className="px-6 pb-8 space-y-4">
                  <div className="flex items-center justify-between"><h3 className="text-display-sm text-charcoal dark:text-cream-soft">New Note</h3><button onClick={() => setShowNewNote(false)}><X size={20} className="text-clay" /></button></div>
                  <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Title" autoFocus
                    className="w-full h-[48px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none focus:border-primary" />
                  <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Write your thoughts..."
                    className="w-full h-[150px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 p-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none focus:border-primary resize-none" />
                  <input value={noteTags} onChange={e => setNoteTags(e.target.value)} placeholder="Tags (comma separated)"
                    className="w-full h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
                  <button onClick={handleSaveNote} disabled={!noteTitle.trim()}
                    className="w-full h-[48px] rounded-full bg-primary text-white font-medium text-body disabled:opacity-40">Save Note</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {tab === 'notes' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {notes.length === 0 && <p className="text-body-sm text-clay text-center py-8">No notes yet. Tap + to create one.</p>}
            {notes.map(n => (
              <div key={n.id} className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card">
                <div className="flex items-start justify-between">
                  <h4 className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{n.title}</h4>
                  <button onClick={() => deleteNote(n.id)} className="p-1"><Trash2 size={14} className="text-clay" /></button>
                </div>
                <p className="text-caption text-warm-stone dark:text-cream-soft/70 mt-2 whitespace-pre-line">{n.content}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {n.tags.map(t => <span key={t} className="text-caption px-2 py-0.5 rounded-full bg-parchment dark:bg-white/5 text-clay">{t}</span>)}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'reading' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {['want_to_read', 'reading', 'completed'].map(status => (
              <div key={status}>
                <p className="text-label text-clay mb-2 capitalize">{status.replace(/_/g, ' ')}</p>
                {readingList.filter(r => r.status === status).map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5 mb-2">
                    <p className="text-body-sm text-charcoal dark:text-cream-soft">{r.title}</p>
                    <p className="text-caption text-clay">{r.author}</p>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'habits' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {habits.map(h => (
              <button key={h.id} onClick={() => toggleHabit(h.id)}
                className="w-full text-left bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.completedToday ? 'bg-sage/20' : 'bg-clay/10'}`}>
                  {h.completedToday ? <CheckCircle2 size={20} className="text-sage" /> : <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: h.color }} />}
                </div>
                <div className="flex-1">
                  <p className={`text-body-sm font-medium ${h.completedToday ? 'text-charcoal/50 dark:text-cream-soft/50 line-through' : 'text-charcoal dark:text-cream-soft'}`}>{h.name}</p>
                  <p className="text-caption text-clay">{h.streak} day streak</p>
                </div>
                <div className="w-16 h-1 bg-clay/15 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, h.streak * 5)}%`, backgroundColor: h.color }} />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
