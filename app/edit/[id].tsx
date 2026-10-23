import { useLocalSearchParams } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { RequireAuth } from '@/components/RequireAuth/RequireAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';
import { ImageType, Listing } from '@/types';
import { ListingForm } from '@/components/ListingForm/ListingForm';
import { buildListingFormData, uploadForm } from '@/utils';

function EditScreenContent() {
  const { id } = useLocalSearchParams();
  const router = useSafeRouter();
  const { token } = useAuth();

  const queryClient = useQueryClient();

  const listing = useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listing/${id}`);
      if (!res.ok) return Promise.reject('Failed to fetch');
      return res.json();
    },
  });

  const onSubmit = async (
    data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>,
    images: ImageType[],
    onProgress: (fraction: number) => void,
  ) => {
    const formData = await buildListingFormData(data, images);

    try {
      await uploadForm({
        url: `${process.env.EXPO_PUBLIC_API_URL}/listings/${id}`,
        method: 'PUT',
        body: formData,
        token,
        onProgress,
      });
      Toast.show({ type: 'success', text1: 'Listimi u ndryshua' });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      router.dismissAll();
      router.push(`/${id}`);
    } catch (e) {
      Toast.show({ type: 'error', text1: e instanceof Error ? e.message : 'Gabim gjatë ndryshimit' });
    }
  };

  if (!listing.data) return null;

  return (
    <ListingForm
      onSubmit={onSubmit}
      defaultValues={{
        ...listing.data,
        images: listing.data.images.map((img: Listing['images']) => ({
          uri: `${process.env.EXPO_PUBLIC_API_URL}${img}`,
          name: img.split('/').pop(),
          type: 'image/jpeg',
        })),
        price: listing.data.price.toString(),
      }}
      isEditing
    />
  );
}

export default function EditScreen() {
  return (
    <RequireAuth reason="modifikuar listimin">
      <EditScreenContent />
    </RequireAuth>
  );
}
