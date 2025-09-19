export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
}

export interface ForecastResponse {
  list: WeatherData[];
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
}