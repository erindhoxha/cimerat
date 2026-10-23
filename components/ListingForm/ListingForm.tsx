import { Box } from '@/components/Box';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Button } from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { Text } from '@/components/Text';
import { cities } from '@/constants/Cities';
import { neighborhoodOptions } from '@/constants/Neighborhoods';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePickerGrid } from '@/components/ImagePickerGrid/ImagePickerGrid';
import { DropdownField } from '@/components/DropdownController/DropdownController';
import { Listing } from '@/types';
import formSchema from './schema';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useDeleteListing } from '@/hooks/useDeleteListing';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { QuickPicks } from '@/components/QuickPicks/QuickPicks';
import { appendPhrase, LISTING_FEATURES, POPULAR_CITIES, PRICE_SUGGESTIONS } from '@/constants/QuickPicks';
import Colors from '@/constants/Colors';
import { genders } from '@/constants/Genders';
import { numriIDhomave, toCountOption } from '@/constants/NumberOfRooms';
import { ChoiceField } from '@/components/ChoiceChips/ChoiceChips';
import { cimerat } from '@/constants/NumberOfCimera';
import { WebView } from '../WebView/WebView';

interface ListingFormProps {
  defaultValues?: Partial<Listing>;
  onSubmit: (
    data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>,
    images: { uri: string; type?: string; name: string }[],
    /** Called with 0..1 while the photos upload */
    onProgress: (fraction: number) => void,
  ) => Promise<void>;
  isEditing?: boolean;
}

export function ListingForm({ defaultValues, onSubmit, isEditing = false }: ListingFormProps) {
  const [images, setImages] = useState<{ uri: string; type?: string; name: string }[]>(defaultValues?.images || []);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageError, setImageError] = useState<string | null>(null);
  const confirmDelete = useDeleteListing();
  const [picking, setPicking] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const router = useSafeRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
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
      flatmateGender: genders[2],
      ...defaultValues,
      rooms: toCountOption(defaultValues?.rooms),
      currentFlatmates: toCountOption(defaultValues?.currentFlatmates),
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

    // iOS can take a few seconds to hand back large/iCloud photos, so show a spinner meanwhile
    setPicking(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: Math.max(1, 10 - images.length),
      // The server resizes to 1600px anyway; a lighter file uploads much faster
      quality: 0.85,
    }).finally(() => setPicking(false));

    if (!result.canceled) {
      const existing = new Set(images.map((img) => img.uri));
      const newImages = [
        ...images,
        ...result.assets
          .filter((asset) => !existing.has(asset.uri))
          .map((asset, index) => ({
            type: asset.mimeType ?? 'image/jpeg',
            name: asset.fileName ?? `photo_${Date.now()}_${index}.jpg`,
            uri: asset.uri,
          })),
      ].slice(0, 10);
      setImages(newImages);
      setValue('images', newImages);
      setImageError(null);
      clearErrors('images');
    }
  };

  const selectedCity = watch('city');

  // New listings start with the phone saved on the profile
  const { data: currentUser } = useCurrentUser();
  const profilePhone = currentUser?.user?.phone;
  useEffect(() => {
    if (!isEditing && profilePhone && !getValues('phone')) setValue('phone', profilePhone);
  }, [profilePhone]);

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
            picking={picking}
            onPreview={setPreviewImage}
            onReorder={(from, to) => {
              const next = [...images];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              setImages(next);
              setValue('images', next, { shouldDirty: true });
            }}
            onRemove={(idx) => {
              const newImages = images.filter((_, i) => i !== idx);
              setImages(newImages);
              setValue('images', newImages);
            }}
            error={imageError || errors.images?.message}
          />

          <Box>
            <DropdownField
              control={control}
              name="city"
              label="Qyteti"
              options={cities}
              placeholder="Zgjedh Qytetin"
              error={errors.city?.message}
              onSelect={() => setValue('neighborhood', '')}
            />
            <QuickPicks
              options={POPULAR_CITIES}
              value={selectedCity}
              onPick={(city) => {
                setValue('city', city, { shouldValidate: true });
                setValue('neighborhood', '');
              }}
            />
          </Box>

          <DropdownField
            control={control}
            name="neighborhood"
            label="Lagja"
            options={neighborhoodOptions(selectedCity)}
            placeholder="Zgjedh Lagjën"
            disabled={!selectedCity}
            error={errors.neighborhood?.message}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Box>
                <Input
                  label="Përshkrimi"
                  placeholder="P.sh. Dhomë e ndritshme në banesë me 3 dhoma, kërkoj cimer/e të qetë..."
                  multiline
                  numberOfLines={20}
                  required
                  error={errors.description?.message}
                  value={value}
                  onChangeText={onChange}
                />
                <QuickPicks
                  // Hide phrases that are already in the text
                  options={LISTING_FEATURES.filter((f) => !(value ?? '').toLowerCase().includes(f.toLowerCase()))}
                  onPick={(phrase) => onChange(appendPhrase(value, phrase))}
                  format={(phrase) => `+ ${phrase}`}
                />
              </Box>
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <Box>
                <Input
                  value={value?.toString()}
                  label="Çmimi për muaj (€)"
                  maxLength={6}
                  required
                  placeholder="300"
                  keyboardType="numeric"
                  inputMode="numeric"
                  returnKeyType="done"
                  error={errors.price?.message}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                />
                <QuickPicks
                  options={PRICE_SUGGESTIONS}
                  value={value?.toString()}
                  onPick={onChange}
                  format={(price) => `${price}€`}
                />
              </Box>
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
                returnKeyType="done"
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

          <Box gap={18} style={styles.extraBox}>
            <Box gap={2}>
              <Text style={styles.extraTitle}>Detaje shtesë</Text>
              <Text style={styles.extraHint}>Opsionale, por ndihmojnë të gjeni cimerin e duhur.</Text>
            </Box>
            <ChoiceField
              control={control}
              name="flatmateGender"
              label="Gjinia e preferuar e cimerit"
              options={genders}
              equalWidth
            />
            <ChoiceField
              control={control}
              name="currentFlatmates"
              label="Sa cimerë jetojnë aktualisht?"
              options={cimerat}
              equalWidth
            />
            <ChoiceField
              control={control}
              name="rooms"
              label="Sa dhoma ka banesa?"
              options={numriIDhomave}
              equalWidth
            />
          </Box>

          {isSubmitting ? (
            <Box
              style={styles.progressButton}
              accessibilityRole="progressbar"
              accessibilityValue={{ now: Math.round((uploadProgress ?? 0) * 100), min: 0, max: 100 }}
            >
              <Box style={[styles.progressFill, { width: `${Math.max(4, (uploadProgress ?? 0) * 100)}%` }]} />
              <Box flexDirection="row" gap={8} alignItems="center">
                <ActivityIndicator color={Colors.onPrimary} size="small" />
                <Text style={styles.progressText}>
                  {uploadProgress === null || uploadProgress < 1
                    ? `Duke ngarkuar fotot… ${Math.round((uploadProgress ?? 0) * 100)}%`
                    : 'Duke përfunduar…'}
                </Text>
              </Box>
            </Box>
          ) : (
            <Button
              variant="primary"
              icon={isEditing ? 'checkmark' : 'cloud-upload-outline'}
              style={styles.submitButton}
              onPress={handleSubmit(async (data) => {
                setUploadProgress(0);
                try {
                  await onSubmit(data, images, setUploadProgress);
                } finally {
                  setUploadProgress(null);
                }
              })}
            >
              {isEditing ? 'Ruaj ndryshimet' : 'Publiko listimin'}
            </Button>
          )}

          {isEditing && (
            <Button
              variant="tertiary"
              icon="trash-outline"
              iconColor={Colors.danger}
              style={styles.deleteButton}
              onPress={() =>
                defaultValues?._id &&
                confirmDelete(defaultValues._id, () => {
                  router.dismissAll();
                  router.replace({ pathname: '/profile', params: { tab: 'listings' } });
                })
              }
            >
              <Text style={{ color: Colors.danger }}>Fshi listimin</Text>
            </Button>
          )}
        </Box>

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
  extraBox: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: Colors.border,
  },
  extraTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  extraHint: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  progressButton: {
    height: 52,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textFade,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
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
});
