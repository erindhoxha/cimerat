import { Box } from '@/components/Box';
import { Button } from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { Text } from '@/components/Text';
import { cities } from '@/constants/Cities';
import { neighborhoods } from '@/constants/Neighborhoods';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { zodResolver } from '@hookform/resolvers/zod';
import formSchema from './schema';
import { ImagePickerGrid } from '@/components/ImagePickerGrid/ImagePickerGrid';
import { DropdownField } from '@/components/DropdownController/DropdownController';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Listing } from '@/types';

export default function EditScreen() {
  const [images, setImages] = useState<{ uri: string; type?: string; name: string }[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageError, setImageError] = useState<string | null>(null);
  const { token } = useAuth();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
      neighborhood: '',
      description: '',
      price: '',
      images: [],
    },
  });

  const pickImage = async () => {
    if (!mediaLibraryPermission?.granted) {
      const permission = await requestMediaLibraryPermission();
      if (!permission.granted) {
        Toast.show({
          type: 'error',
          text1: 'Leja e galerisë është e nevojshme',
          text2: 'Ju lutemi lejoni qasjen në galeri për të zgjedhur foto.',
        });
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [
        ...images,
        ...result.assets.map((asset, index) => ({
          type: asset.type,
          name: `photo_${index}.jpg`,
          uri: asset.uri,
        })),
      ];
      setImages(newImages);
      setValue('images', newImages);
      setImageError(null);
    }
  };

  const selectedCity = watch('city');

  const listing = useQuery<Listing>({
    staleTime: 0,
    queryKey: ['listing', id],
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listing/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch listings');
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (listing.data) {
      const newImages = listing.data.images.map((img: Listing['images']) => ({
        uri: `${process.env.EXPO_PUBLIC_API_URL}${img}`,
        name: img.split('/').pop(),
        type: 'image/jpeg',
      }));
      setImages(() => {
        return [...newImages];
      });
      reset({ ...listing.data, images: newImages });
    }
  }, [listing.data]);

  const onSubmit = async (data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    const formData = new FormData();
    formData.append('city', data.city);
    formData.append('neighborhood', data.neighborhood);
    formData.append('description', data.description);
    formData.append('price', data.price);

    images.forEach((img, idx) => {
      formData.append('images', {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.name || `photo_${idx}.jpg`,
      } as unknown as File);
    });

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listings`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gabim gjatë krijimit. Ju lutemi provoni përsëri.');
      }
      Toast.show({
        type: 'success',
        text1: 'Keni krijuar një listim të ri',
        text2: 'Shikoni listimet tuaja për të parë ndryshimet.',
        text1Style: styles.toastTitle,
        text2Style: styles.toastSubtitle,
      });
      router.push('/');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Gabim gjatë krijimit të listimit',
        text2: 'Ju lutemi provoni përsëri, ose na kontaktoni.',
      });
    }
  };

  const onFormError = () => {
    if (images.length === 0) {
      setImageError('Duhet të ngarkoni së paku një foto');
    } else {
      setImageError(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Box marginBottom={20}>
        <Text fontSize="xl" fontWeight="bold">
          Ndrysho Listimin
        </Text>
      </Box>
      <Box gap={12}>
        <ImagePickerGrid
          images={images}
          onPick={pickImage}
          onPreview={setPreviewImage}
          onRemove={(idx) => {
            const newImages = images.filter((_, i) => i !== idx);
            setImages(newImages);
            setValue('images', newImages);
          }}
          error={imageError}
        />
        <DropdownField
          control={control}
          name="city"
          label="Qyteti"
          options={cities}
          placeholder="Zgjedh Qytetin"
          error={errors.city?.message}
          search
          searchPlaceHolder="Kërko qytetin..."
          searchPlaceHolderColor="#6c757d"
        />
        <DropdownField
          control={control}
          name="neighborhood"
          label="Lagja"
          options={selectedCity ? neighborhoods[selectedCity] : []}
          placeholder="Zgjedh Lagjën"
          disabled={!selectedCity}
          error={errors.neighborhood?.message}
          search
          searchPlaceHolder="Kërko lagjën..."
          searchPlaceHolderColor="#6c757d"
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Përshkrimi"
              placeholder="Përshkrimi"
              multiline
              numberOfLines={20}
              required
              error={errors.description?.message}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              label="Çmimi në euro (€)"
              maxLength={6}
              required
              placeholder="300"
              keyboardType="numeric"
              inputMode="numeric"
              error={errors.price?.message}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                onChange(numericValue);
              }}
            />
          )}
        />
        <Button variant="primary" style={styles.submitButton} onPress={handleSubmit(onSubmit, onFormError)}>
          {isSubmitting ? (
            <Box flexDirection="row" gap={4} alignItems="center">
              <ActivityIndicator color="#000" />
              <Text>Duke Ndryshuar...</Text>
            </Box>
          ) : (
            'Krijo Listimin'
          )}
        </Button>
      </Box>
      <Modal visible={!!previewImage} transparent animationType="fade" onRequestClose={() => setPreviewImage(null)}>
        <Pressable
          style={styles.previewOverlay}
          onPress={() => {
            setPreviewImage(null);
          }}
        >
          {previewImage && <Image source={{ uri: previewImage }} style={styles.previewImage} contentFit="contain" />}
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  submitButton: {
    marginBottom: 48,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '80%',
    borderRadius: 32,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  toastSubtitle: {
    fontSize: 12,
  },
});
