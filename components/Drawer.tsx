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

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.drawer, { transform: [{ translateX: animation }], paddingTop: insets.top + 20 }]}>
        <Text style={styles.drawerText}>Drawer Content</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>Close Drawer</Text>
        </TouchableOpacity>
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
    fontSize: 18,
    marginBottom: 20,
    color: "#000",
  },
});

export default DrawerExample;
