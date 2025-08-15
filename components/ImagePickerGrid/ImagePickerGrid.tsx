import { Box } from '@/components/Box';
import { Button } from '@/components/Button/Button';
import { FontAwesome } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/Colors';
import Label from '../Label';

interface ImageData {
  type?: string;
  uri: string;
  name: string;
}

interface ImagePickerGridProps {
  images: ImageData[];
  error?: string | null;
  onPick: () => void;
  onPreview: (uri: string) => void;
  onRemove: (idx: number) => void;
}

export const ImagePickerGrid: React.FC<ImagePickerGridProps> = ({ images, onPick, onPreview, onRemove, error }) => {
  console.log('images', images);
  return (
    <Box>
      <Label>
        Fotografitë e listimit<Text style={styles.asterisk}>*</Text>
      </Label>
      <Button
        variant="tertiary"
        onPress={onPick}
        style={{
          ...(error ? { borderColor: Colors.danger, borderWidth: 1 } : {}),
        }}
      >
        <Text style={{ color: error ? Colors.danger : '#000' }}>
          Ngarko fotografitë <FontAwesome name="plus" size={12} color={error ? Colors.danger : '#000'} />
        </Text>
      </Button>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Box flexDirection="row" gap={8} marginTop={8} flex={1} style={styles.gridWrap}>
        {images.map(({ uri }, idx) => (
          <Pressable key={idx} onPress={() => onPreview(uri)}>
            <Box>
              <FontAwesome
                name="trash"
                size={16}
                color="#ce0303ff"
                style={styles.trashIcon}
                onPress={() => onRemove(idx)}
              />
              <Box style={styles.imageBox}>
                <Image source={{ uri }} style={styles.image} />
              </Box>
            </Box>
          </Pressable>
        ))}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  gridWrap: {
    flexWrap: 'wrap',
  },
  asterisk: {
    color: 'red',
  },
  trashIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 9999,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imageBox: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 64,
    height: 64,
  },
});
