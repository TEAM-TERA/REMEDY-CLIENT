import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFPS } from '../utils/useFPS';

export function FPSCounter() {
  const fps = useFPS();

  if (!__DEV__) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, fps < 50 && styles.warning, fps < 30 && styles.danger]}>
        {fps} FPS
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
    zIndex: 9999,
  },
  text: {
    color: '#00ff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  warning: {
    color: '#ffaa00',
  },
  danger: {
    color: '#ff0000',
  },
});
