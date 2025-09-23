import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Platform, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Déjà inclus

import CurrentWeather from '@/components/CurrentWeather';
import WeeklyForecast from '@/components/WeeklyForecast';
import HumidityGauge from '@/components/HumidityGauge';
import WindStrength from '@/components/WindStrength';
import AirQualityGauge from '../../components/AirQualityGauge';
import UVIndex from '../../components/UVIndex';
import HourlyForecast from '../../components/HourlyForecast';
import WeatherMonkey from '@/components/WeatherMonkey'; // Déjà inclus

interface ForecastResponse {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: { description: string; icon: string }[];
    wind: { speed: number };
    pop: number;
  }[];
  city: {
    name: string;
    coord: { lat: number; lon: number };
  };
}

interface AirQualityResponse {
  list: [{
    main: {
      aqi: number;
    };
    components: {
      pm2_5: number;
      pm10: number;
    };
  }];
}

const API_URL = (lat: number, lon: number) =>
  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${Constants.expoConfig?.extra?.OPENWEATHER_API_KEY}&lang=fr&units=metric`;

// 🔹 Regroupe les données par jour pour WeeklyForecast
function groupByDay(list: ForecastResponse['list']) {
  const days: {
    dt: number;
    temp: { min: number; max: number };
    weather: { description: string; icon: string }[];
  }[] = [];

  const map: Record<
    string,
    { temps: number[]; icons: string[]; descs: string[]; dt: number }
  > = {};

  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0];

    if (!map[dayKey]) {
      map[dayKey] = { temps: [], icons: [], descs: [], dt: item.dt };
    }
    map[dayKey].temps.push(item.main.temp);
    map[dayKey].icons.push(item.weather[0].icon);
    map[dayKey].descs.push(item.weather[0].description);
  });

  Object.values(map).forEach((entry) => {
    days.push({
      dt: entry.dt,
      temp: {
        min: Math.min(...entry.temps),
        max: Math.max(...entry.temps),
      },
      weather: [
        {
          description: entry.descs[0],
          icon: entry.icons[0],
        },
      ],
    });
  });

  return days;
}

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityResponse | null>(null);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission refusée');
          setLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});

        // 🔹 Récupération du nom de la ville
        try {
          const places = await Location.reverseGeocodeAsync(userLocation.coords);
          const place = places?.[0];
          setCityName(
            place?.city ?? place?.region ?? place?.country ?? null
          );
        } catch (e) {
          console.warn('Reverse geocode failed', e);
        }

        await getWeather(userLocation);
        await getAirQuality(
          userLocation.coords.latitude,
          userLocation.coords.longitude
        );
      } catch (error) {
        setErrorMsg('Erreur lors de la récupération de la localisation');
        setLoading(false);
        console.error(error);
      }
    };

    getCoordinates();
  }, []);

  const getWeather = async (location: Location.LocationObject) => {
    try {
      const apiKey = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY;
      console.log('API Key:', apiKey ? 'OK' : '❌ manquante');

      if (!apiKey) {
        setErrorMsg('Clé API non configurée. Vérifiez .env et app.config.js');
        setLoading(false);
        return;
      }

      const response = await axios.get<ForecastResponse>(
        API_URL(location.coords.latitude, location.coords.longitude)
      );
      setData(response.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMsg('Erreur 401 : Clé API invalide ou non activée');
      } else {
        setErrorMsg(
          `Erreur lors de la récupération de la météo : ${error.message}`
        );
      }
      setLoading(false);
      console.log('Erreur dans getWeather', error);
    }
  };

  const getAirQuality = async (lat: number, lon: number) => {
    try {
      const response = await axios.get<AirQualityResponse>(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${Constants.expoConfig?.extra?.OPENWEATHER_API_KEY}`
      );
      setAirQuality(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la qualité de l\'air:', error);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#1ed7b5', '#f0f9a7']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (errorMsg) {
    return (
      <LinearGradient colors={['#57ebde', '#aefb2a']} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.ErrorText}>{errorMsg}</Text>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1ed7b5', '#f0f9a7']}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            <View style={styles.leftSection}>
              {data && <CurrentWeather data={data.list[0]} cityName={cityName ?? data.city.name} />}
            </View>
            <View style={styles.rightSection}>
              {data && (
                <WeatherMonkey
                  temp={data.list[0].main.temp}
                  description={data.list[0].weather[0].description}
                />
              )}
            </View>
          </View>
          <View style={styles.bottomSection}>
            {data && (
              <>
                <HourlyForecast
                  hourly={data.list
                    .filter((item, index) => index < 8)
                    .map(item => ({
                      dt: item.dt,
                      main: {
                        temp: item.main.temp
                      },
                      weather: item.weather,
                      pop: item.pop || 0
                    }))}
                />
                <WeeklyForecast daily={groupByDay(data.list)} />
                <View style={styles.gridContainer}>
                  <View style={styles.gridRow}>
                    <AirQualityGauge aqi={airQuality?.list[0]?.main.aqi || 1} />
                    <UVIndex uvi={3} />
                  </View>
                  <View style={styles.gridRow}>
                    <WindStrength wind={data.list[0].wind} /> {/* Correction ici */}
                    <HumidityGauge humidity={data.list[0].main.humidity} />
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'web' ? 0 : Constants.statusBarHeight || 20,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'web' ? 0 : Constants.statusBarHeight || 20,
    padding: 8,
  },
  mainContent: {
    flex: 0.7,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 50,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  gridContainer: {
    width: '100%',
    padding: 10,
    gap: 5,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
  },
  additionalInfoColumn: {
    flex: 1,
    gap: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  ErrorText: {
    fontSize: 18,
    color: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});