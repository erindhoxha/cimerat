import { useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';

// Shares the ['user'] query cache with the profile and listing screens
export const useCurrentUser = () => {
  const { token, setAuth } = useAuth();
  const queryClient = useQueryClient();

  return useQuery<{ user: User }>({
    queryKey: ['user'],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Expired token, or the server's JWT_SECRET changed: sign out cleanly instead of
      // looking logged in while every request fails
      if (res.status === 401) {
        setAuth(null, null, null);
        queryClient.clear();
        Toast.show({ type: 'info', text1: 'Sesioni ka skaduar', text2: 'Ju lutemi kyçuni përsëri.' });
        return Promise.reject('Sesioni ka skaduar.');
      }
      if (!res.ok) {
        return Promise.reject('Gjetja e përdoruesit ishte e pasuksesshme nga ana jonë.');
      }
      return res.json();
    },
  });
};
