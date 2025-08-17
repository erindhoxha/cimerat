import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';
import { ImageType, Listing } from '@/types';
import { ListingForm } from '@/components/ListingForm/ListingForm';
import { buildListingFormData } from '@/utils';

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuth();

  const queryClient = useQueryClient();

  const listing = useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listing/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const onSubmit = async (data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>, images: ImageType[]) => {
    const formData = buildListingFormData(data, images);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listings/${id}`, {
        method: 'PUT',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gabim gjatë ndryshimit.');
      Toast.show({ type: 'success', text1: 'Listimi u ndryshua' });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      router.dismissAll();
      router.push(`/${id}`);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Gabim gjatë ndryshimit' });
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
