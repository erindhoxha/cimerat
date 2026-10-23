import { useEffect, useState } from 'react';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { RequireAuth } from '@/components/RequireAuth/RequireAuth';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { z } from 'zod';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import Input from '@/components/Input';
import { Avatar } from '@/components/Avatar/Avatar';
import { MyListings } from '@/components/MyListings/MyListings';
import { Loading } from '@/components/Loading/Loading';
import { WebView } from '@/components/WebView/WebView';
import { useAuth } from '@/context/AuthContext';
import { useConfirm } from '@/context/ConfirmProvider';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUploadAvatar } from '@/hooks/useUploadAvatar';
import { displayName } from '@/utils';
import Colors from '@/constants/Colors';

const detailsSchema = z.object({
  fullName: z.string().max(60, 'Emri i plotë mund të ketë deri në 60 karaktere'),
  phone: z.string().refine((val) => !val || isValidPhoneNumber(val, 'XK'), 'Numri duhet të jetë valid për Kosovë'),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Fjalëkalimi i vjetër duhet të ketë të paktën 6 karaktere'),
  newPassword: z.string().min(6, 'Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere'),
});

type Details = z.infer<typeof detailsSchema>;
type Passwords = z.infer<typeof passwordSchema>;

function ProfileScreenContent() {
  const queryClient = useQueryClient();
  const router = useSafeRouter();
  const { token, userId, username, setAuth } = useAuth();
  const confirm = useConfirm();
  // Opened with ?tab=listings after posting something, so it's right there
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<'listings' | 'profile'>(params.tab === 'profile' ? 'profile' : 'listings');
  const { data, isLoading } = useCurrentUser();
  const { pickAndUpload, isUploading } = useUploadAvatar();
  const user = data?.user;

  const detailsForm = useForm<Details>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { fullName: '', phone: '' },
  });

  const passwordForm = useForm<Passwords>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: '', newPassword: '' },
  });

  // Fill the form once the user has loaded
  useEffect(() => {
    if (user) detailsForm.reset({ fullName: user.fullName ?? '', phone: user.phone ?? '' });
  }, [user?.fullName, user?.phone]);

  const saveDetails = useMutation({
    mutationFn: async (values: Details) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) return Promise.reject(new Error(json.error || 'Gabim gjatë ruajtjes së profilit.'));
      return json;
    },
    onSuccess: () => {
      // The name is embedded in listings and posts too
      queryClient.invalidateQueries();
      Toast.show({ type: 'success', text1: 'Profili u ruajt' });
    },
  });

  const changePassword = useMutation({
    mutationFn: async (values: Passwords) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/edit-user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, oldPassword: values.oldPassword, password: values.newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        return Promise.reject(new Error(json.error || 'Gabim gjatë ndryshimit të fjalëkalimit.'));
      }
      return json;
    },
    onSuccess: () => {
      passwordForm.reset();
      Toast.show({ type: 'success', text1: 'Fjalëkalimi u ndryshua' });
    },
  });

  const signOut = async () => {
    const ok = await confirm({
      title: 'Dil nga llogaria?',
      message: 'Mund të hyni përsëri në çdo moment me kredencialet tuaja.',
      confirmLabel: 'Po, dil',
      destructive: true,
      icon: 'log-out-outline',
    });
    if (!ok) return;
    setAuth(null, null, null);
    queryClient.clear();
    router.replace('/');
  };

  if (isLoading || !user) return <Loading />;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <WebView>
        <Box alignItems="center" gap={4} marginBottom={20}>
          <TouchableOpacity
            onPress={pickAndUpload}
            disabled={isUploading}
            accessibilityLabel="Ndrysho foton e profilit"
          >
            <Avatar user={user} size={96} linked={false} />
            <Box style={styles.cameraBadge}>
              {isUploading ? (
                <ActivityIndicator size="small" color={Colors.onPrimary} />
              ) : (
                <Ionicons name="camera" size={16} color={Colors.onPrimary} />
              )}
            </Box>
          </TouchableOpacity>
          <Text style={styles.name}>{displayName(user)}</Text>
          <Text style={styles.handle}>@{user.username ?? username}</Text>
          <Text style={styles.linkText} onPress={() => router.push(`/user/${userId}`)}>
            Shiko profilin publik
          </Text>
        </Box>

        <Box style={styles.segmented} accessibilityRole="tablist">
          {(
            [
              ['listings', 'Listimet e mia'],
              ['profile', 'Profili'],
            ] as const
          ).map(([key, title]) => (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === key }}
              style={[styles.segment, tab === key && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, tab === key && styles.segmentTextActive]}>{title}</Text>
            </Pressable>
          ))}
        </Box>

        {tab === 'listings' ? (
          <MyListings />
        ) : (
          <>
            <Box style={styles.section}>
              <Text style={styles.sectionTitle}>Të dhënat personale</Text>

              <Box gap={6}>
                <Text style={styles.fieldLabel}>Emri i përdoruesit</Text>
                <Box style={styles.lockedField}>
                  <Text style={styles.lockedText}>{user.username}</Text>
                  <Ionicons name="lock-closed-outline" size={16} color={Colors.textMuted} />
                </Box>
                <Text style={styles.hint}>Emri i përdoruesit nuk mund të ndryshohet.</Text>
              </Box>

              <Controller
                control={detailsForm.control}
                name="fullName"
                render={({ field, fieldState }) => (
                  <Input
                    label="Emri i plotë"
                    placeholder="P.sh. Arta Krasniqi"
                    autoCapitalize="words"
                    autoComplete="name"
                    maxLength={60}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={detailsForm.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Input
                    label="Numri i telefonit"
                    placeholder="048123456 ose +38348123456"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    maxLength={15}
                    value={field.value}
                    onChangeText={(text) => field.onChange(text.replace(/[^0-9+]/g, ''))}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Text style={styles.hint}>
                Emri i plotë shfaqet në postimet tuaja. Numri plotësohet automatikisht kur postoni veten si cimer.
              </Text>
              {saveDetails.error && <Text style={styles.errorText}>{saveDetails.error.message}</Text>}
              <Button
                onPress={detailsForm.handleSubmit((values) => saveDetails.mutate(values))}
                disabled={saveDetails.isPending || !detailsForm.formState.isDirty}
              >
                {saveDetails.isPending ? <ActivityIndicator color={Colors.onPrimary} /> : 'Ruaj ndryshimet'}
              </Button>
            </Box>

            <Box style={styles.section}>
              <Text style={styles.sectionTitle}>Fjalëkalimi</Text>
              <Controller
                control={passwordForm.control}
                name="oldPassword"
                render={({ field, fieldState }) => (
                  <Input
                    label="Fjalëkalimi aktual"
                    placeholder="••••••"
                    secureTextEntry
                    value={field.value}
                    onChangeText={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={passwordForm.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Input
                    label="Fjalëkalimi i ri"
                    placeholder="Të paktën 6 karaktere"
                    secureTextEntry
                    value={field.value}
                    onChangeText={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
              {changePassword.error && <Text style={styles.errorText}>{changePassword.error.message}</Text>}
              <Button
                variant="tertiary"
                onPress={passwordForm.handleSubmit((values) => changePassword.mutate(values))}
                disabled={changePassword.isPending}
              >
                {changePassword.isPending ? <ActivityIndicator color={Colors.text} /> : 'Ndrysho fjalëkalimin'}
              </Button>
            </Box>

            <Box gap={12} marginBottom={40}>
              <Button variant="tertiary" icon="log-out-outline" iconColor={Colors.danger} onPress={signOut}>
                <Text style={{ color: Colors.danger }}>Dil nga profili</Text>
              </Button>
            </Box>
          </>
        )}
      </WebView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.text,
    marginTop: 10,
  },
  handle: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accentInk,
    marginTop: 6,
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.surface,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmented: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 20,
    borderRadius: 14,
    backgroundColor: Colors.lightGray,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: Colors.text,
  },
  section: {
    gap: 14,
    padding: 16,
    marginBottom: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textFade,
  },
  lockedField: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
  },
  lockedText: {
    fontSize: 15,
    color: Colors.textFade,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textMuted,
  },
  errorText: {
    color: Colors.danger,
  },
});

export default function ProfileScreen() {
  return (
    <RequireAuth reason="parë profilin">
      <ProfileScreenContent />
    </RequireAuth>
  );
}
