import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '../icon/Icon';
import { scale, verticalScale } from '../../utils/scalers';
import { TEXT_COLORS, FORM_COLORS } from '../../constants/colors';

interface ProfileHeaderProps {
    onSettingPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onSettingPress }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                <Icon name="left" width={scale(18)} height={scale(18)} color={TEXT_COLORS.CAPTION_1} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
                <View style={styles.headerIconContainer}>
                    <Icon name="user" width={scale(14)} height={scale(16)} color={TEXT_COLORS.BUTTON} />
                </View>
                <Text style={styles.headerTitle}>프로필</Text>
            </View>

            <TouchableOpacity onPress={onSettingPress} style={styles.headerButton}>
                <Icon name="setting" width={scale(24)} height={scale(24)} color={TEXT_COLORS.CAPTION_1} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        height: scale(48),
    },
    headerButton: {
        width: scale(24),
        height: scale(24),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: FORM_COLORS.BACKGROUND_3,
        paddingHorizontal: scale(16),
        paddingVertical: scale(4),
        borderRadius: scale(16),
        gap: scale(8),
    },
    headerIconContainer: {
        width: scale(24),
        height: scale(24),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: TEXT_COLORS.CAPTION_1,
        fontSize: scale(16),
        fontWeight: '500',
        lineHeight: scale(22),
    },
});

export default ProfileHeader;