import { Modal, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface ImagePreviewModalProps {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
}

export function ImagePreviewModal({ visible, uri, onClose }: ImagePreviewModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        {uri && <Image source={{ uri }} style={styles.image} contentFit="contain" />}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "80%",
    borderRadius: 32,
  },
});
