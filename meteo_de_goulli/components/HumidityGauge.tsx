import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { gaugeStyles } from '../styles/commonStyles';

interface HumidityGaugeProps {
  humidity: number;
}

export const HumidityGauge: React.FC<HumidityGaugeProps> = ({ humidity }) => {
  return (
    <View style={gaugeStyles.container}>
      <MaterialCommunityIcons name="water" size={24} color="white" />
      <Text style={gaugeStyles.value}>{humidity}%</Text>
      <View style={gaugeStyles.gaugeContainer}>
        <View style={gaugeStyles.gaugeBackground}>
          <View 
            style={[
              gaugeStyles.gaugeFill, 
              { width: `${humidity}%`, backgroundColor: '#4FC3F7' }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

export default HumidityGauge;