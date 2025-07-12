import React from 'react';
import { View, Text } from 'react-native';
import settingScreen from '../styles/settingScreen';
import { SettingSectionProps } from '../types/Setting';

function SettingSection({ title, children }: SettingSectionProps) {
    return (
        <View style={settingScreen.section}>
            <Text style={settingScreen.sectionTitle}>{title}</Text>
            <View>{children}</View>
        </View>
    );
}

export default SettingSection;
