import { useSafeRouter } from '@/hooks/useSafeRouter';
import { RequireAuth } from '@/components/RequireAuth/RequireAuth';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';
import { ListingForm } from '@/components/ListingForm/ListingForm';
import { ImageType, Listing } from '@/types';
import { buildListingFormData, uploadForm } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';

function CreateScreenContent() {
  const router = useSafeRouter();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const onSubmit = async (
    data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>,
    images: ImageType[],
    onProgress: (fraction: number) => void,
  ) => {
    const formData = await buildListingFormData(data, images);

    try {
      await uploadForm({
        url: `${process.env.EXPO_PUBLIC_API_URL}/listings`,
        method: 'POST',
        body: formData,
        token,
        onProgress,
      });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['public-user'] });
      Toast.show({ type: 'success', text1: 'Listimi u publikua' });
      // Land on "Listimet e mia" so the new listing is right there
      router.replace({ pathname: '/profile', params: { tab: 'listings' } });
    } catch (e) {
      Toast.show({ type: 'error', text1: e instanceof Error ? e.message : 'Gabim gjatë krijimit' });
    }
  };

  return <ListingForm onSubmit={onSubmit} />;
}

export default function CreateScreen() {
  return (
    <RequireAuth reason="postuar një dhomë">
      <CreateScreenContent />
    </RequireAuth>
  );
}
