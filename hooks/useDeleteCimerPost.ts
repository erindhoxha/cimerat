import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';
import { useConfirm } from '@/context/ConfirmProvider';

// Returns a function that asks for confirmation, then deletes the user's own cimer post
export const useDeleteCimerPost = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cimerat/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return Promise.reject(new Error('Fshirja e postimit dështoi.'));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cimerat'] });
      queryClient.invalidateQueries({ queryKey: ['public-user'] });
      Toast.show({ type: 'success', text1: 'Postimi u fshi' });
    },
    onError: () => Toast.show({ type: 'error', text1: 'Fshirja e postimit dështoi' }),
  });

  return async (id: string, onDeleted?: () => void) => {
    const ok = await confirm({
      title: 'Fshi postimin?',
      message: 'Postimi do të largohet përgjithmonë.',
      confirmLabel: 'Po, fshi',
      destructive: true,
    });
    if (ok) mutate(id, { onSuccess: onDeleted });
  };
};
