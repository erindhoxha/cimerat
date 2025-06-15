import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
  Touchable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

type DrawerProps = {
  open: boolean;
  onClose: () => void;
};

const DrawerExample = ({ open, onClose }: DrawerProps) => {
  const animation = useRef(new Animated.Value(-SCREEN_WIDTH * 0.7)).current;
  const [visible, setVisible] = useState(open);
  const insets = useSafeAreaInsets();

  useEffect(() => {
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

  const router = useRouter();

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.drawer, { transform: [{ translateX: animation }], paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: 4,
            backgroundColor: "white",
            borderRadius: 9999,
            marginBottom: 20,
            alignSelf: "flex-end",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <FontAwesome name="close" size={24} color="#000" style={{ height: 24, width: 24, textAlign: "center" }} />
        </TouchableOpacity>
        <Text
          style={styles.drawerText}
          onPress={() => {
            onClose();
            router.push("/");
          }}>
          Listimet
        </Text>
        <Text
          style={styles.drawerText}
          onPress={() => {
            onClose();
            router.push("/(tabs)/two");
          }}>
          Krijo
        </Text>
        <Text
          style={styles.drawerText}
          onPress={() => {
            onClose();
            router.push("/profile");
          }}>
          Profili
        </Text>
        <TouchableOpacity
          style={{
            padding: 10,
            marginTop: "auto",
            backgroundColor: "white",
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            gap: 8,
            marginBottom: 12,
          }}
          onPress={() => {
            onClose();
            router.push("/register");
          }}>
          <FontAwesome name="user-plus" size={16} color="#000" />
          <Text
            style={{
              textAlign: "center",
              color: "#000",
              fontWeight: "500",
              fontSize: 16,
            }}>
            Regjistrohu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: "white",
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            marginBottom: 48,
            gap: 8,
          }}
          onPress={() => {
            onClose();
            router.push("/login");
          }}>
          <FontAwesome name="user" size={16} color="#000" />
          <Text
            style={{
              textAlign: "center",
              color: "#000",
              fontWeight: "500",
              fontSize: 16,
            }}>
            Kyçu
          </Text>
        </TouchableOpacity>
        {false && (
          <TouchableOpacity
            style={{
              padding: 10,
              marginTop: "auto",
              backgroundColor: "white",
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              marginBottom: 48,
              gap: 8,
            }}
            onPress={() => {
              onClose();
              router.push("/login");
            }}>
            <FontAwesome name="user" size={16} color="#000" />
            <Text
              style={{
                textAlign: "center",
                color: "#000",
                fontWeight: "500",
                fontSize: 16,
              }}>
              Profili
            </Text>
          </TouchableOpacity>
        )}
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
