import { useApp } from '@/contexts/AppContext';
import type { UserProfile } from '@/contexts/AppContext';

interface UseAuthReturn {
  isLoading: boolean;
  user: UserProfile | null;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const { user, logout } = useApp();
  return { isLoading: false, user, logout };
}
