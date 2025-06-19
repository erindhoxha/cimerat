import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import { Text, View } from "./Themed";
import { StyleSheet } from "react-native";

export const SliderComponent = () => {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  return (
    <Slider
      snapThreshold={1}
      style={styles.slider}
      steps={4}
      forceSnapToStep={true}
      stepTimingOptions={{
        duration: 200,
      }}
      renderMark={({ index }) => (
        <View
          style={[
            styles.thumb,
            {
              left: index * 10,
            },
          ]}>
          <Text>{index * 10}€</Text>
        </View>
      )}
      progress={progress}
      minimumValue={min}
      maximumValue={max}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    marginBottom: 20,
    marginTop: 20,
  },
  thumb: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    position: "absolute",
    top: -25,
  },
});
