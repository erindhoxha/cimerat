// components/ListingForm.tsx
import { Box } from '@/components/Box';
import { Button } from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { Text } from '@/components/Text';
import { cities } from '@/constants/Cities';
import { neighborhoods } from '@/constants/Neighborhoods';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image } from 'expo-image';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePickerGrid } from '@/components/ImagePickerGrid/ImagePickerGrid';
import { DropdownField } from '@/components/DropdownController/DropdownController';
import { Listing } from '@/types';
import formSchema from './schema';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface ListingFormProps {
  defaultValues?: Partial<Listing>;
  onSubmit: (
    data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>,
    images: { uri: string; type?: string; name: string }[],
  ) => Promise<void>;
  isEditing?: boolean;
}

export function ListingForm({ defaultValues, onSubmit, isEditing = false }: ListingFormProps) {
  const [images, setImages] = useState<{ uri: string; type?: string; name: string }[]>(defaultValues?.images || []);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
      neighborhood: '',
      description: '',
      price: '',
      images: [],
      ...defaultValues,
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
          {isEditing ? 'Ndrysho Listimin' : 'Krijo Listimin'}
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
        <Controller
          control={control}
          name="phone"
          rules={{
            required: 'Numri i telefonit është i detyrueshëm',
            validate: (value) =>
              isValidPhoneNumber(value, 'XK') // XK = Kosovo
                ? true
                : 'Numri duhet të jetë valid për Kosovë',
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              label="Numri i telefonit"
              maxLength={15}
              required
              placeholder="048123456 ose +38348123456"
              keyboardType="phone-pad"
              inputMode="numeric"
              error={errors.phone?.message}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9+]/g, '');
                onChange(numericValue);
              }}
            />
          )}
        />
        <Button
          variant="primary"
          style={styles.submitButton}
          onPress={handleSubmit((data) => onSubmit(data, images), onFormError)}
        >
          {isSubmitting ? (
            <Box flexDirection="row" gap={4} alignItems="center">
              <ActivityIndicator color="#000" />
              <Text>{isEditing ? 'Duke Ndryshuar...' : 'Duke Krijuar...'}</Text>
            </Box>
          ) : isEditing ? (
            'Ndrysho Listimin'
          ) : (
            'Krijo Listimin'
          )}
        </Button>
      </Box>
      <Modal visible={!!previewImage} transparent animationType="fade" onRequestClose={() => setPreviewImage(null)}>
        <Pressable style={styles.previewOverlay} onPress={() => setPreviewImage(null)}>
          {previewImage && <Image source={{ uri: previewImage }} style={styles.previewImage} contentFit="contain" />}
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  submitButton: { marginBottom: 48 },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: { width: '90%', height: '80%', borderRadius: 32 },
});
