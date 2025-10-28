import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/settingScreen';
import { SettingSectionProps } from '../types/Setting';

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

export default SettingSection;