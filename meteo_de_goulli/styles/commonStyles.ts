import { StyleSheet } from 'react-native';

export const gaugeStyles = StyleSheet.create({
  container: {
    backgroundColor: '#4899be52',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    gap: 8,
    minHeight: 100,
  },
  value: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gaugeContainer: {
    width: '100%',
    alignItems: 'center',
  },
  gaugeBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 2,
  },
});