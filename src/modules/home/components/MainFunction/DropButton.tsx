import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { styles } from '../../styles/MainFunction/DropButton';

type Props = {
  onPress?: () => void;
};

export default function DropButton({ onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Drop music"
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: true }}
      style={styles.container}
      hitSlop={12}
    >
      <View style={styles.outer}>
        <View style={styles.inner} />
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>DROP</Text>
      </View>
    </Pressable>
  );
}