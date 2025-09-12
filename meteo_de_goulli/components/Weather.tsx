import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface ForecastProcessed {
  hour: number;
  temps: number;
  icon: string;
}

const getIcon = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

interface WeatherProps {
    forecast: ForecastProcessed;
}

export default function Weather({ forecast }: WeatherProps) {
  if (!forecast || forecast.hour === undefined || forecast.temps === undefined || !forecast.icon) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Données prévision indisponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hour}>{forecast.hour}h</Text>
      <Image
        source={{ uri: getIcon(forecast.icon) }}
        style={styles.image}
      />
      <Text style={styles.temp}>{Math.round(forecast.temps)}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
       backgroundColor: "white",
       height: 140,
       width: 75,
       paddingVertical: 6,
       justifyContent: "center",
       alignItems: "center",
       marginRight: 10,
       borderRadius: 50
    },
    hour: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    image: {
        width: 50,
        height: 50
    },
    temp: {
        fontSize: 18,
        fontWeight: "bold"
    },
    errorText: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
  },
})