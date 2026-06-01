import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './contexts/AppContext';
import BottomNav from './components/BottomNav';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import CheckInScreen from './pages/CheckInScreen';
import PartnerHubScreen from './pages/PartnerHubScreen';
import ChatScreen from './pages/ChatScreen';
import InsightsScreen from './pages/InsightsScreen';
import FeedScreen from './pages/FeedScreen';
import ProfileScreen from './pages/ProfileScreen';

export default function App() {
  const { user } = useApp();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  if (!user && !isLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep transition-colors duration-300">
      <main className="pb-28">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/checkin" element={<CheckInScreen />} />
          <Route path="/partner" element={<PartnerHubScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/insights" element={<InsightsScreen />} />
          <Route path="/feed" element={<FeedScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </main>
      {user && <BottomNav />}
    </div>
  );
}
