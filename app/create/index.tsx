import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';
import { ListingForm } from '@/components/ListingForm/ListingForm';
import { ImageType, Listing } from '@/types';
import { buildListingFormData } from '@/utils';

export default function CreateScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const onSubmit = async (data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>, images: ImageType[]) => {
    const formData = buildListingFormData(data, images);

    console.log('FORM DATA', formData);

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listings`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gabim gjatë krijimit.');
      Toast.show({ type: 'success', text1: 'Listimi u krijua' });
      router.push('/');
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Gabim gjatë krijimit' });
    }
  };

  return <ListingForm onSubmit={onSubmit} />;
}
