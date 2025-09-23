import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { gaugeStyles } from '../styles/commonStyles';

interface UVIndexProps {
  uvi: number;
}

const getUVColor = (uvi: number) => {
  if (uvi <= 2) return '#4FC3F7';
  if (uvi <= 5) return '#FFD700';
  if (uvi <= 7) return '#FFA500';
  if (uvi <= 10) return '#FF4500';
  return '#8F3F97';
};

const getUVText = (uvi: number) => {
  if (uvi <= 2) return 'Faible';
  if (uvi <= 5) return 'Modéré';
  if (uvi <= 7) return 'Élevé';
  if (uvi <= 10) return 'Très élevé';
  return 'Extrême';
};

const UVIndex: React.FC<UVIndexProps> = ({ uvi }) => {
  const percentage = (uvi / 11) * 100;

  return (
    <View style={gaugeStyles.container}>
      <MaterialCommunityIcons name="white-balance-sunny" size={24} color="white" />
      <Text style={gaugeStyles.value}>UV: {getUVText(uvi)}</Text>
      <View style={gaugeStyles.gaugeContainer}>
        <View style={gaugeStyles.gaugeBackground}>
          <View 
            style={[
              gaugeStyles.gaugeFill, 
              { width: `${Math.min(percentage, 100)}%`, backgroundColor: getUVColor(uvi) }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

export default UVIndex;