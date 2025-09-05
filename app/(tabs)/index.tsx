import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { MobileCardItem } from '@/components/CardItem/CardItem';
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
import { useAuth } from '@/context/AuthContext';
import { View } from '@/components/View';
import { WebView } from '@/components/WebView/WebView';
import { CardItemWebView } from '@/components/CardItem/CardItemWebView';
import { AccordionView } from '@/components/Accordion';
import { numriIDhomave } from '@/constants/NumberOfRooms';
import { cimerat } from '@/constants/NumberOfCimera';

const PAGE_SIZE = 20;

interface SelectButtonProps {
  title: string | null;
  isOpened?: boolean;
  placeholder: string;
  disabled?: boolean;
}

const SelectButton = ({ title, placeholder, disabled }: SelectButtonProps) => (
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
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedPriceFrom, setSelectedPriceFrom] = useState<number | null>(null);
  const [selectedPriceTo, setSelectedPriceTo] = useState<number | null>(null);

  const [selectedNumberOfRooms, setSelectedNumberOfRooms] = useState<number | null>(null);
  const [selectedNumberOfFlatmates, setSelectedNumberOfFlatmates] = useState<number | null>(null);

  const [accordionOpen, setAccordionOpen] = useState(false); // or false if you want it closed by default
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
      selectedPriceFrom,
      selectedPriceTo,
      selectedNumberOfRooms,
      selectedNumberOfFlatmates,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      selectedCities.forEach((city) => params.append('city', city));
      selectedNeighborhoods.forEach((n) => params.append('neighborhood', n));
      if (selectedPriceFrom) params.append('priceFrom', String(selectedPriceFrom));
      if (selectedPriceTo) params.append('priceTo', String(selectedPriceTo));
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

  {
    locationLoading && (
      <Box marginTop={24}>
        <Loading />
      </Box>
    );
  }

  const showFilter =
    (selectedNumberOfRooms !== null && selectedNumberOfRooms !== undefined) ||
    (selectedNumberOfFlatmates !== null && selectedNumberOfFlatmates !== undefined) ||
    (selectedPriceFrom !== null && selectedPriceFrom !== undefined) ||
    (selectedPriceTo !== null && selectedPriceTo !== undefined) ||
    selectedCities.length > 0 ||
    selectedNeighborhoods.length > 0;

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const numColumns = useMemo(() => {
    if (!isWeb) return 1;
    if (width >= 1200) return 1;
    if (width >= 800) return 1;
    return 1;
  }, [width, isWeb]);

  const Component = isWeb ? ScrollView : View;

  return (
    <Component style={[styles.container]}>
      <WebView noPadding>
        <FlatList
          scrollEnabled
          data={listings}
          progressViewOffset={-5}
          numColumns={numColumns}
          key={numColumns}
          renderItem={({ item }) => (
            <Box
              style={
                isWeb && numColumns > 1
                  ? {
                      flex: 1,
                      maxWidth: `${100 / numColumns}%`,
                      flexBasis: `${100 / numColumns}%`,
                      boxSizing: 'border-box',
                    }
                  : isWeb
                  ? { width: '100%', paddingVertical: 8 }
                  : { gap: 12, paddingVertical: 8 }
              }
            >
              {isWeb && width > 768 ? <CardItemWebView {...item} /> : <MobileCardItem {...item} />}
            </Box>
          )}
          contentContainerStyle={[styles.contentContainerStyle]}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={refetch}
          columnWrapperStyle={isWeb && numColumns > 1 && { gap: 12 }}
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
              <Box
                marginTop={0}
                width="auto"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 24,
                  gap: 12,
                }}
              >
                <FontAwesome name="frown-o" size={32} color={Colors.yellow} />
                <Text
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Asnjë rezultat. Ju lutem provoni me filtera tjera ose provoni më vonë.
                </Text>
              </Box>
            )
          }
          ListHeaderComponent={() => (
            <Box gap={12}>
              {isLoggedIn && (
                <Text fontSize="lg" fontWeight="bold">
                  <Text fontWeight="regular">Përshëndetje</Text>, {username}
                </Text>
              )}
              <Box flex={1} flexDirection="row" gap={12}>
                <Box flex={1}>
                  <Label>Qyteti</Label>
                  <MultiSelect
                    style={dropdownStyles.multiSelectStyle}
                    containerStyle={
                      isWeb
                        ? ({
                            maxHeight: 300,
                            overflow: 'auto',
                          } as unknown as ViewStyle)
                        : undefined
                    }
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
                    containerStyle={
                      isWeb
                        ? ({
                            maxHeight: 300,
                            overflow: 'auto',
                          } as unknown as ViewStyle)
                        : undefined
                    }
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
                      <TouchableOpacity onPress={unSelect} style={styles.pillStyle}>
                        <Pill title={item.label} iconLeft={<FontAwesome name="times" size={12} color="#000" />} />
                      </TouchableOpacity>
                    )}
                    search
                    searchPlaceholder="Kërko lagjet..."
                  />
                </Box>
              </Box>
              <AccordionView open={accordionOpen} setOpen={setAccordionOpen}>
                <>
                  <Box>
                    <Label>Çmimi për muaj</Label>
                    <Box flex={1} flexDirection="row" gap={12}>
                      <Box flex={1} style={styles.flexShrink}>
                        <SelectDropdown
                          data={cmimi}
                          onSelect={(selectedItem) => {
                            setSelectedPriceFrom((prev) => {
                              if (prev === selectedItem) {
                                return undefined;
                              }
                              return selectedItem;
                            });
                          }}
                          defaultValue={selectedPriceFrom}
                          renderButton={(_, isOpened) => {
                            return (
                              <Box style={styles.selectDropdownStyles}>
                                <SelectButton
                                  title={(selectedPriceFrom && 'Nga ' + selectedPriceFrom + '€') || ''}
                                  isOpened={isOpened}
                                  placeholder="Nga"
                                />
                              </Box>
                            );
                          }}
                          showsVerticalScrollIndicator
                          renderItem={(item, _, isSelected) => (
                            <>
                              <SelectItem item={item} isSelected={isSelected} />
                            </>
                          )}
                          dropdownStyle={dropdownStyles.dropdownMenuStyle}
                        />
                      </Box>
                      <Box flex={1} style={styles.flexShrink}>
                        <SelectDropdown
                          data={selectedPriceFrom == null ? cmimi : cmimi.filter((price) => price > selectedPriceFrom)}
                          onSelect={(selectedItem) => {
                            setSelectedPriceTo((prev) => {
                              if (prev === selectedItem) {
                                return undefined;
                              }
                              return selectedItem;
                            });
                          }}
                          defaultValue={selectedPriceTo}
                          renderButton={(_, isOpened) => (
                            <Input
                              style={{
                                outlineColor: Colors.yellow,
                                borderRadius: 12,
                              }}
                            >
                              <SelectButton
                                title={(selectedPriceTo && 'Deri në ' + selectedPriceTo + '€') || ''}
                                isOpened={isOpened}
                                placeholder="Deri në"
                              />
                            </Input>
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
                  <Box>
                    <Box flex={1} flexDirection="row" gap={12}>
                      <Box flex={1} style={styles.flexShrink}>
                        <Label>Numri i cimerave</Label>
                        <SelectDropdown
                          data={cimerat}
                          onSelect={(selectedItem) => {
                            setSelectedNumberOfFlatmates((prev) => {
                              if (prev === selectedItem) {
                                return undefined;
                              }
                              return selectedItem;
                            });
                          }}
                          defaultValue={selectedNumberOfFlatmates}
                          renderButton={(_, isOpened) => {
                            return (
                              <Box style={styles.selectDropdownStyles}>
                                <SelectButton
                                  title={(selectedNumberOfFlatmates && selectedNumberOfFlatmates + ' cimerë') || ''}
                                  isOpened={isOpened}
                                  placeholder="Numri i cimerave"
                                />
                              </Box>
                            );
                          }}
                          disableAutoScroll
                          showsVerticalScrollIndicator
                          renderItem={(item, _, isSelected) => (
                            <>
                              <SelectItem item={item} isSelected={isSelected} />
                            </>
                          )}
                          dropdownStyle={dropdownStyles.dropdownMenuStyle}
                        />
                      </Box>
                      <Box flex={1} style={styles.flexShrink}>
                        <Label>Numri i dhomave</Label>
                        <SelectDropdown
                          data={numriIDhomave}
                          onSelect={(selectedItem) => {
                            setSelectedNumberOfRooms((prev) => {
                              if (prev === selectedItem) {
                                return undefined;
                              }
                              return selectedItem;
                            });
                          }}
                          defaultValue={selectedNumberOfRooms}
                          renderButton={(_, isOpened) => (
                            <Input
                              style={{
                                outlineColor: Colors.yellow,
                                borderRadius: 12,
                              }}
                            >
                              <SelectButton
                                title={(selectedNumberOfRooms && selectedNumberOfRooms + ' dhoma') || ''}
                                isOpened={isOpened}
                                placeholder="Numri i dhomave"
                              />
                            </Input>
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
                </>
              </AccordionView>
              {showFilter && (
                <Box flexDirection="row" justifyContent="center" alignItems="center">
                  <Box flexDirection="row" alignItems="center">
                    <Text
                      style={styles.filter}
                      onPress={() => {
                        setSelectedCities([]);
                        setSelectedNeighborhoods([]);
                        setSelectedPriceFrom(null);
                        setSelectedPriceTo(null);
                        setSelectedNumberOfRooms(null);
                        setSelectedNumberOfFlatmates(null);
                        setAccordionOpen(false);
                      }}
                    >
                      Pastro filtrat
                    </Text>
                    <FontAwesome6 name="broom" size={12} color={Colors.textFade} />
                  </Box>
                </Box>
              )}
            </Box>
          )}
        />
      </WebView>
    </Component>
  );
}

const styles = StyleSheet.create({
  selectDropdownStyles: {
    outlineColor: Colors.yellow,
    borderRadius: 12,
  },
  pillStyle: {
    marginTop: 4,
    marginRight: 4,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainerStyle: {
    paddingBottom: 80,
    padding: 20,
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
