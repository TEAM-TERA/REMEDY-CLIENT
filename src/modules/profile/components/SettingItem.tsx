import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../constants/colors';
import settingScreen from '../styles/settingScreen';
import { SettingItemProps } from '../types/Setting';
import Icon from '../../../components/icon/Icon';

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
                    <Icon
                        name="right"
                        width={24}
                        height={24}
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
