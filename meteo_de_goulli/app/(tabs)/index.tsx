import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import axios from 'axios';

import CurrentWeather from '@/components/CurrentWeather'

interface ForecastResponse {
  city: {
    name: string;
    timezone: number;
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

const API_URL = (lat: number, lon: number) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${Constants.expoConfig?.extra?.openWeatherApiKey}&lang=fr&units=metric`;

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

    const apiKey = Constants.expoConfig?.extra?.openWeatherApiKey;
    console.log('Clé API chargée:', apiKey ? 'Oui (valeur masquée pour sécurité)' : 'Non (undefined - vérifiez .env et app.config.js)');
    if (!apiKey) {
      setErrorMsg('Clé API non configurée. Vérifiez .env et app.config.js');
      setLoading(false);
      return;
    }

      const response = await axios.get<ForecastResponse>(API_URL(location.coords.latitude, location.coords.longitude));
      setData(response.data)
      setLoading(false)
  } catch(error: any) {
    if (error.response?.status === 401) {
      setErrorMsg('Erreur 401 : Clé API invalide ou non activée. Attendez 10-60 min après génération ou régénérez-la sur openweathermap.org.');
    } else {
      setErrorMsg(`Erreur lors de la récupération de la météo : ${error.message}`)
    }
    setLoading(false);
    console.log("Erreur dans getWeather", error);
  }
};

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#54565bff" />
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
        {data && <CurrentWeather data={data} />}
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
    backgroundColor: '#e2e6e1',
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
