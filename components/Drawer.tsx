import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions } from "react-native";
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
            padding: 10,
            backgroundColor: "white",
            borderRadius: 50,
            elevation: 5,
            marginBottom: 20,
            alignSelf: "flex-end",
          }}>
          <FontAwesome name="close" size={24} color="#000" style={{ alignSelf: "flex-end" }} />
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
          style={{
            padding: 10,
            backgroundColor: Colors.light.yellow,
            borderRadius: 8,
            marginBottom: 10,
            textAlign: "center",
            color: "#000",
          }}
          onPress={() => {
            onClose();
            router.push("/register");
          }}>
          Regjistrohu
        </Text>
        <Text
          style={{
            padding: 10,
            backgroundColor: Colors.light.yellow,
            borderRadius: 8,
            marginBottom: 10,
            textAlign: "center",
            color: "#000",
          }}
          onPress={() => {
            onClose();
            router.push("/login");
          }}>
          Kyçu
        </Text>
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
    backgroundColor: "white",
    paddingHorizontal: 20,
    zIndex: 100,
    elevation: 12,
  },
  drawerText: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "center",
    borderWidth: 2,
  },
});

export default DrawerExample;
