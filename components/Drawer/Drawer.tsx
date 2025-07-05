import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
  Touchable,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "@/components/View/View";
import { Box } from "../Box";
import { Text } from "../Text";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

interface TextLinkProps {
  label: string;
  onPress: () => void;
}

const TextLink = ({ label, onPress }: TextLinkProps) => {
  return (
    <Text style={styles.drawerText} onPress={onPress}>
      {label}
    </Text>
  );
};

const DrawerExample = ({ open, onClose }: DrawerProps) => {
  const animation = useRef(new Animated.Value(-SCREEN_WIDTH * 0.7)).current;
  const [visible, setVisible] = useState(open);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    Keyboard.dismiss();
    if (open) {
      setVisible(true);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: -SCREEN_WIDTH * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [open]);

  if (!visible) return null;

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.drawer, { transform: [{ translateX: animation }], paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <FontAwesome name="close" size={24} style={{ height: 24, width: 24, textAlign: "center" }} />
        </TouchableOpacity>
        <TextLink
          label="Faqja kryesore"
          onPress={() => {
            onClose();
            router.push("/");
          }}
        />
        <TextLink
          label="Listimet e mia"
          onPress={() => {
            onClose();
            router.push("/(tabs)/your-listings");
          }}
        />
        <TextLink
          label="Profili"
          onPress={() => {
            onClose();
            router.push("/profile");
          }}
        />
        <Box marginBottom={48} marginTop="auto">
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              onClose();
              router.push("/register");
            }}>
            <FontAwesome name="user-plus" size={16} />
            <Text fontWeight="medium">Regjistrohu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              onClose();
              router.push("/login");
            }}>
            <FontAwesome name="sign-in" size={16} />
            <Text fontWeight="medium">Kyçu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              onClose();
              router.push("/logout");
            }}>
            <FontAwesome name="sign-out" size={16} />
            <Text fontWeight="medium">Dil</Text>
          </TouchableOpacity>
          {true && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                onClose();
                router.push("/profile");
              }}>
              <FontAwesome name="user" size={16} />
              <Text fontWeight="medium">Profili</Text>
            </TouchableOpacity>
          )}
        </Box>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 99,
  },
  linkButton: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 6,
    borderColor: "white",
    marginBottom: 12,
  },
  closeIcon: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 9999,
    marginBottom: 20,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.7,
    height: "100%",
    backgroundColor: Colors.light.yellow,
    paddingHorizontal: 20,
    zIndex: 100,
    elevation: 12,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerText: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "left",
    color: "black",
    borderBottomWidth: 2,
    fontSize: 20,
    fontWeight: "500",
  },
});

export default DrawerExample;
