import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CalendarDays, Users, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarScreen() {
  const navigate = useNavigate();
  const { calendarEvents, contacts, addEvent } = useApp();
  const [tab, setTab] = useState<'calendar' | 'contacts'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventCat, setEventCat] = useState('Personal');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthEvents = calendarEvents.filter(e => e.date.startsWith(monthKey));

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/hub')} className="p-2 -ml-2"><ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" /></button>
          <h1 className="text-display-lg text-charcoal dark:text-cream-soft">Calendar</h1>
          <button onClick={() => setShowNewEvent(true)} className="p-2 -mr-2"><Plus size={24} className="text-primary" /></button>
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        <div className="flex gap-2">
          {[{ id: 'calendar' as const, label: 'Calendar', icon: <CalendarDays size={16} /> }, { id: 'contacts' as const, label: 'Contacts', icon: <Users size={16} /> }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${tab === t.id ? 'bg-primary text-white' : 'bg-cream-soft dark:bg-white/5 text-clay'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'calendar' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Month header */}
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="text-body text-clay">&lsaquo;</button>
              <p className="text-body font-medium text-charcoal dark:text-cream-soft">{monthNames[month]} {year}</p>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="text-body text-clay">&rsaquo;</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(d => <div key={d} className="text-center text-caption text-clay py-2">{d}</div>)}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (!day) return <div key={i} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasEvent = monthEvents.some(e => e.date === dateStr);
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                return (
                  <button key={i} onClick={() => { setEventDate(dateStr); setShowNewEvent(true); }}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
                      isToday ? 'bg-primary text-white' : 'bg-cream-soft dark:bg-white/5'
                    } ${hasEvent && !isToday ? 'ring-1 ring-sage' : ''}`}>
                    <span className={`text-body-sm ${isToday ? 'text-white' : 'text-charcoal dark:text-cream-soft'}`}>{day}</span>
                    {hasEvent && <span className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-sage'}`} />}
                  </button>
                );
              })}
            </div>

            {/* Events list */}
            {monthEvents.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="text-label text-clay">Events this month</h3>
                {monthEvents.map(e => (
                  <div key={e.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{e.title}</p>
                      <p className="text-caption text-clay">{e.date} at {e.time}</p>
                    </div>
                    <span className="text-caption px-2 py-0.5 rounded-full bg-parchment dark:bg-white/5 text-clay">{e.category}</span>
                  </div>
                ))}
              </div>
            )}

            {showNewEvent && (
              <div className="bg-cream-soft dark:bg-white/5 rounded-2xl p-5 shadow-card space-y-3">
                <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">Add Event</p>
                <input value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="Event title"
                  className="w-full h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft placeholder:text-clay/50 focus:outline-none" />
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                  className="w-full h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft" />
                <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)}
                  className="w-full h-[44px] rounded-xl border border-clay/20 bg-white dark:bg-white/5 px-4 text-body text-charcoal dark:text-cream-soft" />
                <div className="flex gap-2">
                  {['Personal', 'Work', 'Relationship', 'Health'].map(c => (
                    <button key={c} onClick={() => setEventCat(c)}
                      className={`px-3 py-1.5 rounded-full text-caption ${eventCat === c ? 'bg-primary text-white' : 'bg-parchment dark:bg-white/5 text-clay'}`}>{c}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowNewEvent(false)} className="flex-1 h-[40px] rounded-full border border-clay/30 text-clay text-body-sm">Cancel</button>
                  <button onClick={() => { if (eventTitle && eventDate) { addEvent({ id: Date.now().toString(), title: eventTitle, date: eventDate, time: eventTime || '09:00', category: eventCat }); setEventTitle(''); setShowNewEvent(false); }}}
                    className="flex-1 h-[40px] rounded-full bg-primary text-white font-medium text-body-sm">Save</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {tab === 'contacts' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {contacts.length === 0 && <p className="text-body-sm text-clay text-center py-8">No contacts yet.</p>}
            {contacts.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-cream-soft dark:bg-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-clay/10 flex items-center justify-center text-body-sm font-medium text-charcoal dark:text-cream-soft">{c.name[0]}</div>
                <div>
                  <p className="text-body-sm font-medium text-charcoal dark:text-cream-soft">{c.name}</p>
                  <p className="text-caption text-clay">{c.relation}{c.birthday ? ` - Birthday: ${c.birthday}` : ''}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
