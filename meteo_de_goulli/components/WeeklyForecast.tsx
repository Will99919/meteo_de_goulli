import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

interface WeeklyForecastProps {
  daily: {
    dt: number;
    temp: { min: number; max: number };
    weather: { description: string; icon: string }[];
  }[];
}

export default function WeeklyForecast({ daily }: WeeklyForecastProps) {
  const days = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];

  const getDayName = (dt: number) => {
    const date = new Date(dt * 1000);
    return days[date.getDay()];
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={daily.slice(0, 7)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.day}>{getDayName(item.dt)}</Text>
            <Image
              style={styles.icon}
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0]?.icon || '01d'}.png`,
              }}
            />
            <Text style={styles.temp}>
              {Math.round(item.temp.min)}° / {Math.round(item.temp.max)}°
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#4899be52',
    borderRadius: 15,
    padding: 10,
    paddingBottom: 0,
    width: '90%',
  },
  listContent: {
    paddingVertical: 5, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  day: { color: '#f0f0f0', fontSize: 16, fontWeight: 'bold' },
  temp: { color: '#f0f0f0', fontSize: 16 },
  icon: { width: 40, height: 40 },
});