import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import { Text, View } from "./Themed";

export const SliderComponent = () => {
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  return (
    <Slider
      snapThreshold={1}
      style={{
        marginBottom: 20,
        marginTop: 20,
      }}
      steps={4}
      forceSnapToStep={true}
      stepTimingOptions={{
        duration: 200,
      }}
      renderMark={({ index }) => (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 30,
            position: "absolute",
            left: index * 10,
            top: -25,
          }}>
          <Text>{index * 10}€</Text>
        </View>
      )}
      progress={progress}
      minimumValue={min}
      maximumValue={max}
    />
  );
};
