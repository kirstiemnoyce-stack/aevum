import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// ── Core Types ──
export interface PartnerInfo { id: number; name: string; connected: boolean; lastCheckIn?: string; }
export interface ChatMessage { id: string; role: 'user' | 'ai'; content: string; timestamp: string; }
export interface CheckIn { id: string; mood: string; intensity: string; note: string; shared: boolean; createdAt: string; }
export interface UserProfile { name: string; email: string; }
export interface QuizResult { quizId: string; quizName: string; completedAt: string; scores: Record<string, number>; primaryResult: string; secondaryResult?: string; summary: string; details: Record<string, string>; }

// ── Kairos: Mind & Wellness ──
export interface MoodEntry { id: string; mood: string; intensity: number; note: string; date: string; }
export interface EnergyEntry { id: string; level: number; time: string; date: string; }
export interface SleepEntry { id: string; duration: number; quality: number; date: string; }
export interface GratitudeEntry { id: string; text: string; date: string; }
export interface MeditationEntry { id: string; duration: number; date: string; }

// ── Kairos: Physical Health ──
export interface WorkoutEntry { id: string; type: string; duration: number; intensity: string; date: string; }
export interface WaterEntry { id: string; glasses: number; date: string; }
export interface BodyMetric { id: string; weight?: number; bmi?: number; date: string; }

// ── Kairos: Work & Productivity ──
export interface Task { id: string; title: string; priority: 'high' | 'medium' | 'low'; completed: boolean; project?: string; dueDate?: string; }
export interface PomodoroSession { id: string; minutes: number; date: string; }
export interface WorkLog { id: string; hours: number; description: string; date: string; }

// ── Kairos: Finance ──
export interface IncomeEntry { id: string; source: string; amount: number; date: string; }
export interface ExpenseEntry { id: string; category: string; amount: number; date: string; }
export interface BillReminder { id: string; name: string; amount: number; dueDate: string; paid: boolean; }

// ── Kairos: Notes & Knowledge ──
export interface Note { id: string; title: string; content: string; tags: string[]; createdAt: string; updatedAt: string; }
export interface ReadingItem { id: string; title: string; author: string; status: 'want_to_read' | 'reading' | 'completed'; rating?: number; }
export interface Habit { id: string; name: string; streak: number; completedToday: boolean; color: string; }

// ── Kairos: Calendar & Social ──
export interface CalendarEvent { id: string; title: string; date: string; time: string; category: string; }
export interface Contact { id: string; name: string; birthday?: string; relation: string; }

// ── Kairos: Connectors ──
export interface Connector { id: string; name: string; category: string; icon: string; connected: boolean; lastSync?: string; }

function ls<T>(key: string, fallback: T): T { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; } }

interface AppState {
  user: UserProfile | null;
  partner: PartnerInfo | null;
  checkIns: CheckIn[];
  chatMessages: ChatMessage[];
  unreadNotifications: number;
  darkMode: boolean;
  quizResults: QuizResult[];
  // Kairos
  moods: MoodEntry[];
  energies: EnergyEntry[];
  sleeps: SleepEntry[];
  gratitudes: GratitudeEntry[];
  meditations: MeditationEntry[];
  workouts: WorkoutEntry[];
  waterLogs: WaterEntry[];
  bodyMetrics: BodyMetric[];
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
  workLogs: WorkLog[];
  incomes: IncomeEntry[];
  expenses: ExpenseEntry[];
  bills: BillReminder[];
  notes: Note[];
  readingList: ReadingItem[];
  habits: Habit[];
  calendarEvents: CalendarEvent[];
  contacts: Contact[];
  connectors: Connector[];
}

interface AppContextType extends AppState {
  login: () => void; logout: () => void;
  markNotificationsRead: () => void;
  toggleDarkMode: () => void;
  setPartner: (p: PartnerInfo | null) => void;
  addCheckIn: (c: CheckIn) => void;
  addChatMessage: (m: ChatMessage) => void;
  getAIResponse: (msg: string) => string;
  saveQuizResult: (result: QuizResult) => void;
  hasQuizResult: (quizId: string) => boolean;
  getQuizResult: (quizId: string) => QuizResult | undefined;
  // Kairos actions
  addMood: (m: MoodEntry) => void; addEnergy: (e: EnergyEntry) => void; addSleep: (s: SleepEntry) => void; addGratitude: (g: GratitudeEntry) => void; addMeditation: (m: MeditationEntry) => void;
  addWorkout: (w: WorkoutEntry) => void; addWater: (w: WaterEntry) => void; addBodyMetric: (b: BodyMetric) => void;
  addTask: (t: Task) => void; toggleTask: (id: string) => void; addPomodoro: (p: PomodoroSession) => void; addWorkLog: (w: WorkLog) => void;
  addIncome: (i: IncomeEntry) => void; addExpense: (e: ExpenseEntry) => void; toggleBill: (id: string) => void;
  addNote: (n: Note) => void; updateNote: (n: Note) => void; deleteNote: (id: string) => void;
  addReading: (r: ReadingItem) => void; updateReading: (r: ReadingItem) => void;
  toggleHabit: (id: string) => void;
  addEvent: (e: CalendarEvent) => void; addContact: (c: Contact) => void;
  toggleConnector: (id: string) => void;
  exportAllData: () => string;
  importAllData: (json: string) => boolean;
}

const aiResponses: Record<string, string> = {
  "Discuss today's check-ins": "I see you both checked in today. That's a beautiful combination of emotions. Would you like to explore what might be contributing to these feelings?",
  'Explore a conversation topic': "Here's a thought: When did you last tell your partner something you genuinely admire about them? Sharing specific appreciations can deepen your connection.",
  'Get advice on a tension': "I understand tensions can feel overwhelming. A helpful approach is to use 'I feel' statements rather than 'You always' accusations. Would you like to practice reframing a specific situation?",
  'Plan something special': "How about planning a 'no-phone' evening this week? Cook together, play a game, or simply sit and talk. The key is being fully present with each other.",
  default: "Thank you for sharing that with me. It sounds like this is something that matters deeply to you. Would you like to explore how you might communicate this feeling to your partner?",
};

const initialChat: ChatMessage[] = [
  { id: '1', role: 'ai', content: "Welcome! I'm Evergreen, your relationship wellness assistant. How are you and your partner doing today?", timestamp: 'Just now' },
];

const initialHabits: Habit[] = [
  { id: '1', name: 'Morning Gratitude', streak: 12, completedToday: true, color: 'var(--app-primary, #6366F1)' },
  { id: '2', name: 'Exercise', streak: 5, completedToday: false, color: '#10B981' },
  { id: '3', name: 'Read 30 min', streak: 8, completedToday: true, color: '#A855F7' },
  { id: '4', name: 'No Phone After 9pm', streak: 3, completedToday: false, color: '#64748B' },
];

const initialTasks: Task[] = [
  { id: '1', title: 'Review project proposal', priority: 'high', completed: false, project: 'Work' },
  { id: '2', title: 'Grocery shopping', priority: 'medium', completed: true },
  { id: '3', title: 'Call dentist', priority: 'medium', completed: false },
  { id: '4', title: 'Plan weekend date', priority: 'low', completed: false, project: 'Relationship' },
];

const initialBills: BillReminder[] = [
  { id: '1', name: 'Rent', amount: 2200, dueDate: '2026-06-01', paid: true },
  { id: '2', name: 'Electricity', amount: 145, dueDate: '2026-06-15', paid: false },
  { id: '3', name: 'Internet', amount: 89, dueDate: '2026-06-10', paid: false },
];

const initialConnectors: Connector[] = [
  { id: 'fitbit', name: 'Fitbit', category: 'Health', icon: 'heart-pulse', connected: false },
  { id: 'strava', name: 'Strava', category: 'Fitness', icon: 'activity', connected: false },
  { id: 'gcal', name: 'Google Calendar', category: 'Productivity', icon: 'calendar', connected: false },
  { id: 'spotify', name: 'Spotify', category: 'Entertainment', icon: 'music', connected: true, lastSync: '2 hours ago' },
  { id: 'ynab', name: 'YNAB', category: 'Finance', icon: 'dollar-sign', connected: false },
  { id: 'todoist', name: 'Todoist', category: 'Productivity', icon: 'check-square', connected: true, lastSync: '1 day ago' },
];

const initialNotes: Note[] = [
  { id: '1', title: 'Relationship Goals 2026', content: '1. Weekly date night\n2. Monthly relationship check-in\n3. Practice active listening daily\n4. Plan a trip together', tags: ['relationship', 'goals'], createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-05-20T14:30:00Z' },
  { id: '2', title: 'Communication Patterns I Notice', content: 'When I feel anxious, I tend to over-explain. When Alex is stressed, they go quiet. Both are protective patterns.', tags: ['self-awareness', 'patterns'], createdAt: '2026-03-10T08:00:00Z', updatedAt: '2026-03-10T08:00:00Z' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: { name: 'You', email: 'demo@aevum.app' },
    partner: { id: 2, name: 'Alex', connected: true, lastCheckIn: '2 hours ago' },
    checkIns: [], chatMessages: initialChat, unreadNotifications: 1, darkMode: localStorage.getItem('theme') === 'dark',
    quizResults: ls<QuizResult[]>('hearmeout_quiz_results', []),
    moods: ls<MoodEntry[]>('hmo_moods', []), energies: ls<EnergyEntry[]>('hmo_energies', []),
    sleeps: ls<SleepEntry[]>('hmo_sleeps', []), gratitudes: ls<GratitudeEntry[]>('hmo_gratitudes', []),
    meditations: ls<MeditationEntry[]>('hmo_meditations', []), workouts: ls<WorkoutEntry[]>('hmo_workouts', []),
    waterLogs: ls<WaterEntry[]>('hmo_water', []), bodyMetrics: ls<BodyMetric[]>('hmo_body', []),
    tasks: ls<Task[]>('hmo_tasks', initialTasks), pomodoroSessions: ls<PomodoroSession[]>('hmo_pomodoro', []),
    workLogs: ls<WorkLog[]>('hmo_worklogs', []), incomes: ls<IncomeEntry[]>('hmo_incomes', []),
    expenses: ls<ExpenseEntry[]>('hmo_expenses', []), bills: ls<BillReminder[]>('hmo_bills', initialBills),
    notes: ls<Note[]>('hmo_notes', initialNotes), readingList: ls<ReadingItem[]>('hmo_reading', []),
    habits: ls<Habit[]>('hmo_habits', initialHabits), calendarEvents: ls<CalendarEvent[]>('hmo_events', []),
    contacts: ls<Contact[]>('hmo_contacts', []), connectors: ls<Connector[]>('hmo_connectors', initialConnectors),
  });

  const persist = useCallback((key: string, value: unknown) => { localStorage.setItem(key, JSON.stringify(value)); }, []);

  // Core actions
  const login = useCallback(() => { setState(s => ({ ...s, user: { name: 'You', email: 'demo@aevum.app' } })); }, []);
  const logout = useCallback(() => { setState(s => ({ ...s, user: null, partner: null })); }, []);
  const markNotificationsRead = useCallback(() => { setState(s => ({ ...s, unreadNotifications: 0 })); }, []);
  const toggleDarkMode = useCallback(() => { setState(s => { const next = !s.darkMode; localStorage.setItem('theme', next ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', next); return { ...s, darkMode: next }; }); }, []);
  const setPartner = useCallback((p: PartnerInfo | null) => { setState(s => ({ ...s, partner: p })); }, []);
  const addCheckIn = useCallback((c: CheckIn) => { setState(s => ({ ...s, checkIns: [c, ...s.checkIns] })); }, []);
  const addChatMessage = useCallback((m: ChatMessage) => { setState(s => ({ ...s, chatMessages: [...s.chatMessages, m] })); }, []);
  const getAIResponse = useCallback((msg: string) => aiResponses[msg] || aiResponses.default, []);
  const saveQuizResult = useCallback((result: QuizResult) => { setState(s => { const filtered = s.quizResults.filter(r => r.quizId !== result.quizId); const next = [...filtered, result]; persist('hearmeout_quiz_results', next); return { ...s, quizResults: next }; }); }, [persist]);
  const hasQuizResult = useCallback((quizId: string) => state.quizResults.some(r => r.quizId === quizId), [state.quizResults]);
  const getQuizResult = useCallback((quizId: string) => state.quizResults.find(r => r.quizId === quizId), [state.quizResults]);

  // Kairos: Wellness
  const addMood = useCallback((m: MoodEntry) => { setState(s => { const next = [m, ...s.moods]; persist('hmo_moods', next); return { ...s, moods: next }; }); }, [persist]);
  const addEnergy = useCallback((e: EnergyEntry) => { setState(s => { const next = [e, ...s.energies]; persist('hmo_energies', next); return { ...s, energies: next }; }); }, [persist]);
  const addSleep = useCallback((entry: SleepEntry) => { setState(prev => { const next = [entry, ...prev.sleeps]; persist('hmo_sleeps', next); return { ...prev, sleeps: next }; }); }, [persist]);
  const addGratitude = useCallback((g: GratitudeEntry) => { setState(s => { const next = [g, ...s.gratitudes]; persist('hmo_gratitudes', next); return { ...s, gratitudes: next }; }); }, [persist]);
  const addMeditation = useCallback((m: MeditationEntry) => { setState(s => { const next = [m, ...s.meditations]; persist('hmo_meditations', next); return { ...s, meditations: next }; }); }, [persist]);
  // Kairos: Health
  const addWorkout = useCallback((w: WorkoutEntry) => { setState(s => { const next = [w, ...s.workouts]; persist('hmo_workouts', next); return { ...s, workouts: next }; }); }, [persist]);
  const addWater = useCallback((w: WaterEntry) => { setState(s => { const next = [w, ...s.waterLogs]; persist('hmo_water', next); return { ...s, waterLogs: next }; }); }, [persist]);
  const addBodyMetric = useCallback((b: BodyMetric) => { setState(s => { const next = [b, ...s.bodyMetrics]; persist('hmo_body', next); return { ...s, bodyMetrics: next }; }); }, [persist]);
  // Kairos: Work
  const addTask = useCallback((t: Task) => { setState(s => { const next = [...s.tasks, t]; persist('hmo_tasks', next); return { ...s, tasks: next }; }); }, [persist]);
  const toggleTask = useCallback((id: string) => { setState(s => { const next = s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t); persist('hmo_tasks', next); return { ...s, tasks: next }; }); }, [persist]);
  const addPomodoro = useCallback((p: PomodoroSession) => { setState(s => { const next = [p, ...s.pomodoroSessions]; persist('hmo_pomodoro', next); return { ...s, pomodoroSessions: next }; }); }, [persist]);
  const addWorkLog = useCallback((w: WorkLog) => { setState(s => { const next = [w, ...s.workLogs]; persist('hmo_worklogs', next); return { ...s, workLogs: next }; }); }, [persist]);
  // Kairos: Finance
  const addIncome = useCallback((i: IncomeEntry) => { setState(s => { const next = [i, ...s.incomes]; persist('hmo_incomes', next); return { ...s, incomes: next }; }); }, [persist]);
  const addExpense = useCallback((e: ExpenseEntry) => { setState(s => { const next = [e, ...s.expenses]; persist('hmo_expenses', next); return { ...s, expenses: next }; }); }, [persist]);
  const toggleBill = useCallback((id: string) => { setState(s => { const next = s.bills.map(b => b.id === id ? { ...b, paid: !b.paid } : b); persist('hmo_bills', next); return { ...s, bills: next }; }); }, [persist]);
  // Kairos: Notes
  const addNote = useCallback((n: Note) => { setState(s => { const next = [n, ...s.notes]; persist('hmo_notes', next); return { ...s, notes: next }; }); }, [persist]);
  const updateNote = useCallback((n: Note) => { setState(s => { const next = s.notes.map(x => x.id === n.id ? { ...n, updatedAt: new Date().toISOString() } : x); persist('hmo_notes', next); return { ...s, notes: next }; }); }, [persist]);
  const deleteNote = useCallback((id: string) => { setState(s => { const next = s.notes.filter(x => x.id !== id); persist('hmo_notes', next); return { ...s, notes: next }; }); }, [persist]);
  const addReading = useCallback((r: ReadingItem) => { setState(s => { const next = [r, ...s.readingList]; persist('hmo_reading', next); return { ...s, readingList: next }; }); }, [persist]);
  const updateReading = useCallback((r: ReadingItem) => { setState(s => { const next = s.readingList.map(x => x.id === r.id ? r : x); persist('hmo_reading', next); return { ...s, readingList: next }; }); }, [persist]);
  // Kairos: Habits
  const toggleHabit = useCallback((id: string) => { setState(s => { const next = s.habits.map(h => h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h); persist('hmo_habits', next); return { ...s, habits: next }; }); }, [persist]);
  // Kairos: Calendar
  const addEvent = useCallback((e: CalendarEvent) => { setState(s => { const next = [e, ...s.calendarEvents]; persist('hmo_events', next); return { ...s, calendarEvents: next }; }); }, [persist]);
  const addContact = useCallback((c: Contact) => { setState(s => { const next = [c, ...s.contacts]; persist('hmo_contacts', next); return { ...s, contacts: next }; }); }, [persist]);
  // Kairos: Connectors
  const toggleConnector = useCallback((id: string) => { setState(s => { const next = s.connectors.map(c => c.id === id ? { ...c, connected: !c.connected, lastSync: c.connected ? undefined : 'Just now' } : c); persist('hmo_connectors', next); return { ...s, connectors: next }; }); }, [persist]);

  const exportAllData = useCallback(() => {
    const data = { ...state, exportDate: new Date().toISOString(), version: '1.0' };
    return JSON.stringify(data, null, 2);
  }, [state]);

  const importAllData = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      setState(prev => ({ ...prev, ...data, user: prev.user }));
      Object.keys(data).forEach(k => { localStorage.setItem(`hmo_${k}`, JSON.stringify(data[k])); });
      return true;
    } catch { return false; }
  }, []);

  return (
    <AppContext.Provider value={{ ...state, login, logout, markNotificationsRead, toggleDarkMode, setPartner, addCheckIn, addChatMessage, getAIResponse, saveQuizResult, hasQuizResult, getQuizResult, addMood, addEnergy, addSleep, addGratitude, addMeditation, addWorkout, addWater, addBodyMetric, addTask, toggleTask, addPomodoro, addWorkLog, addIncome, addExpense, toggleBill, addNote, updateNote, deleteNote, addReading, updateReading, toggleHabit, addEvent, addContact, toggleConnector, exportAllData, importAllData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
