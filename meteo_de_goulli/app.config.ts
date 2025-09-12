import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: config.name || 'Meteo de Goulli',
    slug: config.slug || 'meteo-de-goulli',
    extra: {
      ...config.extra,
      openWeatherApiKey: process.env.OPENWEATHER_API_KEY || 'fallback_key',
    },
  };
};