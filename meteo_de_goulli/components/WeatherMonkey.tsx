import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

type Props = {
  icon: string;
};

export default function WeatherMonkey({ icon }: Props) {

  let monkeyImage = require('../assets/images/Monkey_chill.png'); // Image par défaut
  const iconCode = icon.slice(0, 2);
  switch (iconCode) {
    case '01': // Ciel clair
      monkeyImage = require('../assets/images/Monkey_sun.png');
      break;
    case '02':
    case '03':
    case '04': // Nuageux
      monkeyImage = require('../assets/images/Monkey_chill.png');
      break;
    case '09':
    case '10': // Pluie
      monkeyImage = require('../assets/images/Monkey_rain.png');
      break;
    case '13': // Neige
      monkeyImage = require('../assets/images/Monkey_snow.png');
      break;
    case '50': // Brouillard
      monkeyImage = require('../assets/images/Monkey_fog.png');
      break;
  }

  return (
    <View style={styles.container}>
      <Image source={monkeyImage} style={styles.monkey} />
    </View>
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