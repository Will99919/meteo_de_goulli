import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { gaugeStyles } from '../styles/commonStyles';

interface WindStrengthProps {
  wind: {
    speed: number;
  };
}

const WindStrength: React.FC<WindStrengthProps> = ({ wind }) => {
  const speedKmH = Math.round(wind.speed * 3.6);
  // On limite la vitesse max à 100km/h pour la jauge
  const percentage = Math.min((speedKmH / 100) * 100, 100);

  return (
    <View style={gaugeStyles.container}>
        <MaterialCommunityIcons name="weather-windy" size={24} color="white" />
      <View style={gaugeStyles.gaugeContainer}>
        <Text style={gaugeStyles.value}>{speedKmH} km/h</Text>
      </View>
      <View style={gaugeStyles.gaugeContainer}>
        <View style={gaugeStyles.gaugeBackground}>
          <View 
            style={[
              gaugeStyles.gaugeFill, 
              { width: `${percentage}%`, backgroundColor: '#4FC3F7' }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

export default WindStrength;