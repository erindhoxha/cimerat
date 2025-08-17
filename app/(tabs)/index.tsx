import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { CardItem } from '@/components/CardItem/CardItem';
import { useRouter } from 'expo-router';
import { Box } from '@/components/Box';
import Label from '@/components/Label/Label';
import { Text } from '@/components/Text';
import { cmimi } from '@/constants/Price';
import { cities } from '@/constants/Cities';
import { neighborhoods } from '@/constants/Neighborhoods';
import { useInfiniteQuery } from '@tanstack/react-query';
import { styles as dropdownStyles } from '@/components/DropdownController/styles';
import Colors from '@/constants/Colors';
import { Loading } from '@/components/Loading/Loading';
import * as Location from 'expo-location';
import { MultiSelect } from 'react-native-element-dropdown';
import { Pill } from '@/components/Pill/Pill';
import Input from '@/components/Input';
import { RefreshControl } from 'react-native-gesture-handler';

const PAGE_SIZE = 20;

interface SelectButtonProps {
  title: string | null;
  isOpened?: boolean;
  placeholder: string;
  disabled?: boolean;
}

const SelectButton = ({ title, isOpened, placeholder, disabled }: SelectButtonProps) => (
  <Box style={[dropdownStyles.dropdownButtonStyle, disabled ? dropdownStyles.dropdownButtonDisabledStyle : null]}>
    <Text
      style={[
        dropdownStyles.dropdownButtonTxtStyle,
        disabled ? dropdownStyles.dropdownButtonTxtDisabledStyle : null,
        {
          color: title ? '#000' : Colors.gray,
        },
      ]}
    >
      {title || placeholder}
    </Text>
    <Text>
      <FontAwesome color={Colors.gray} size={16} name="chevron-down" />
    </Text>
  </Box>
);

interface SelectItemProps {
  item: string | number;
  isSelected: boolean;
}

const SelectItem = ({ isSelected, item }: SelectItemProps) => {
  return (
    <Box style={[dropdownStyles.dropdownItemStyle, isSelected && dropdownStyles.dropdownItemSelected]}>
      <Text style={dropdownStyles.dropdownItemTxtStyle}>{item}</Text>
    </Box>
  );
};

export default function TabOneScreen() {
  const [disabled, setDisabled] = useState(true);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedPriceFrom, setSelectedPriceFrom] = useState<number | null>(null);
  const [selectedPriceTo, setSelectedPriceTo] = useState<number | null>(null);

  const cityRef = useRef<SelectDropdown>(null);
  const neighborHoodRef = useRef<SelectDropdown>(null);

  const router = useRouter();

  useEffect(() => {
    if (router.canGoBack()) {
      router.dismissAll();
      router.replace('/');
    }
  }, []);

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
            setDisabled(false);
          }
        }
      }
      setLocationLoading(false);
    };
    getCity();
  }, []);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['listings', selectedCities, selectedNeighborhoods, selectedPriceFrom, selectedPriceTo],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching listings with params:', {
        selectedCities,
        selectedNeighborhoods,
        selectedPriceFrom,
        selectedPriceTo,
      });
      const params = new URLSearchParams();
      selectedCities.forEach((city) => params.append('city', city));
      selectedNeighborhoods.forEach((n) => params.append('neighborhood', n));
      if (selectedPriceFrom) params.append('priceFrom', String(selectedPriceFrom));
      if (selectedPriceTo) params.append('priceTo', String(selectedPriceTo));
      params.append('limit', String(PAGE_SIZE));
      params.append('skip', String(pageParam));
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listings?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, page) => acc + page.listings.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
  });

  const listings = data?.pages.flatMap((page) => page.listings) ?? [];

  {
    locationLoading && (
      <Box marginTop={24}>
        <Loading />
      </Box>
    );
  }

  return (
    <Box style={styles.container}>
      <FlatList
        data={listings}
        renderItem={({ item }) => <CardItem {...item} key={item.id} />}
        contentContainerStyle={styles.contentContainerStyle}
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
            <Box marginTop={24}>
              <Text>Asnjë rezultat.</Text>
            </Box>
          )
        }
        ListHeaderComponent={() => (
          <Box gap={12}>
            <Box flex={1} flexDirection="row" gap={12}>
              <Box flex={1}>
                <Label>Qyteti</Label>
                <MultiSelect
                  style={dropdownStyles.multiSelectStyle}
                  data={cities.map((c) => ({ label: c, value: c }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Zgjedh Qytetet"
                  placeholderStyle={dropdownStyles.placeholderStyle}
                  value={selectedCities}
                  onChange={(value) => {
                    setSelectedCities(value);
                    if (value.length === 0) {
                      setSelectedNeighborhoods([]);
                    }
                  }}
                  showsVerticalScrollIndicator
                  renderRightIcon={() => (
                    <Box marginRight={12}>
                      <FontAwesome name="chevron-down" size={16} color={Colors.gray} />
                    </Box>
                  )}
                  renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity
                      onPress={unSelect}
                      style={{
                        marginTop: 4,
                        marginRight: 4,
                      }}
                    >
                      <Pill title={item.label} iconLeft={<FontAwesome name="times" size={12} color="#000" />} />
                    </TouchableOpacity>
                  )}
                  renderInputSearch={(onSearch) => (
                    <Box padding={12}>
                      <Input autoFocus placeholder="Kërko lagjet..." onChangeText={onSearch} />
                    </Box>
                  )}
                  search
                  searchPlaceholder="Kërko qytetet..."
                />
              </Box>
              <Box flex={1}>
                <Label>Lagja</Label>
                <MultiSelect
                  style={[
                    dropdownStyles.multiSelectStyle,
                    selectedCities.length === 0 && dropdownStyles.disabledMultiSelectStyle,
                  ]}
                  showsVerticalScrollIndicator
                  data={
                    selectedCities.length > 0
                      ? selectedCities.flatMap((city) =>
                          (neighborhoods[city] || []).map((n) => ({ label: n, value: n })),
                        )
                      : []
                  }
                  renderRightIcon={() => (
                    <Box marginRight={12}>
                      <FontAwesome name="chevron-down" size={16} color={Colors.gray} />
                    </Box>
                  )}
                  labelField="label"
                  valueField="value"
                  disable={selectedCities.length === 0}
                  placeholder="Zgjedh Lagjet"
                  placeholderStyle={dropdownStyles.placeholderStyle}
                  value={selectedNeighborhoods}
                  onChange={setSelectedNeighborhoods}
                  dropdownPosition="bottom"
                  renderInputSearch={(onSearch) => (
                    <Box padding={12}>
                      <Input autoFocus placeholder="Kërko lagjet..." onChangeText={onSearch} />
                    </Box>
                  )}
                  selectedStyle={dropdownStyles.dropdownItemSelected}
                  renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity
                      onPress={unSelect}
                      style={{
                        marginTop: 4,
                        marginRight: 4,
                      }}
                    >
                      <Pill title={item.label} iconLeft={<FontAwesome name="times" size={12} color="#000" />} />
                    </TouchableOpacity>
                  )}
                  search
                  searchPlaceholder="Kërko lagjet..."
                />
              </Box>
            </Box>
            <Box>
              <Label>Çmimi për muaj</Label>
              <Box flex={1} flexDirection="row" gap={12}>
                <Box flex={1} style={styles.flexShrink}>
                  <SelectDropdown
                    data={cmimi}
                    onSelect={(selectedItem) => {
                      setSelectedPriceFrom((prev) => {
                        if (prev === selectedItem) {
                          return null;
                        }
                        return selectedItem;
                      });
                      if (selectedPriceTo && selectedItem > selectedPriceTo) {
                        setSelectedPriceTo(null);
                      }
                    }}
                    defaultValue={selectedPriceFrom}
                    renderButton={(_, isOpened) => (
                      <>
                        <SelectButton
                          title={(selectedPriceFrom && 'Nga ' + selectedPriceFrom + '€') || ''}
                          isOpened={isOpened}
                          placeholder="Nga"
                        />
                      </>
                    )}
                    renderItem={(item, _, isSelected) => (
                      <>
                        <SelectItem item={item} isSelected={isSelected} />
                      </>
                    )}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={dropdownStyles.dropdownMenuStyle}
                  />
                </Box>
                <Box flex={1} style={styles.flexShrink}>
                  <SelectDropdown
                    data={selectedPriceFrom == null ? cmimi : cmimi.filter((price) => price > selectedPriceFrom)}
                    onSelect={(selectedItem) => {
                      setSelectedPriceTo((prev) => {
                        if (prev === selectedItem) {
                          return null;
                        }
                        return selectedItem;
                      });
                    }}
                    defaultValue={selectedPriceTo}
                    renderButton={(_, isOpened) => (
                      <>
                        <SelectButton
                          title={(selectedPriceTo && 'Deri në ' + selectedPriceTo + '€') || ''}
                          isOpened={isOpened}
                          placeholder="Deri në"
                        />
                      </>
                    )}
                    renderItem={(item, _, isSelected) => (
                      <>
                        <SelectItem item={item} isSelected={isSelected} />
                      </>
                    )}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={dropdownStyles.dropdownMenuStyle}
                  />
                </Box>
              </Box>
            </Box>
            {(selectedPriceFrom !== null ||
              selectedPriceTo !== null ||
              selectedCities.length > 0 ||
              selectedNeighborhoods.length > 0) && (
              <Box flexDirection="row" justifyContent="flex-end" alignItems="flex-end">
                <Text
                  style={styles.filter}
                  onPress={() => {
                    setSelectedCities([]);
                    setSelectedNeighborhoods([]);
                    setSelectedPriceFrom(null);
                    setSelectedPriceTo(null);
                  }}
                >
                  Pastro filtrat
                </Text>
              </Box>
            )}
          </Box>
        )}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainerStyle: {
    padding: 20,
    paddingBottom: 80,
  },
  flexShrink: {
    flexShrink: 1,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
  },
  filter: {
    padding: 8,
    borderRadius: 8,
    textDecorationLine: 'underline',
  },
});
