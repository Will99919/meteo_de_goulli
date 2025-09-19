import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type Props = {
  data: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: { description: string; icon: string }[];
  };
  cityName?: string | null;
};

export default function CurrentWeather({ data, cityName }: Props) {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  const locationLabel = cityName ?? 'Lieu';

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{locationLabel}</Text>
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
        style={styles.icon}
      />
      <Text style={styles.temp}>{temp}°C</Text>
      <Text style={styles.desc}>{description}</Text>
      <Text style={styles.small}>Ressenti : {feels}° • Humidité : {humidity}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: '100%',
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  icon: {
    width: 120,
    height: 120,
  },
  temp: {
    fontSize: 48,
    fontWeight: '300',
    color: '#fff',
  },
  desc: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#fff',
  },
  small: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
});
