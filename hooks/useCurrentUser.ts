import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';

// Shares the ['user'] query cache with the profile and listing screens
export const useCurrentUser = () => {
  const { token } = useAuth();

  return useQuery<{ user: User }>({
    queryKey: ['user'],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        return Promise.reject('Gjetja e përdoruesit ishte e pasuksesshme nga ana jonë.');
      }
      return res.json();
    },
  });
};
