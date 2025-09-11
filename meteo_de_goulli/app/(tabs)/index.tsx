import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import axios from 'axios';

interface ForecastResponse {
  city: {
    name: string;
  };
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
}

const API_URL = (lat: number, lon: number) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${Constants.expoConfig?.extra?.API_KEY}&lang=fr&units=metric`;

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const getCoordinates = async () => {
      try{
        const { status } = await Location.requestForegroundPermissionsAsync();
       if (status !== "granted") {
        setErrorMsg('Permission refusée');
        setLoading(false)
        return;
       }

       const userLocation = await Location.getCurrentPositionAsync({});
       await getWeather(userLocation);

      } catch (error) {
        setErrorMsg('Erreur lors de la récupération de la localisation');
        setLoading(false)
        console.error(error);
      }
    };

    getCoordinates()
  }, [])

const getWeather = async (location: Location.LocationObject) => {
  try {
      const response = await axios.get<ForecastResponse>(API_URL(location.coords.latitude, location.coords.longitude));
      setData(response.data)
      setLoading(false)
  } catch(error) {
    setErrorMsg('Erreur de la récupération de la météo');
    setLoading(false);
    console.log("Erreur dans getWeather", error);
  }
};

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement...</Text>
      </View>
    );
  }


  if (errorMsg){
    return (
    <View style={styles.container}>
      <Text style={styles.ErrorText}>{errorMsg}</Text>
    </View>
  );
  }
  
  return (
    <View style= {styles.container}>
      <Text style={styles.cityText}>
        Météo à {data?.city.name || 'Namek'}
      </Text>
       {data?.list[0] && (
        <>
          <Text>Température : {data.list[0].main.temp}°C</Text>
          <Text>Description : {data.list[0].weather[0].description}</Text>
        </>
      )}
    </View>
  )
}

 const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 0 : Constants.statusBarHeight || 20,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  cityText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ErrorText: {
    fontSize: 18,
    color: 'red',
  },
 });
