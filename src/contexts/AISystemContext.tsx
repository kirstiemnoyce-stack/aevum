import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// --- Types ---

export type GeneratedContentType =
  | 'date_idea'
  | 'conversation_starter'
  | 'conflict_resolution'
  | 'intimacy_builder'
  | 'gratitude_prompt'
  | 'growth_challenge'
  | 'activity'
  | 'checkin_prompt'
  | 'love_letter';

export interface GeneratedContent {
  id: string;
  type: GeneratedContentType;
  title: string;
  content: string;
  saved: boolean;
  createdAt: Date;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'timing' | 'activity' | 'conversation' | 'self_care' | 'connection';
  priority: 'high' | 'medium' | 'low';
  reason: string;
  dismissed: boolean;
  createdAt: Date;
}

export interface RelationshipAlert {
  id: string;
  type: 'positive' | 'warning' | 'info';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  description: string;
  date: string;
  read: boolean;
  createdAt: Date;
}

export interface WeeklyReport {
  id: string;
  weekOf: Date;
  week: string;
  summary: string;
  checkInCount: number;
  moodAverage: number;
  highlights: string[];
  emotionalHealthScore: number;
  checkInConsistency: number;
  conflictCount: number;
  topMood: string;
  aiInsight: string;
}

export interface PartnerDynamic {
  overallScore: number;
  communicationScore: number;
  communicationBalance: number;
  intimacyScore: number;
  conflictScore: number;
  pursuerWithdrawerPattern: string;
  emotionalSynchronization: number;
  attachmentMismatch: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface EvergreenMetrics {
  streak: number;
  totalCheckIns: number;
  averageMood: number;
  topMoods: string[];
  connectionScore: number;
  accuracyScore: number;
  personalizationScore: number;
  emotionalUnderstanding: number;
  responseSatisfaction: number;
  totalInteractions: number;
  positiveFeedback: number;
  negativeFeedback: number;
  lowConfidenceFlags: number;
  learningCycles: number;
}

export interface AevumMessage {
  id: string;
  content: string;
  type: 'insight' | 'encouragement' | 'challenge';
  role: string | null;
  feedback: 'up' | 'down' | null;
  createdAt: Date;
}

export interface ConflictMessage {
  id: string;
  role: 'user' | 'partner' | 'ai';
  content: string;
  createdAt: Date;
}

export interface ConflictSession {
  id: string;
  topic: string;
  messages: ConflictMessage[];
  resolved: boolean;
  status: 'active' | 'resolved';
  deEscalationScripts: string[];
  repairStrategies: string[];
  startedAt: Date;
}

export interface AIConversationMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  confidence: number | null;
  moodContext: string | null;
  reasoning: string | null;
  feedback: 'up' | 'down' | null;
  createdAt: Date;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIConversationMessage[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Context ---

interface AISystemContextType {
  generatedContent: GeneratedContent[];
  generateContent: (type: GeneratedContentType) => void;
  toggleSaveContent: (id: string) => void;
  getSavedContent: () => GeneratedContent[];
  recommendations: Recommendation[];
  dismissRecommendation: (id: string) => void;
  getActiveRecommendations: () => Recommendation[];
  relationshipAlerts: RelationshipAlert[];
  dismissAlert: (id: string) => void;
  getUnreadAlerts: () => RelationshipAlert[];
  weeklyReports: WeeklyReport[];
  partnerDynamic: PartnerDynamic | null;
  evergreenMetrics: EvergreenMetrics;
  aevumMessages: AevumMessage[];
  conflictSessions: ConflictSession[];
  startConflictSession: (topic: string) => string;
  addConflictMessage: (sessionId: string, role: 'user' | 'partner' | 'ai', content: string) => void;
  resolveConflict: (sessionId: string) => void;
  conversations: AIConversation[];
  getConversation: (id: string) => AIConversation | undefined;
  deleteConversation: (id: string) => void;
}

const AISystemContext = createContext<AISystemContextType | undefined>(undefined);

const DE_ESCALATION_SCRIPTS = [
  "I'm feeling overwhelmed right now. Can we take 5 minutes to breathe?",
  "I want to understand your perspective. Can you help me see what you're feeling?",
  "I'm not trying to win this. I want us to feel connected again.",
];

const REPAIR_STRATEGIES = [
  "Let's each share one thing we appreciate about the other right now.",
  "Can we agree on one small next step we both feel okay with?",
  "What would help you feel heard in this moment?",
];

export function AISystemProvider({ children }: { children: ReactNode }) {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1', title: 'Quality Time', category: 'activity', dismissed: false, createdAt: new Date(),
      description: 'Plan a screen-free evening together this week.', priority: 'high',
      reason: 'You haven\'t had uninterrupted time together in over a week.',
    },
    {
      id: '2', title: 'Daily Check-In', category: 'conversation', dismissed: false, createdAt: new Date(),
      description: 'Share one thing you\'re grateful for each morning.', priority: 'medium',
      reason: 'Regular gratitude sharing is linked to higher relationship satisfaction.',
    },
  ]);
  const [dismissedRecs, setDismissedRecs] = useState<Set<string>>(new Set());
  const [relationshipAlerts] = useState<RelationshipAlert[]>([
    {
      id: '1', type: 'positive', severity: 'info', title: 'Streak Milestone',
      message: 'You\'ve checked in 7 days in a row!', description: 'Consistent check-ins strengthen emotional intimacy over time.',
      date: new Date().toLocaleDateString(), read: false, createdAt: new Date(),
    },
  ]);
  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set());
  const [conflictSessions, setConflictSessions] = useState<ConflictSession[]>([]);
  const [conversations, setConversations] = useState<AIConversation[]>([]);

  const generateContent = useCallback((type: GeneratedContentType) => {
    const demos: Record<GeneratedContentType, { title: string; content: string }[]> = {
      date_idea: [{ title: 'New Cuisine Night', content: 'Cook a new recipe together from a cuisine you\'ve never tried.' }],
      conversation_starter: [{ title: 'Mindset Shift', content: 'What\'s something you\'ve changed your mind about in the last year?' }],
      conflict_resolution: [{ title: 'Needs Mapping', content: 'Take 20 minutes apart to write down what you each need, then share.' }],
      intimacy_builder: [{ title: 'Six-Second Hug', content: 'Give each other a 6-second hug — research shows it triggers oxytocin.' }],
      gratitude_prompt: [{ title: 'Five Things', content: 'Write down five specific things your partner did this week that you\'re grateful for.' }],
      growth_challenge: [{ title: 'Habit Pair', content: 'Each choose one personal habit to work on this month and check in weekly.' }],
      activity: [{ title: 'Shared Practice', content: 'Try a 10-minute couples meditation together before bed tonight.' }],
      checkin_prompt: [{ title: 'Morning Sync', content: 'How are you feeling about us right now, on a scale of 1–10?' }],
      love_letter: [{ title: 'Appreciation Letter', content: 'Write three paragraphs: what you love about them, a favourite memory, and your hope for the future.' }],
    };
    const options = demos[type];
    const pick = options[Math.floor(Math.random() * options.length)];
    setGeneratedContent(prev => [{
      id: Date.now().toString(), type, title: pick.title, content: pick.content,
      saved: false, createdAt: new Date(),
    }, ...prev]);
  }, []);

  const toggleSaveContent = useCallback((id: string) => {
    setGeneratedContent(prev => prev.map(item => item.id === id ? { ...item, saved: !item.saved } : item));
  }, []);

  const getSavedContent = useCallback(() => generatedContent.filter(c => c.saved), [generatedContent]);

  const dismissRecommendation = useCallback((id: string) => {
    setDismissedRecs(prev => new Set([...prev, id]));
  }, []);

  const getActiveRecommendations = useCallback(() =>
    recommendations.filter(r => !dismissedRecs.has(r.id)), [recommendations, dismissedRecs]);

  const dismissAlert = useCallback((id: string) => {
    setReadAlerts(prev => new Set([...prev, id]));
  }, []);

  const getUnreadAlerts = useCallback(() =>
    relationshipAlerts.filter(a => !readAlerts.has(a.id)), [relationshipAlerts, readAlerts]);

  const startConflictSession = useCallback((topic: string) => {
    const session: ConflictSession = {
      id: Date.now().toString(), topic, messages: [], resolved: false, status: 'active',
      deEscalationScripts: DE_ESCALATION_SCRIPTS,
      repairStrategies: REPAIR_STRATEGIES,
      startedAt: new Date(),
    };
    setConflictSessions(prev => [session, ...prev]);
    return session.id;
  }, []);

  const addConflictMessage = useCallback((sessionId: string, role: 'user' | 'partner' | 'ai', content: string) => {
    setConflictSessions(prev => prev.map(s => s.id === sessionId ? {
      ...s, messages: [...s.messages, { id: Date.now().toString(), role, content, createdAt: new Date() }],
    } : s));
  }, []);

  const resolveConflict = useCallback((sessionId: string) => {
    setConflictSessions(prev => prev.map(s => s.id === sessionId ? { ...s, resolved: true, status: 'resolved' as const } : s));
  }, []);

  const getConversation = useCallback((id: string) => conversations.find(c => c.id === id), [conversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  }, []);

  const weeklyReports: WeeklyReport[] = [];
  const partnerDynamic: PartnerDynamic = {
    overallScore: 78, communicationScore: 82, communicationBalance: 76,
    intimacyScore: 75, conflictScore: 70,
    pursuerWithdrawerPattern: 'pursue_withdraw', emotionalSynchronization: 80, attachmentMismatch: 20,
    trend: 'improving',
  };
  const evergreenMetrics: EvergreenMetrics = {
    streak: 7, totalCheckIns: 42, averageMood: 7.2, topMoods: ['grateful', 'connected', 'hopeful'],
    connectionScore: 85, accuracyScore: 88, personalizationScore: 84, emotionalUnderstanding: 79,
    responseSatisfaction: 91, totalInteractions: 156, positiveFeedback: 128, negativeFeedback: 14,
    lowConfidenceFlags: 8, learningCycles: 5,
  };
  const aevumMessages: AevumMessage[] = [
    {
      id: '1', content: 'Your consistency this week is building real momentum. Keep showing up.',
      type: 'encouragement', role: null, feedback: null as 'up' | 'down' | null, createdAt: new Date(),
    },
  ];

  return (
    <AISystemContext.Provider value={{
      generatedContent, generateContent, toggleSaveContent, getSavedContent,
      recommendations: recommendations.map(r => ({ ...r, dismissed: dismissedRecs.has(r.id) })),
      dismissRecommendation, getActiveRecommendations,
      relationshipAlerts: relationshipAlerts.map(a => ({ ...a, read: readAlerts.has(a.id) })),
      dismissAlert, getUnreadAlerts,
      weeklyReports, partnerDynamic, evergreenMetrics, aevumMessages,
      conflictSessions, startConflictSession, addConflictMessage, resolveConflict,
      conversations, getConversation, deleteConversation,
    }}>
      {children}
    </AISystemContext.Provider>
  );
}

export function useAISystems() {
  const ctx = useContext(AISystemContext);
  if (!ctx) throw new Error('useAISystems must be used within AISystemProvider');
  return ctx;
}
