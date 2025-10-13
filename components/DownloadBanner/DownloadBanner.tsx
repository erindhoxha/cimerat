import { TouchableOpacity, Linking, StyleSheet, useWindowDimensions } from 'react-native';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

export const DownloadBanner = () => {
  const { width } = useWindowDimensions();

  return (
    <Box style={[styles.banner, styles.mobileBanner]}>
      <Text style={styles.bannerText}>Eksperiencë më e mirë në aplikacion</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://apps.apple.com/app/your-app-id')}
        style={styles.storeButton}
      >
        <FontAwesome name="apple" size={20} color="#fff" />
        <Text style={styles.storeButtonText}>Shkarko në App Store</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=your.package')}
        style={styles.storeButton}
      >
        <FontAwesome name="android" size={20} color="#fff" />
        <Text style={styles.storeButtonText}>Shkarko në Google Play</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={handleHide} style={[styles.closeButton, isMobile && styles.closeMobileButton]}>
        <FontAwesome name="close" size={18} color={Colors.text} />
      </TouchableOpacity> */}
    </Box>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 12,
    width: '100%',
    backgroundColor: 'white',
    position: 'relative',
  },
  mobileBanner: {
    flexDirection: 'column',
    paddingTop: 48,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 8,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.text,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  storeButtonText: {
    color: '#fff',
    fontWeight: '400',
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 4,
    zIndex: 1,
  },
  closeMobileButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: Colors.yellow,
    borderRadius: 1200,
    padding: 8,
  },
});
