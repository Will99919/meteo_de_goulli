import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { gaugeStyles } from '../styles/commonStyles';

interface AirQualityGaugeProps {
  aqi: number;
}

const getAqiColor = (aqi: number) => {
  switch (aqi) {
    case 1: return '#00E400';
    case 2: return '#FFFF00'; 
    case 3: return '#FF7E00'; 
    case 4: return '#FF0000'; 
    case 5: return '#8F3F97'; 
    default: return '#4FC3F7';
  }
};

const getAqiText = (aqi: number) => {
  switch (aqi) {
    case 1: return 'Bon';
    case 2: return 'Moyen';
    case 3: return 'Médiocre';
    case 4: return 'Mauvais';
    case 5: return 'Très mauvais';
    default: return 'Inconnu';
  }
};

const AirQualityGauge: React.FC<AirQualityGaugeProps> = ({ aqi }) => {
  const percentage = (aqi / 5) * 100;

  return (
    <View style={gaugeStyles.container}>
      <MaterialCommunityIcons name="air-filter" size={24} color="white" />
      <Text style={gaugeStyles.value}>IQA: {getAqiText(aqi)}</Text>
      <View style={gaugeStyles.gaugeContainer}>
        <View style={gaugeStyles.gaugeBackground}>
          <View 
            style={[
              gaugeStyles.gaugeFill, 
              { width: `${percentage}%`, backgroundColor: getAqiColor(aqi) }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

export default AirQualityGauge;