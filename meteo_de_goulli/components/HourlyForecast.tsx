import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { gaugeStyles } from '../styles/commonStyles';

interface HourlyForecastProps {
  hourly: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
    pop: number;
  }[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  return (
    <View style={[gaugeStyles.container, { padding: 15 }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        {hourly.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const hour = date.getHours().toString().padStart(2, '0');
          return (
            <View key={index} style={styles.hourItem}>
              <Text style={styles.hourText}>{hour}:00</Text>
              <Image 
                style={styles.icon}
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.weather[0]?.icon || '01d'}.png`,
                }}
              />
              <Text style={styles.tempText}>{Math.round(item.main.temp)}°</Text>
              <View style={styles.rainContainer}>
                <MaterialCommunityIcons name="water" size={14} color="white" />
                <Text style={styles.rainText}>{Math.round(item.pop * 100)}%</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  hourItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 50,
  },
  hourText: {
    color: 'white',
    fontSize: 14, 
    marginBottom: 6,
  },
  tempText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  icon: { 
    width: 40,
    height: 40,
  },
  rainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingTop: 4,
  },
  rainText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
})
export default HourlyForecast;