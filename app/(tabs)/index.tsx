import { useTabReselect } from '@/hooks/useTabReselect';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { cities } from '@/constants/Cities';
import { neighborhoodOptions } from '@/constants/Neighborhoods';
import { neighborhoodId, parseNeighborhoodId } from '@/constants/NeighborhoodIds';
import { useInfiniteQuery } from '@tanstack/react-query';
import Colors from '@/constants/Colors';
import { Loading } from '@/components/Loading/Loading';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import { View } from '@/components/View';
import { WebView } from '@/components/WebView/WebView';
import { numriIDhomave } from '@/constants/NumberOfRooms';
import { cimerat } from '@/constants/NumberOfCimera';
import { MobileCardItem } from '@/components/CardItem/MobileCardItem';
import { Select } from '@/components/Select/Select';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { ClearFiltersChip, FilterChip, filterBarStyles } from '@/components/FilterChip/FilterChip';
import { findPriceRange, PRICE_RANGES, PriceRangeLabel } from '@/constants/PriceRanges';
import { Button } from '@/components/Button';

const PAGE_SIZE = 5;

const MemoMobileCardItem = React.memo(MobileCardItem);

export default function TabOneScreen() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const listRef = useRef<FlatList>(null);
  // Tapping the tab again while on it scrolls back to the top
  useTabReselect('index', () => listRef.current?.scrollToOffset({ offset: 0, animated: true }));
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<PriceRangeLabel | null>(null);
  const [search, setSearch] = useState('');

  const [selectedNumberOfRooms, setSelectedNumberOfRooms] = useState<string | null>(null);
  const [selectedNumberOfFlatmates, setSelectedNumberOfFlatmates] = useState<string | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const getCity = async () => {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      let reverse = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverse && reverse.length > 0) {
        const userCity = reverse[0].city;
        if (userCity) {
          const matchedCity = cities.find((c) => c.toLowerCase() === userCity.toLowerCase());
          if (matchedCity) {
            setSelectedCities([matchedCity]);
          }
        }
      }
      setLocationLoading(false);
    };
    getCity();
  }, []);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [
      'listings',
      selectedCities,
      selectedNeighborhoods,
      selectedPrice,
      search,
      selectedNumberOfRooms,
      selectedNumberOfFlatmates,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      selectedCities.forEach((city) => params.append('city', city));
      selectedNeighborhoods.forEach((n) => params.append('neighborhood', n));
      if (search) params.append('q', search);
      const priceRange = findPriceRange(selectedPrice);
      if (priceRange?.from) params.append('priceFrom', String(priceRange.from));
      if (priceRange?.to) params.append('priceTo', String(priceRange.to));
      if (selectedNumberOfRooms) params.append('numberOfRooms', String(selectedNumberOfRooms));
      if (selectedNumberOfFlatmates) params.append('numberOfFlatmates', String(selectedNumberOfFlatmates));
      params.append('limit', String(PAGE_SIZE));
      params.append('skip', String(pageParam));
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listings?${params.toString()}`);
      if (!res.ok) {
        return Promise.reject('Gjetja e listimeve ishte e pasuksesshëm nga ana jonë.');
      }
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, page) => acc + page.listings.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
  });

  const listings = data?.pages.flatMap((page) => page.listings) ?? [];

  const { token, username } = useAuth();

  const isLoggedIn = !!token && username;

  const total: number | undefined = data?.pages[0]?.total;

  const activeFilters =
    (search ? 1 : 0) +
    (selectedCities.length > 0 ? 1 : 0) +
    (selectedNeighborhoods.length > 0 ? 1 : 0) +
    (selectedPrice ? 1 : 0) +
    (selectedNumberOfRooms ? 1 : 0) +
    (selectedNumberOfFlatmates ? 1 : 0);

  const clearFilters = () => {
    setSearch('');
    setSelectedCities([]);
    setSelectedNeighborhoods([]);
    setSelectedPrice(null);
    setSelectedNumberOfRooms(null);
    setSelectedNumberOfFlatmates(null);
  };

  return (
    <View style={[styles.container]}>
      <WebView noPadding>
        {/* Kept outside the list so the filters stay visible while scrolling */}
        <Box style={filterBarStyles.bar}>
          <SearchBar value={search} onSearch={setSearch} placeholder="Kërko qytet, lagje, çmim..." />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={filterBarStyles.row}>
            {activeFilters > 0 && <ClearFiltersChip count={activeFilters} onPress={clearFilters} />}
            <Select<string>
              multiple
              title="Zgjedh qytetet"
              placeholder="Qyteti"
              options={cities}
              value={selectedCities}
              onChange={(value) => {
                setSelectedCities(value);
                // Drop neighborhoods that no longer belong to a selected city
                setSelectedNeighborhoods((prev) => prev.filter((id) => value.includes(parseNeighborhoodId(id).city)));
              }}
              renderTrigger={({ open, text }) => (
                <FilterChip icon="location-outline" label="Qyteti" value={text} onPress={open} />
              )}
            />
            <Select<string>
              multiple
              title="Zgjedh lagjet"
              placeholder="Lagja"
              // Ids are "City|Name" so equal names in different cities stay separate
              options={selectedCities.flatMap((city) => neighborhoodOptions(city).map((n) => neighborhoodId(city, n)))}
              formatOption={(id) => {
                const { city, name } = parseNeighborhoodId(id);
                return selectedCities.length > 1 ? `${name} · ${city}` : name;
              }}
              value={selectedNeighborhoods}
              onChange={setSelectedNeighborhoods}
              renderTrigger={({ open, text }) => (
                <FilterChip
                  label="Lagja"
                  value={text}
                  onPress={open}
                  // Neighborhoods depend on the city: look disabled until one is picked, and say why on tap
                  disabled={selectedCities.length === 0}
                  onDisabledPress={() => Toast.show({ type: 'info', text1: 'Zgjidhni fillimisht qytetin' })}
                />
              )}
            />
            <Select<PriceRangeLabel>
              clearable
              title="Çmimi për muaj"
              placeholder="Çmimi"
              options={PRICE_RANGES.map((range) => range.label)}
              value={selectedPrice}
              onChange={setSelectedPrice}
              renderTrigger={({ open, text }) => <FilterChip label="Çmimi" value={text} onPress={open} />}
            />
            <Select<string>
              clearable
              title="Numri i dhomave"
              placeholder="Dhoma"
              options={numriIDhomave}
              formatOption={(n) => `${n} dhoma`}
              value={selectedNumberOfRooms}
              onChange={setSelectedNumberOfRooms}
              renderTrigger={({ open, text }) => <FilterChip label="Dhoma" value={text} onPress={open} />}
            />
            <Select<string>
              clearable
              title="Numri i cimerave"
              placeholder="Cimerë"
              options={cimerat}
              formatOption={(n) => `${n} cimerë`}
              value={selectedNumberOfFlatmates}
              onChange={setSelectedNumberOfFlatmates}
              renderTrigger={({ open, text }) => <FilterChip label="Cimerë" value={text} onPress={open} />}
            />
          </ScrollView>
        </Box>
        <FlatList
          ref={listRef}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={true}
          scrollEnabled
          data={listings}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          // Without a key, a new listing at the top reuses the first card's state (e.g. a failed image)
          keyExtractor={(item) => item._id}
          progressViewOffset={-5}
          numColumns={1}
          renderItem={({ item }) => <Box style={styles.cardRow}>{<MemoMobileCardItem {...item} />}</Box>}
          contentContainerStyle={[styles.contentContainerStyle]}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={refetch}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Box marginVertical={16}>
                <Loading />
              </Box>
            ) : null
          }
          ListEmptyComponent={() =>
            isLoading ? (
              <Box marginTop={24}>
                <Loading />
              </Box>
            ) : (
              <Box marginTop={0} width="auto" style={styles.emptyWrapper}>
                <Ionicons name="search-outline" size={28} color={Colors.textMuted} />
                <Text
                  style={{
                    textAlign: 'center',
                    color: Colors.textMuted,
                  }}
                >
                  Asnjë rezultat. Ju lutem provoni me filtera tjera ose provoni më vonë.
                </Text>
                {activeFilters > 0 && (
                  <Button variant="tertiary" icon="close" onPress={clearFilters}>
                    Pastro filtrat
                  </Button>
                )}
              </Box>
            )
          }
          ListHeaderComponent={
            <Box gap={4} marginBottom={6}>
              {isLoggedIn && (
                <Text style={styles.greeting}>
                  Përshëndetje, <Text style={styles.greetingName}>{username}</Text>
                </Text>
              )}
              {total !== undefined && (
                <Text style={styles.resultCount}>
                  {total === 1 ? '1 dhomë' : `${total} dhoma`}
                  {activeFilters > 0 ? ' sipas filtrave tuaj' : ' të disponueshme'}
                </Text>
              )}
            </Box>
          }
        />
      </WebView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainerStyle: {
    paddingBottom: 80,
    padding: 20,
  },
  filter: {
    padding: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accentInk,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: -0.4,
    color: Colors.textMuted,
  },
  greetingName: {
    fontWeight: '800',
    color: Colors.text,
  },
  cardRow: {
    paddingVertical: 10,
  },
  emptyWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    gap: 12,
  },
});
