import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

type Props = {
  temp: number;
  description: string;
};

export default function WeatherMonkey({ temp, description }: Props) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const bounceConfig = {
    damping: 10,
    stiffness: 100,
    mass: 1,
    restSpeedThreshold: 0.01,
    restDisplacementThreshold: 0.01,
  };

  const handleBounce = () => {
    scale.value = withSpring(1.2, bounceConfig);
    translateY.value = withSpring(-10, bounceConfig);
    scale.value = withTiming(1, { duration: 200, easing: Easing.ease });
    translateY.value = withTiming(0, { duration: 200, easing: Easing.ease });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  let monkeyImage = require('../assets/images/Monkey_chill.png');
  description = description.toLowerCase();
  if (temp < 10) {
    monkeyImage = require('../assets/images/Monkey_dress.png');
  } else if (description.includes('rain')) {
    monkeyImage = require('../assets/images/Monkey_rain.png');
  } else if (temp > 25) {
    monkeyImage = require('../assets/images/Monkey_sun.png');
  }

  return (
    <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          handleBounce();
        }
      }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image source={monkeyImage} style={styles.monkey} />
      </Animated.View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  monkey: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});