import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import Weather from '@/components/Weather';


interface ForecastResponse {
  list: {
    dt: number; 
    main: {
      temp: number;
    };
    weather: {
      icon: string;
    }[];
  }[];
}


interface ForecastProcessed {
  hour: number;
  name: string; 
  temps: number;
  icon: string;
}

interface ForecastProps {
  data: ForecastResponse | null; 
}

export default function Forecast({ data }: ForecastProps) {
  const [forecasts, setForecasts] = useState<ForecastProcessed[]>([]);

  useEffect(() => {
    if (!data || !data.list || data.list.length === 0) {
      setForecasts([]);
      return;
    }

    const forecastsData = data.list
      .slice(0, 8)
      .map((f) => {
        const dt = new Date(f.dt * 1000);
        return {
          date: dt,
          hour: dt.getHours(),
          temps: Math.round(f.main.temp),
          icon: f.weather[0].icon,
          name: format(dt, 'EEEE', { locale: fr }),
        };
      });

    setForecasts(forecastsData);
  }, [data]);

  if (!data || forecasts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucune prévision disponible</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {forecasts.map((f) => (
        <View key={f.hour} style={styles.dayContainer}>
          <Text style={styles.dayName}>{f.name}</Text>
          <Weather forecast={f} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
    height: '35%',
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  dayContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#54565b',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});