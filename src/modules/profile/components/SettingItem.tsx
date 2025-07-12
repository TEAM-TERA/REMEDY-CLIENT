import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../constants/colors';
import settingScreen from '../styles/settingScreen';
import { SettingItemProps } from '../types/Setting';

function SettingItem({
    title,
    onPress,
    showArrow = true,
    rightText,
    isDestructive = false,
}: SettingItemProps) {
    return (
        <TouchableOpacity
            style={settingScreen.settingItem}
            onPress={onPress}
            disabled={!onPress}
        >
            <Text
                style={[
                    settingScreen.settingItemText,
                    isDestructive && settingScreen.destructiveText,
                ]}
            >
                {title}
            </Text>
            <View>
                {rightText && (
                    <Text style={settingScreen.rightText}>{rightText}</Text>
                )}
                {showArrow && (
                    <Entypo
                        name="chevron-right"
                        size={20}
                        color={
                            isDestructive
                                ? PRIMARY_COLORS.DEFAULT
                                : TEXT_COLORS.DEFAULT
                        }
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

export default SettingItem;
