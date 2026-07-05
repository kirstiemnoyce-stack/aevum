import { Routes, Route, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import BottomNav from '@/components/BottomNav';
import LoginScreen from '@/pages/LoginScreen';
import HomeScreen from '@/pages/HomeScreen';
import CheckInScreen from '@/pages/CheckInScreen';
import PartnerHubScreen from '@/pages/PartnerHubScreen';
import ChatScreen from '@/pages/ChatScreen';
import InsightsScreen from '@/pages/InsightsScreen';
import ProfileScreen from '@/pages/ProfileScreen';
import QuizHubScreen from '@/pages/QuizHubScreen';
import AttachmentQuiz from '@/pages/quizzes/AttachmentQuiz';
import WindowOfToleranceQuiz from '@/pages/quizzes/WindowOfToleranceQuiz';
import NeurochemistryQuiz from '@/pages/quizzes/NeurochemistryQuiz';
import TraumaProgrammingQuiz from '@/pages/quizzes/TraumaProgrammingQuiz';
import CommunicationPatternsQuiz from '@/pages/quizzes/CommunicationPatternsQuiz';
import ProfilePsychScreen from '@/pages/ProfilePsychScreen';
import AIHubScreen from '@/pages/AIHubScreen';
import AICoachScreen from '@/pages/AICoachScreen';
import EvergreenScreen from '@/pages/EvergreenScreen';
import AIAnalysisScreen from '@/pages/AIAnalysisScreen';
import ConflictResolutionScreen from '@/pages/ConflictResolutionScreen';
import AIContentScreen from '@/pages/AIContentScreen';
import AIRecommendationsScreen from '@/pages/AIRecommendationsScreen';
import EverythingHub from '@/pages/hub/EverythingHub';
import WellnessScreen from '@/pages/hub/WellnessScreen';
import HealthScreen from '@/pages/hub/HealthScreen';
import WorkScreen from '@/pages/hub/WorkScreen';
import FinanceScreen from '@/pages/hub/FinanceScreen';
import NotesScreen from '@/pages/hub/NotesScreen';
import CalendarScreen from '@/pages/hub/CalendarScreen';
import ConnectorsScreen from '@/pages/hub/ConnectorsScreen';
import DataManagerScreen from '@/pages/hub/DataManagerScreen';
import SettingsScreen from '@/pages/SettingsScreen';
import ConversationsScreen from '@/pages/ConversationsScreen';
import ConversationDetailScreen from '@/pages/ConversationDetailScreen';
import AIWorkspace from '@/pages/AIWorkspace';
import AIChatScreen from '@/pages/AIChatScreen';
import ImageGenSettingsScreen from '@/pages/ImageGenSettingsScreen';
import PrivacyScreen from '@/pages/PrivacyScreen';
import TermsScreen from '@/pages/TermsScreen';

const quizPaths = ['/quizzes', '/quiz/attachment', '/quiz/window', '/quiz/neurochemistry', '/quiz/trauma', '/quiz/communication'];
const aiSubPaths = ['/ai/coach', '/ai/evergreen', '/ai/analysis', '/ai/conflict', '/ai/content', '/ai/recommendations', '/ai/conversations', '/ai/chat'];
const hubSubPaths = ['/hub/wellness', '/hub/health', '/hub/work', '/hub/finance', '/hub/notes', '/hub/calendar', '/hub/connectors', '/hub/data'];
const fullScreenPaths = ['/login', '/chat', '/settings', '/settings/image-keys', '/profile-psych', ...quizPaths, ...aiSubPaths, ...hubSubPaths];
// Note: /ai/conversations/:id handled by react-router, not in fullScreenPaths

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isFullScreen = fullScreenPaths.includes(location.pathname) || location.pathname.startsWith('/ai/chat/');
  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep transition-colors duration-300">
      <main className={isFullScreen ? '' : 'pb-28'}>{children}</main>
      {!isFullScreen && <BottomNav />}
    </div>
  );
}

export default function App() {
  const { user } = useApp();

  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={user ? <HomeScreen /> : <LoginScreen />} />
        <Route path="/checkin" element={user ? <CheckInScreen /> : <LoginScreen />} />
        <Route path="/partner" element={user ? <PartnerHubScreen /> : <LoginScreen />} />
        <Route path="/chat" element={user ? <ChatScreen /> : <LoginScreen />} />
        <Route path="/insights" element={user ? <InsightsScreen /> : <LoginScreen />} />
        <Route path="/profile" element={user ? <ProfileScreen /> : <LoginScreen />} />
        <Route path="/profile-psych" element={user ? <ProfilePsychScreen /> : <LoginScreen />} />
        <Route path="/quizzes" element={user ? <QuizHubScreen /> : <LoginScreen />} />
        <Route path="/quiz/attachment" element={user ? <AttachmentQuiz /> : <LoginScreen />} />
        <Route path="/quiz/window" element={user ? <WindowOfToleranceQuiz /> : <LoginScreen />} />
        <Route path="/quiz/neurochemistry" element={user ? <NeurochemistryQuiz /> : <LoginScreen />} />
        <Route path="/quiz/trauma" element={user ? <TraumaProgrammingQuiz /> : <LoginScreen />} />
        <Route path="/quiz/communication" element={user ? <CommunicationPatternsQuiz /> : <LoginScreen />} />
        <Route path="/ai-hub" element={user ? <AIHubScreen /> : <LoginScreen />} />
        <Route path="/ai/coach" element={user ? <AICoachScreen /> : <LoginScreen />} />
        <Route path="/ai/evergreen" element={user ? <EvergreenScreen /> : <LoginScreen />} />
        <Route path="/ai/analysis" element={user ? <AIAnalysisScreen /> : <LoginScreen />} />
        <Route path="/ai/conflict" element={user ? <ConflictResolutionScreen /> : <LoginScreen />} />
        <Route path="/ai/content" element={user ? <AIContentScreen /> : <LoginScreen />} />
        <Route path="/ai/recommendations" element={user ? <AIRecommendationsScreen /> : <LoginScreen />} />
        <Route path="/ai/conversations" element={user ? <ConversationsScreen /> : <LoginScreen />} />
        <Route path="/ai/conversations/:id" element={user ? <ConversationDetailScreen /> : <LoginScreen />} />
        <Route path="/ai/workspace" element={user ? <AIWorkspace /> : <LoginScreen />} />
        <Route path="/ai/chat/:sessionId" element={user ? <AIChatScreen /> : <LoginScreen />} />
        <Route path="/settings" element={user ? <SettingsScreen /> : <LoginScreen />} />
        <Route path="/settings/image-keys" element={user ? <ImageGenSettingsScreen /> : <LoginScreen />} />
        <Route path="/privacy" element={<PrivacyScreen />} />
        <Route path="/terms" element={<TermsScreen />} />
        <Route path="/hub" element={user ? <EverythingHub /> : <LoginScreen />} />
        <Route path="/hub/wellness" element={user ? <WellnessScreen /> : <LoginScreen />} />
        <Route path="/hub/health" element={user ? <HealthScreen /> : <LoginScreen />} />
        <Route path="/hub/work" element={user ? <WorkScreen /> : <LoginScreen />} />
        <Route path="/hub/finance" element={user ? <FinanceScreen /> : <LoginScreen />} />
        <Route path="/hub/notes" element={user ? <NotesScreen /> : <LoginScreen />} />
        <Route path="/hub/calendar" element={user ? <CalendarScreen /> : <LoginScreen />} />
        <Route path="/hub/connectors" element={user ? <ConnectorsScreen /> : <LoginScreen />} />
        <Route path="/hub/data" element={user ? <DataManagerScreen /> : <LoginScreen />} />
      </Routes>
    </AppLayout>
  );
}
