import { Box } from '@/components/Box';
import { Button } from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { Text } from '@/components/Text';
import { cities } from '@/constants/Cities';
import { neighborhoods } from '@/constants/Neighborhoods';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { genders } from '@/constants/Genders';
import { numriIDhomave } from '@/constants/NumberOfRooms';
import { cimerat } from '@/constants/NumberOfCimera';
import { useQueryClient } from '@tanstack/react-query';
import { WebView } from '../WebView/WebView';
import { FontAwesome } from '@expo/vector-icons';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuth();
  const client = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    shouldFocusError: true,
    defaultValues: {
      city: '',
      neighborhood: '',
      description: '',
      price: undefined,
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
      clearErrors('images');
    }
  };

  const selectedCity = watch('city');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <WebView>
        <Box marginBottom={20}>
          <Text fontSize="xl" fontWeight="bold">
            {isEditing ? 'Modifiko Listimin' : 'Krijo Listimin'}
          </Text>
        </Box>
        <Box gap={12} paddingBottom={80}>
          <ImagePickerGrid
            images={images}
            onPick={pickImage}
            onPreview={setPreviewImage}
            onRemove={(idx) => {
              const newImages = images.filter((_, i) => i !== idx);
              setImages(newImages);
              setValue('images', newImages);
            }}
            error={imageError || errors.images?.message}
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
            onSelect={() => setValue('neighborhood', '')}
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
                value={value?.toString()}
                label="Çmimi në euro (€)"
                maxLength={6}
                required
                placeholder="300"
                keyboardType="numeric"
                inputMode="numeric"
                error={errors.price?.message}
                onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Numri i telefonit është i detyrueshëm',
              validate: (value) => isValidPhoneNumber(value, 'XK') || 'Numri duhet të jetë valid për Kosovë',
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
                onChangeText={(text) => onChange(text.replace(/[^0-9+]/g, ''))}
              />
            )}
          />

          <Box
            gap={12}
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: Colors.lightGray,
            }}
          >
            <Text fontSize="md" fontWeight="bold">
              Extra, opsionale
            </Text>
            <Text
              style={{
                borderBottomWidth: 1,
                paddingBottom: 12,
                borderColor: Colors.lightGray,
              }}
            >
              Nuk është e nevojshme të plotësoni këto fusha, por mund t'ju ndihmojë të gjeni bashkëbanuesin/es më të
              përshtatshëm.
            </Text>
            <DropdownField
              control={control}
              name="flatmateGender"
              label="Gjinia e preferuar e bashkëbanuesit/es"
              options={genders}
              placeholder="Zgjedh gjininë"
              defaultValue={genders[2]}
              error={errors.flatmateGender?.message}
            />

            <DropdownField
              control={control}
              name="currentFlatmates"
              label="Numri i bashkëbanuesve ekzistues"
              options={cimerat}
              placeholder="Zgjedh numrin"
              error={errors.currentFlatmates?.message}
            />

            <DropdownField
              control={control}
              name="rooms"
              label="Numri i dhomave në total"
              options={numriIDhomave}
              placeholder="Zgjedh numrin"
              error={errors.rooms?.message}
            />
          </Box>

          <Button
            variant="primary"
            style={styles.submitButton}
            onPress={handleSubmit((data) => onSubmit(data, images))}
          >
            {isSubmitting ? (
              <Box flexDirection="row" gap={4} alignItems="center">
                <Text>{isEditing ? 'Duke Ndryshuar...' : 'Duke Krijuar...'}</Text>
                <ActivityIndicator color="#000" />
              </Box>
            ) : isEditing ? (
              'Modifiko Listimin'
            ) : (
              'Krijo Listimin'
            )}
          </Button>

          {isEditing && (
            <Button variant="danger" style={styles.deleteButton} onPress={() => setModalOpen(true)}>
              Fshi Listimin
            </Button>
          )}
        </Box>
        {/* Delete Confirmation Modal */}
        <Modal
          visible={modalOpen}
          onDismiss={() => setModalOpen(false)}
          onRequestClose={() => setModalOpen(!modalOpen)}
          transparent
          presentationStyle="overFullScreen"
        >
          <TouchableOpacity onPressOut={() => setModalOpen(false)} activeOpacity={1} style={styles.modalOverlay}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <Box marginBottom={8}>
                <FontAwesome name="question" size={32} />
              </Box>
              <Text fontSize="lg" fontWeight="bold" style={styles.modalTitle}>
                A jeni të sigurtë që dëshironi të fshini këtë listim?
              </Text>
              <Text style={styles.modalSubtitle}>
                Listimi do të fshihet përgjithmonë dhe nuk do të jetë më i disponueshëm për përdoruesit e tjerë.
              </Text>
              <Box
                marginTop={12}
                gap={12}
                flexDirection="row"
                width="100%"
                justifyContent="center"
                alignItems="center"
                style={styles.modalButtonRow}
              >
                <Button style={styles.flex1} variant="tertiary" onPress={() => setModalOpen(false)}>
                  <Text>Jo, anulo</Text>
                </Button>
                <Button
                  style={styles.flex1}
                  variant="danger"
                  disabled={loading}
                  onPress={async () => {
                    try {
                      setLoading(true);
                      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listings/${defaultValues?._id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (!res.ok) return Promise.reject('Failed to delete listing');
                      Toast.show({ type: 'success', text1: 'Listimi u fshi me sukses' });
                      client.invalidateQueries({ queryKey: ['listings'] });
                      router.dismissAll();
                      router.push('/your-listings');
                    } catch (error) {
                      Toast.show({ type: 'error', text1: 'Gabim gjatë fshirjes së listimit' });
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Text>{loading ? 'Duke fshirë...' : 'Po, fshije'}</Text>
                </Button>
              </Box>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Preview Image Modal */}
        <Modal visible={!!previewImage} transparent animationType="fade" onRequestClose={() => setPreviewImage(null)}>
          <Pressable style={styles.previewOverlay} onPress={() => setPreviewImage(null)}>
            {previewImage && <Image source={{ uri: previewImage }} style={styles.previewImage} contentFit="contain" />}
          </Pressable>
        </Modal>
      </WebView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, height: '100%', backgroundColor: 'white' },
  contentContainer: {
    minHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  submitButton: { marginBottom: 0 },
  deleteButton: {
    marginTop: 12,
    marginBottom: 48,
    color: Colors.danger,
    textAlign: 'center',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: { width: '90%', height: '80%', borderRadius: 32 },
  modalOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    maxWidth: '90%',
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    alignSelf: 'center',
  },
  modalTitle: { textAlign: 'center' },
  modalSubtitle: { textAlign: 'center', marginTop: 12 },
  modalButtonRow: { position: 'relative' },
  flex1: { flex: 1 },
});
