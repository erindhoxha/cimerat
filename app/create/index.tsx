import { Box } from "@/components/Box";
import { Button } from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Label from "@/components/Label";
import { Text } from "@/components/Text";
import { cities } from "@/constants/Cities";
import { neighborhoods } from "@/constants/Neighborhoods";
import { cimerat } from "@/constants/NumberOfCimera";
import { numriIDhomave } from "@/constants/NumberOfRooms";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image } from "expo-image";

interface SelectButtonProps {
  title: string | null;
  isOpened?: boolean;
  placeholder: string;
  disabled?: boolean;
}

const SelectButton = ({ title, isOpened, placeholder, disabled }: SelectButtonProps) => (
  <Box style={[styles.dropdownButtonStyle, disabled ? styles.dropdownButtonDisabledStyle : null]}>
    <Text style={[styles.dropdownButtonTxtStyle, disabled ? styles.dropdownButtonTxtDisabledStyle : null]}>
      {title || placeholder}
    </Text>
    <Text>
      <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
    </Text>
  </Box>
);

interface FormData {
  city: string;
  neighborhood: string;
  title: string;
  description: string;
  price: string;
  numberOfRooms: string;
  numberOfCimera: string;
  numberOfCurrentCimera: string;
}

export default function CreateScreen() {
  const router = useRouter();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      city: "",
      neighborhood: "",
      title: "",
      description: "",
      price: "",
      numberOfRooms: "",
      numberOfCimera: "",
      numberOfCurrentCimera: "",
    },
  });

  const [images, setImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImage = async () => {
    // Request permission if not granted
    if (!mediaLibraryPermission?.granted) {
      const permission = await requestMediaLibraryPermission();
      if (!permission.granted) {
        Toast.show({
          type: "error",
          text1: "Leja e galerisë është e nevojshme",
          text2: "Ju lutemi lejoni qasjen në galeri për të zgjedhur foto.",
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
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  const selectedCity = watch("city");

  const onSubmit = async (data: FormData) => {
    console.log(data);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((uri, idx) => {
      formData.append("images", {
        uri,
        name: `photo_${idx}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    await fetch("http://localhost:3000/listings", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // TODO: send data to backend
    router.replace("/your-listings");
    router.dismissAll();
    Toast.show({
      type: "success",
      text1: "Keni krijuar një listim të ri",
      text2: "Shikoni listimet tuaja për të parë ndryshimet.",
      text1Style: { fontSize: 14, fontWeight: "bold" },
      text2Style: { fontSize: 12 },
    });
    reset();
  };

  return (
    <ScrollView style={styles.container}>
      <Box marginBottom={20}>
        <Text fontSize="xl" fontWeight="bold">
          Krijo një listim të ri
        </Text>
      </Box>
      {/* Image picker */}
      <Box marginBottom={12}>
        <Button variant="tertiary" onPress={pickImage}>
          Zgjidh foto
        </Button>
        <Box
          flexDirection="row"
          gap={8}
          marginTop={8}
          flex={1}
          style={{
            flexShrink: 1,
            flexWrap: "wrap",
          }}>
          {images.map((uri, idx) => (
            <Pressable key={idx} onPress={() => setPreviewImage(uri)}>
              <Box style={{ borderRadius: 8, overflow: "hidden" }}>
                <Image source={{ uri }} style={{ width: 64, height: 64 }} />
              </Box>
            </Pressable>
          ))}
        </Box>
      </Box>
      {/* City Dropdown */}
      <Box flex={1}>
        <Label>
          Qyteti<Text style={{ color: "red" }}>*</Text>
        </Label>
        <Controller
          control={control}
          name="city"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <SelectDropdown
              data={cities}
              onSelect={onChange}
              dropdownStyle={styles.dropdownMenuStyle}
              renderButton={(_, isOpened) => (
                <>
                  <SelectButton title={selectedCity} isOpened={isOpened} placeholder="Zgjedh Qytetin" />
                </>
              )}
              renderItem={(item, _, isSelected) => (
                <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </Box>
              )}
              search
              searchInputStyle={styles.searchInputStyle}
              searchPlaceHolder="Kërko qytetin..."
              searchPlaceHolderColor="#6c757d"
              showsVerticalScrollIndicator={false}
            />
          )}
        />
      </Box>
      {/* Neighborhood Dropdown */}
      <Box flex={1}>
        <Label>
          Lagja<Text style={{ color: "red" }}>*</Text>
        </Label>
        <Controller
          control={control}
          name="neighborhood"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <SelectDropdown
              data={selectedCity ? neighborhoods[selectedCity] : []}
              onSelect={onChange}
              dropdownStyle={styles.dropdownMenuStyle}
              disabled={!selectedCity}
              renderButton={(_, isOpened) => (
                <>
                  <SelectButton
                    title={value}
                    isOpened={isOpened}
                    placeholder="Zgjedh Lagjën"
                    disabled={!selectedCity}
                  />
                </>
              )}
              renderItem={(item, index, isSelected) => (
                <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </Box>
              )}
              search
              searchInputStyle={styles.searchInputStyle}
              searchPlaceHolder="Kërko lagjën..."
              searchPlaceHolderColor="#6c757d"
              showsVerticalScrollIndicator={false}
            />
          )}
        />
      </Box>
      {/* Title */}
      <Controller
        control={control}
        name="title"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Input label="Titulli" placeholder="Titulli i listimit" required value={value} onChangeText={onChange} />
        )}
      />
      {/* Description */}
      <Controller
        control={control}
        name="description"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Përshkrimi"
            placeholder="Përshkrimi"
            multiline
            numberOfLines={10}
            required
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {/* Price */}
      <Controller
        control={control}
        name="price"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Çmimi në euro (€)"
            placeholder="300"
            required
            keyboardType="numeric"
            value={value}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              onChange(numericValue);
            }}
          />
        )}
      />
      {/* Number of Rooms */}
      <Controller
        control={control}
        name="numberOfRooms"
        render={({ field: { onChange, value } }) => (
          <>
            <Label>Numri i dhomave</Label>
            <SelectDropdown
              data={numriIDhomave}
              onSelect={onChange}
              dropdownStyle={styles.dropdownMenuStyle}
              renderButton={(_, isOpened) => (
                <>
                  <SelectButton title={value} isOpened={isOpened} placeholder="Numri i dhomave në total" />
                </>
              )}
              renderItem={(item, index, isSelected) => (
                <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </Box>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      />
      {/* Number of Cimera */}
      <Controller
        control={control}
        name="numberOfCimera"
        render={({ field: { onChange, value } }) => (
          <>
            <Label>Numri i Cimerave</Label>
            <SelectDropdown
              data={cimerat}
              onSelect={onChange}
              dropdownStyle={styles.dropdownMenuStyle}
              renderButton={(_, isOpened) => (
                <>
                  <SelectButton title={value} isOpened={isOpened} placeholder="Sa cimera do të ketë?" />
                </>
              )}
              renderItem={(item, index, isSelected) => (
                <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </Box>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      />
      {/* Number of Current Cimera */}
      <Controller
        control={control}
        name="numberOfCurrentCimera"
        render={({ field: { onChange, value } }) => (
          <>
            <Label>Numri i Cimerave aktuale</Label>
            <SelectDropdown
              data={cimerat}
              onSelect={onChange}
              dropdownStyle={styles.dropdownMenuStyle}
              renderButton={(_, isOpened) => (
                <>
                  <SelectButton title={value} isOpened={isOpened} placeholder="Sa cimera janë tani?" />
                </>
              )}
              renderItem={(item, index, isSelected) => (
                <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </Box>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      />
      <Button variant="primary" style={{ marginBottom: 48 }} onPress={handleSubmit(onSubmit)}>
        Krijo Listimin
      </Button>

      <Modal visible={!!previewImage} transparent animationType="fade" onRequestClose={() => setPreviewImage(null)}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setPreviewImage(null)}>
          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              style={{ width: "90%", height: "80%", borderRadius: 32 }}
              contentFit="contain"
            />
          )}
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white", gap: 12, paddingBottom: 64 },
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
  },
  dropdownMenuStyle: {
    borderRadius: 8,
  },
  dropdownItemStyle: {
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  searchInputStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownButtonDisabledStyle: {
    backgroundColor: "#e0e0e0",
    opacity: 0.6,
  },
  dropdownButtonTxtDisabledStyle: {
    color: "#aaa",
  },
});
