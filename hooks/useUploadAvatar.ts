import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';

// Lets the user pick a square photo and uploads it as their avatar
export const useUploadAvatar = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (uri: string) => {
      const formData = new FormData();
      formData.append('avatar', { uri, name: 'avatar.jpg', type: 'image/jpeg' } as any);

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/me/avatar`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) return Promise.reject(json.error || 'Gabim gjatë ngarkimit të fotos.');
      return json;
    },
    onSuccess: () => {
      // Avatars are embedded in listings and posts too
      queryClient.invalidateQueries();
      Toast.show({ type: 'success', text1: 'Fotoja e profilit u përditësua' });
    },
    onError: (error) => {
      Toast.show({ type: 'error', text1: typeof error === 'string' ? error : 'Gabim gjatë ngarkimit të fotos' });
    },
  });

  const pickAndUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: 'error',
        text1: 'Leja e galerisë është e nevojshme',
        text2: 'Ju lutemi lejoni qasjen në galeri për të zgjedhur foto.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) mutation.mutate(result.assets[0].uri);
  };

  return { pickAndUpload, isUploading: mutation.isPending };
};
