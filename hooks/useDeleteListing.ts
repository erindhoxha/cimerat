import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';
import { useConfirm } from '@/context/ConfirmProvider';

// Returns a function that asks for confirmation, then deletes the user's own listing
export const useDeleteListing = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return Promise.reject(new Error('Fshirja e listimit dështoi.'));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['public-user'] });
      Toast.show({ type: 'success', text1: 'Listimi u fshi' });
    },
    onError: () => Toast.show({ type: 'error', text1: 'Fshirja e listimit dështoi' }),
  });

  return async (id: string, onDeleted?: () => void) => {
    const ok = await confirm({
      title: 'Fshi listimin?',
      message: 'Listimi do të largohet përgjithmonë dhe nuk do të jetë më i dukshëm për të tjerët.',
      confirmLabel: 'Po, fshi',
      destructive: true,
    });
    if (ok) mutate(id, { onSuccess: onDeleted });
  };
};
