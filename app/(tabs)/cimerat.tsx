import { useTabReselect } from '@/hooks/useTabReselect';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { View } from '@/components/View';
import { Loading } from '@/components/Loading/Loading';
import { CimerCard } from '@/components/CimerCard/CimerCard';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { CimerPost } from '@/types';
import { Select } from '@/components/Select/Select';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { ClearFiltersChip, FilterChip, filterBarStyles } from '@/components/FilterChip/FilterChip';
import { findPriceRange, PRICE_RANGES, PriceRangeLabel } from '@/constants/PriceRanges';
import { cities } from '@/constants/Cities';

const PAGE_SIZE = 10;

export default function CimeratScreen() {
  const router = useSafeRouter();
  const { token } = useAuth();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const listRef = useRef<FlatList>(null);
  // Tapping the tab again while on it scrolls back to the top
  useTabReselect('cimerat', () => listRef.current?.scrollToOffset({ offset: 0, animated: true }));
  const [selectedBudget, setSelectedBudget] = useState<PriceRangeLabel | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const activeFilters =
    (search ? 1 : 0) + (selectedCities.length > 0 ? 1 : 0) + (selectedBudget ? 1 : 0) + (selectedGender ? 1 : 0);
  const clearFilters = () => {
    setSearch('');
    setSelectedCities([]);
    setSelectedBudget(null);
    setSelectedGender(null);
  };

  const { data, isLoading, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    initialPageParam: 0,
    // Prefix stays ['cimerat'] so create/delete invalidation still matches
    queryKey: ['cimerat', selectedCities, selectedBudget, selectedGender, search],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), skip: String(pageParam) });
      selectedCities.forEach((city) => params.append('city', city));
      const budget = findPriceRange(selectedBudget);
      if (budget?.from) params.append('budgetFrom', String(budget.from));
      if (budget?.to) params.append('budgetTo', String(budget.to));
      if (selectedGender) params.append('gender', selectedGender);
      if (search) params.append('q', search);
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cimerat?${params.toString()}`);
      if (!res.ok) {
        return Promise.reject('Gjetja e cimerave ishte e pasuksesshme nga ana jonë.');
      }
      return res.json() as Promise<{ posts: CimerPost[]; total: number }>;
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, page) => acc + page.posts.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const total = data?.pages[0]?.total;

  return (
    <View style={styles.container}>
      <Box style={filterBarStyles.bar}>
        <SearchBar value={search} onSearch={setSearch} placeholder="Kërko qytet, emër, buxhet..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={filterBarStyles.row}>
          {activeFilters > 0 && <ClearFiltersChip count={activeFilters} onPress={clearFilters} />}
          <Select<string>
            multiple
            title="Ku kërkojnë dhomë?"
            placeholder="Qyteti"
            options={cities}
            value={selectedCities}
            onChange={setSelectedCities}
            renderTrigger={({ open, text }) => (
              <FilterChip icon="location-outline" label="Qyteti" value={text} onPress={open} />
            )}
          />
          <Select<PriceRangeLabel>
            clearable
            title="Buxheti për muaj"
            placeholder="Buxheti"
            options={PRICE_RANGES.map((range) => range.label)}
            value={selectedBudget}
            onChange={setSelectedBudget}
            renderTrigger={({ open, text }) => <FilterChip label="Buxheti" value={text} onPress={open} />}
          />
          <Select<string>
            clearable
            title="Gjinia"
            placeholder="Gjinia"
            options={['Mashkull', 'Femër']}
            value={selectedGender}
            onChange={setSelectedGender}
            renderTrigger={({ open, text }) => <FilterChip label="Gjinia" value={text} onPress={open} />}
          />
        </ScrollView>
      </Box>
      <FlatList
        ref={listRef}
        data={posts}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CimerCard post={item} />}
        ItemSeparatorComponent={() => <Box style={styles.separator} />}
        contentContainerStyle={styles.content}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <Box gap={14} marginBottom={20}>
            <Box>
              <Text style={styles.title}>Cimerat</Text>
              <Text style={styles.subtitle}>
                {total !== undefined && activeFilters > 0
                  ? `${total} ${total === 1 ? 'person' : 'persona'} sipas filtrave tuaj`
                  : 'Njerëz që kërkojnë dhomë. Nëse keni vend të lirë, kontaktoni direkt.'}
              </Text>
            </Box>
            <Button icon="add" onPress={() => router.push(token ? '/cimerat/create' : '/login')}>
              Posto veten si cimer
            </Button>
          </Box>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <Box marginVertical={16}>
              <Loading />
            </Box>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <Loading />
          ) : (
            <Box style={styles.empty}>
              <Box style={styles.emptyIcon}>
                <Ionicons name="people-outline" size={28} color={Colors.textMuted} />
              </Box>
              {activeFilters > 0 ? (
                <>
                  <Text style={styles.emptyTitle}>Asnjë rezultat</Text>
                  <Text style={styles.emptyText}>Provoni me filtra të tjerë.</Text>
                  <Button variant="tertiary" icon="close" onPress={clearFilters}>
                    Pastro filtrat
                  </Button>
                </>
              ) : (
                <>
                  <Text style={styles.emptyTitle}>Ende asnjë cimer</Text>
                  <Text style={styles.emptyText}>Bëhu i pari që poston veten dhe gjej dhomën tënde.</Text>
                </>
              )}
            </Box>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 21,
  },
  separator: {
    height: 16,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
