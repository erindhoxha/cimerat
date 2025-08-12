import { FlatList, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { CardItem } from '@/components/CardItem/CardItem';
import { useRouter } from 'expo-router';
import { Box } from '@/components/Box';
import Label from '@/components/Label/Label';
import { Text } from '@/components/Text';
import { cmimi } from '@/constants/Price';
import { cities } from '@/constants/Cities';
import { neighborhoods } from '@/constants/Neighborhoods';
import Input from '@/components/Input';
import { useQuery } from '@tanstack/react-query';
import { styles as dropdownStyles } from '@/components/DropdownController/styles';
import Colors from '@/constants/Colors';
import { Loading } from '@/components/Loading/Loading';

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
      <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} />
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
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
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

  const { data, isLoading } = useQuery({
    staleTime: 0,
    queryKey: ['listings', selectedCity, selectedNeighborhood, selectedPriceFrom, selectedPriceTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCity) params.append('city', selectedCity);
      if (selectedNeighborhood) params.append('neighborhood', selectedNeighborhood);
      if (selectedPriceFrom) params.append('priceFrom', String(selectedPriceFrom));
      if (selectedPriceTo) params.append('priceTo', String(selectedPriceTo));

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listings?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch listings');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    data && (
      <Box style={styles.container}>
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          ListEmptyComponent={() => (
            <Box marginTop={24}>
              <Text>Asnjë rezultat.</Text>
            </Box>
          )}
          ListHeaderComponent={() => (
            <Box gap={12}>
              <Input label="Kërko" placeholder="Kërko..." onChangeText={(text) => {}} />
              <Box flex={1} flexDirection="row" gap={12}>
                <Box flex={1}>
                  <Label>Qyteti</Label>
                  <SelectDropdown
                    searchInputStyle={dropdownStyles.searchInputStyle}
                    searchPlaceHolder="Kërko qytetin..."
                    searchPlaceHolderColor="#6c757d"
                    search={true}
                    data={cities}
                    onSelect={(selectedItem, index) => {
                      setDisabled(false);
                      setSelectedCity((prev) => {
                        if (prev === selectedItem) {
                          return null;
                        }
                        setSelectedNeighborhood(null);
                        return selectedItem;
                      });
                    }}
                    ref={cityRef}
                    renderButton={(_, isOpened) => (
                      <>
                        <SelectButton title={selectedCity} isOpened={isOpened} placeholder="Zgjedh Qytetin" />
                      </>
                    )}
                    renderItem={(item, index, isSelected) => (
                      <>
                        <SelectItem item={item} isSelected={isSelected} />
                      </>
                    )}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={dropdownStyles.dropdownMenuStyle}
                  />
                </Box>
                <Box flex={1}>
                  <Label>Lagja</Label>
                  <SelectDropdown
                    search={true}
                    searchInputStyle={dropdownStyles.searchInputStyle}
                    searchPlaceHolder="Kërko lagjen..."
                    searchPlaceHolderColor="#6c757d"
                    data={selectedCity ? neighborhoods[selectedCity] : []}
                    disabled={disabled}
                    ref={neighborHoodRef}
                    onSelect={(selectedItem, index) => {
                      setSelectedNeighborhood(selectedItem);
                    }}
                    renderButton={(_, isOpened) => (
                      <>
                        <SelectButton
                          title={selectedNeighborhood}
                          isOpened={isOpened}
                          placeholder="Zgjedh Lagjen"
                          disabled={disabled}
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
              <Box>
                <Label>Çmimi për muaj</Label>
                <Box flex={1} flexDirection="row" gap={12}>
                  <Box flex={1} style={styles.flexShrink}>
                    <SelectDropdown
                      data={cmimi}
                      onSelect={(selectedItem) => {
                        setSelectedPriceFrom(selectedItem);
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
                        setSelectedPriceTo(selectedItem);
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
                      renderItem={(item, index, isSelected) => (
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
            </Box>
          )}
          data={data}
          renderItem={({ item }) => <CardItem {...item} key={item.id} />}
        />
        {isLoading && (
          <Box>
            <Loading />
          </Box>
        )}
      </Box>
    )
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
});
