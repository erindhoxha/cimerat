import { useEffect } from 'react';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { RequireAuth } from '@/components/RequireAuth/RequireAuth';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isValidPhoneNumber } from 'libphonenumber-js';
import Toast from 'react-native-toast-message';
import { z } from 'zod';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import Input from '@/components/Input';
import { Avatar } from '@/components/Avatar/Avatar';
import { WebView } from '@/components/WebView/WebView';
import { DropdownField } from '@/components/DropdownController/DropdownController';
import { ChoiceField } from '@/components/ChoiceChips/ChoiceChips';
import { QuickPicks } from '@/components/QuickPicks/QuickPicks';
import { appendPhrase, CIMER_TRAITS, POPULAR_CITIES, PRICE_SUGGESTIONS } from '@/constants/QuickPicks';
import { useAuth } from '@/context/AuthContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUploadAvatar } from '@/hooks/useUploadAvatar';
import { cities } from '@/constants/Cities';
import Colors from '@/constants/Colors';
import { CimerPost } from '@/types';

const formSchema = z.object({
  city: z.string().min(1, 'Qyteti është i detyrueshëm'),
  budget: z.string().min(1, 'Buxheti është i detyrueshëm'),
  description: z.string().min(20, 'Shkruani të paktën 20 karaktere për veten'),
  gender: z.string().optional(),
  age: z.string().optional(),
  phone: z
    .string()
    .min(1, 'Numri i telefonit është i detyrueshëm që të mund t’ju kontaktojnë')
    .refine((val) => isValidPhoneNumber(val, 'XK'), 'Numri duhet të jetë valid për Kosovë'),
});

type FormValues = z.infer<typeof formSchema>;

function CreateCimerPostScreenContent() {
  const router = useSafeRouter();
  const queryClient = useQueryClient();
  // Opened with ?id=… from "Modifiko" on an existing post
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const { token } = useAuth();
  const { data: currentUser } = useCurrentUser();
  const { pickAndUpload, isUploading } = useUploadAvatar();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { city: '', budget: '', description: '', gender: '', age: '', phone: '' },
  });

  const { data: existing } = useQuery<CimerPost>({
    queryKey: ['cimer-post', id],
    enabled: isEditing,
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cimerat/${id}`);
      if (!res.ok) return Promise.reject(new Error('Postimi nuk u gjet.'));
      return res.json();
    },
  });

  useEffect(() => {
    if (!existing) return;
    reset({
      city: existing.city,
      budget: String(existing.budget),
      description: existing.description,
      gender: existing.gender ?? '',
      age: existing.age ? String(existing.age) : '',
      phone: existing.phone ?? '',
    });
  }, [existing?._id]);

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cimerat${isEditing ? `/${id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...values,
          budget: Number(values.budget),
          age: values.age ? Number(values.age) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) return Promise.reject(json.error || 'Gabim gjatë krijimit të postimit.');
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cimerat'] });
      queryClient.invalidateQueries({ queryKey: ['public-user'] });
      queryClient.invalidateQueries({ queryKey: ['cimer-post', id] });
      Toast.show({ type: 'success', text1: isEditing ? 'Postimi u ruajt' : 'Postimi u publikua' });
      router.replace({ pathname: '/profile', params: { tab: 'listings' } });
    },
    onError: (error) => {
      Toast.show({ type: 'error', text1: typeof error === 'string' ? error : 'Gabim gjatë krijimit të postimit' });
    },
  });

  const user = currentUser?.user;

  // Prefill the phone saved on the profile, without overwriting anything typed already
  useEffect(() => {
    if (!isEditing && user?.phone && !getValues('phone')) setValue('phone', user.phone);
  }, [user?.phone]);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <WebView>
        <Text style={styles.title}>{isEditing ? 'Modifiko postimin' : 'Posto veten si cimer'}</Text>
        <Text style={styles.subtitle}>Tregoni pak për veten që pronarët dhe cimerat e tjerë t'ju gjejnë më lehtë.</Text>

        <Box style={styles.photoRow}>
          <Avatar user={user} size={64} linked={false} />
          <Box flex={1}>
            <Text style={styles.photoTitle}>{user?.avatar ? 'Fotoja juaj' : 'Shtoni një foto'}</Text>
            <Text style={styles.photoText}>Postimet me foto marrin më shumë përgjigje.</Text>
          </Box>
          <TouchableOpacity style={styles.photoButton} onPress={pickAndUpload} disabled={isUploading}>
            {isUploading ? (
              <ActivityIndicator size="small" color={Colors.text} />
            ) : (
              <Text style={styles.photoButtonText}>{user?.avatar ? 'Ndrysho' : 'Ngarko'}</Text>
            )}
          </TouchableOpacity>
        </Box>

        <Box gap={16}>
          <Box>
            <DropdownField
              control={control}
              name="city"
              label="Ku kërkoni dhomë?"
              options={cities}
              placeholder="Zgjedh qytetin"
              error={errors.city?.message}
            />
            <QuickPicks
              options={POPULAR_CITIES}
              value={watch('city')}
              onPick={(city) => setValue('city', city, { shouldValidate: true })}
            />
          </Box>

          <Controller
            control={control}
            name="budget"
            render={({ field: { onChange, value } }) => (
              <Box>
                <Input
                  label="Buxheti maksimal (€/muaj)"
                  required
                  placeholder="200"
                  keyboardType="numeric"
                  inputMode="numeric"
                  maxLength={5}
                  value={value}
                  error={errors.budget?.message}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                />
                <QuickPicks options={PRICE_SUGGESTIONS} value={value} onPick={onChange} format={(p) => `${p}€`} />
              </Box>
            )}
          />

          <Box flexDirection="row" gap={12} alignItems="flex-start">
            <Box width={96}>
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Mosha"
                    placeholder="24"
                    keyboardType="numeric"
                    inputMode="numeric"
                    maxLength={2}
                    value={value}
                    error={errors.age?.message}
                    onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                  />
                )}
              />
            </Box>
            <Box flex={1}>
              <ChoiceField control={control} name="gender" label="Gjinia" options={['Mashkull', 'Femër']} equalWidth />
            </Box>
          </Box>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Box>
                <Input
                  label="Rreth jush"
                  required
                  multiline
                  placeholder="P.sh. Jam student në vitin e tretë, punoj me orar të plotë, jam i qetë dhe i rregullt..."
                  value={value}
                  error={errors.description?.message}
                  onChangeText={onChange}
                />
                <QuickPicks
                  options={CIMER_TRAITS.filter((t) => !(value ?? '').toLowerCase().includes(t.toLowerCase()))}
                  onPick={(trait) => onChange(appendPhrase(value, trait))}
                  format={(trait) => `+ ${trait}`}
                />
              </Box>
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Numri i telefonit"
                required
                placeholder="048123456 ose +38348123456"
                keyboardType="phone-pad"
                maxLength={15}
                value={value}
                error={errors.phone?.message}
                onChangeText={(text) => onChange(text.replace(/[^0-9+]/g, ''))}
              />
            )}
          />

          <Button onPress={handleSubmit((values) => createPost(values))} disabled={isPending}>
            {isPending ? (
              <ActivityIndicator color={Colors.onPrimary} />
            ) : isEditing ? (
              'Ruaj ndryshimet'
            ) : (
              'Publiko postimin'
            )}
          </Button>
        </Box>
      </WebView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: Colors.textMuted,
    marginTop: 4,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginVertical: 20,
    borderRadius: 16,
    backgroundColor: Colors.background,
  },
  photoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  photoText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  photoButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    minWidth: 76,
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default function CreateCimerPostScreen() {
  return (
    <RequireAuth reason="postuar veten si cimer">
      <CreateCimerPostScreenContent />
    </RequireAuth>
  );
}
