import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../constants/colors';
import { styles } from '../styles/settingScreen';
import { SettingItemProps } from '../types/Setting';
import Icon from '../../../components/icon/Icon';
import { scale } from '../../../utils/scalers';

function SettingItem({
    title,
    onPress,
    showArrow = true,
    rightText,
    isDestructive = false,
}: SettingItemProps) {
    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            disabled={!onPress}
        >
            <Text
                style={[
                    styles.settingItemText,
                    isDestructive && styles.destructiveText,
                ]}
            >
                {title}
            </Text>
            <View>
                {rightText && (
                    <Text style={styles.rightText}>{rightText}</Text>
                )}
                {showArrow && (
                    <Icon
                        name="right"
                        width={scale(24)}
                        height={scale(24)}
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
