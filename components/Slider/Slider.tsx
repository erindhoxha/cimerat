import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import { View } from "../View/View";
import { StyleSheet } from "react-native";
import { Text } from "../Text";

export const SliderComponent = () => {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  return (
    <Slider
      style={styles.slider}
      snapThreshold={1}
      steps={4}
      forceSnapToStep={true}
      progress={progress}
      minimumValue={min}
      maximumValue={max}
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
