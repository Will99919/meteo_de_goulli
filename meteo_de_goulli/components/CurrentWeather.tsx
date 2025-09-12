import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { isSameDay } from 'date-fns';



interface Forecast {
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
}

interface ForecastResponse {
  city: {
    name: string;
    timezone: number;
  };
  list: Forecast[];
}

const getIcon = (icon: string) => `https://openweathermap.org/img/wn/${icon}@4x.png`;

interface CurrentWeatherProps {
    data: ForecastResponse;
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
    const [CurrentWeather, setCurrentWeather] = useState<Forecast | null>(null);

    useEffect(() => {
        const currentW = data.list.filter(forecast => {
            const today = new Date(new Date().getTime() + data.city.timezone * 1000);
            const forecastDate = new Date(forecast.dt * 1000);
            return isSameDay(today, forecastDate);
        })
        setCurrentWeather(currentW[0] || null);
    }, [data]);

    if (!CurrentWeather) {
        return (
            <View style={style.container}>
                <Text style={style.errorText}>Aucune donnée météo disponible pour aujourd&apos;hui</Text>
            </View>
        )
    }
    return (
    <View style={style.container}>
      <Text style={style.city}>{data?.city.name}</Text>
      <Text style={style.today}>Aujourd&apos;hui</Text>
      <Image
        source={{ uri: getIcon(CurrentWeather?.weather[0].icon) }}
        style={style.image}
      />
      <Text style={style.temp}>{Math.round(CurrentWeather.main.temp)}°C</Text>
      <Text style={style.description}>{CurrentWeather.weather[0].description}</Text>
    </View>
  );
}

const COLOR = "#54565b"

const style = StyleSheet.create ({
    container: {
        marginTop: 60,
        alignItems: 'center',
        height: "65%"
    },
    city: {
        fontSize: 36,
        fontWeight: "500",
        color: COLOR,
    },
    today: {
        fontSize: 24,
        fontWeight: "300",
        color: COLOR,
    },
    image: {
        width: 150,
        height: 150,
        marginVertical: 20,
    },
    temp: {
        fontSize: 80,
        fontWeight: "bold",
        color: COLOR,
    },
    description: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLOR,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
  },
})