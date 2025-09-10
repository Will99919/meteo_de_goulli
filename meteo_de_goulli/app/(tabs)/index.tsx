import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const getCoordinates = async () => {
      try{
        const { status } = await Location.requestForegroundPermissionsAsync();
       if (status !== "granted") {
        setErrorMsg('Permission refusée');
        return;
       }

       const userlocation = await Location.getCurrentPositionAsync({});
       setLocation(userlocation);
      } catch (error) {
        setErrorMsg('Erreur lors de la récupération de la localisation');
        console.error(error);
      }
    };

    getCoordinates()
  }, [])

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg || 'Attente de la localisation...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>
        Localisation : Lat. {location.coords.latitude}, Long.{' '}
        {location.coords.longitude}
      </Text>
    </View>
  );
}

 const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: Constants.default.statusBarHeight,
      backgroundColor: '#ecf0f1',
      padding: 8,
    }
 });
