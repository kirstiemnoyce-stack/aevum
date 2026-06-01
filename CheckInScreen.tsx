import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface CheckIn {
  id: string;
  mood: string;
  intensity: string;
  note: string;
  shared: boolean;
  createdAt: string;
  userId: string;
}

export interface Partner {
  id: string;
  name: string;
  avatar?: string;
  connected: boolean;
  inviteCode?: string;
  lastCheckIn?: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isAnonymous: boolean;
  mood: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  feedback?: 'up' | 'down' | null;
}

interface AppState {
  user: { id: string; name: string; email: string; avatar?: string } | null;
  partner: Partner | null;
  checkIns: CheckIn[];
  feedPosts: FeedPost[];
  chatMessages: ChatMessage[];
  unreadNotifications: number;
  anonymousMode: boolean;
}

interface AppContextType extends AppState {
  setUser: (user: AppState['user']) => void;
  setPartner: (partner: Partner | null) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  toggleLike: (postId: string) => void;
  addPost: (post: FeedPost) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setChatFeedback: (msgId: string, feedback: 'up' | 'down') => void;
  markNotificationsRead: () => void;
  toggleAnonymousMode: () => void;
  login: () => void;
  logout: () => void;
}

const initialPosts: FeedPost[] = [
  {
    id: '1',
    authorId: 'user2',
    authorName: 'Alex',
    isAnonymous: false,
    mood: 'Grateful',
    content: 'Feeling really grateful for the little things today. My partner made me coffee without me asking. Small gestures matter so much.',
    likes: 12,
    comments: 3,
    liked: false,
    createdAt: '2h ago',
  },
  {
    id: '2',
    authorId: 'anon',
    authorName: 'Anonymous',
    isAnonymous: true,
    mood: 'Anxious',
    content: 'Struggling with communicating my needs. I know my partner cares but sometimes I feel like we speak different languages.',
    likes: 8,
    comments: 5,
    liked: false,
    createdAt: '4h ago',
  },
  {
    id: '3',
    authorId: 'user3',
    authorName: 'Jordan',
    isAnonymous: false,
    mood: 'Happy',
    content: 'Date night was incredible! We tried that new restaurant downtown and laughed for hours. These moments keep us strong.',
    likes: 24,
    comments: 7,
    liked: true,
    createdAt: '6h ago',
  },
];

const initialChatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    content: 'Welcome! I\'m Evergreen, your relationship wellness assistant. How are you and your partner doing today?',
    timestamp: 'Just now',
    feedback: null,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    partner: null,
    checkIns: [],
    feedPosts: initialPosts,
    chatMessages: initialChatMessages,
    unreadNotifications: 1,
    anonymousMode: false,
  });

  const setUser = useCallback((user: AppState['user']) => {
    setState(s => ({ ...s, user }));
  }, []);

  const setPartner = useCallback((partner: Partner | null) => {
    setState(s => ({ ...s, partner }));
  }, []);

  const addCheckIn = useCallback((checkIn: CheckIn) => {
    setState(s => ({ ...s, checkIns: [checkIn, ...s.checkIns] }));
  }, []);

  const toggleLike = useCallback((postId: string) => {
    setState(s => ({
      ...s,
      feedPosts: s.feedPosts.map(p =>
        p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      ),
    }));
  }, []);

  const addPost = useCallback((post: FeedPost) => {
    setState(s => ({ ...s, feedPosts: [post, ...s.feedPosts] }));
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setState(s => ({ ...s, chatMessages: [...s.chatMessages, msg] }));
  }, []);

  const setChatFeedback = useCallback((msgId: string, feedback: 'up' | 'down') => {
    setState(s => ({
      ...s,
      chatMessages: s.chatMessages.map(m =>
        m.id === msgId ? { ...m, feedback } : m
      ),
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState(s => ({ ...s, unreadNotifications: 0 }));
  }, []);

  const toggleAnonymousMode = useCallback(() => {
    setState(s => ({ ...s, anonymousMode: !s.anonymousMode }));
  }, []);

  const login = useCallback(() => {
    setState(s => ({
      ...s,
      user: { id: 'user1', name: 'You', email: 'you@example.com' },
      partner: { id: 'partner1', name: 'Alex', connected: true, lastCheckIn: '2 hours ago' },
    }));
  }, []);

  const logout = useCallback(() => {
    setState(s => ({
      ...s,
      user: null,
      partner: null,
      checkIns: [],
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser,
        setPartner,
        addCheckIn,
        toggleLike,
        addPost,
        addChatMessage,
        setChatFeedback,
        markNotificationsRead,
        toggleAnonymousMode,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
