import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from '../../../components/icon/Icon';
import { scale, verticalScale } from '../../../utils/scalers';
import { TEXT_COLORS, FORM_COLORS, BACKGROUND_COLORS } from '../../../constants/colors';

interface ProfileInfoProps {
    username?: string;
    onEditPress: () => void;
}

const ProfileIcon = () => (
    <Svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <Circle cx="36" cy="36" r="36" fill="#E61F54" />
        <Circle cx="36" cy="25" r="12" fill="#101118" />
        <Circle cx="36" cy="36" r="28" stroke="#101118" strokeWidth="8" fill="none" />
    </Svg>
);

const ProfileInfo: React.FC<ProfileInfoProps> = ({ username = 'User_1', onEditPress }) => {
    return (
        <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
                <ProfileIcon />
            </View>
            <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{username}</Text>
                    <TouchableOpacity onPress={onEditPress}>
                        <Icon name="edit" width={scale(20)} height={scale(20)} color={TEXT_COLORS.CAPTION_1} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.userDescription}>
                    나이 18세, 음악 좋아함{'\n'}~~~~~~~~~{'\n'}~~~~~~~~
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileSection: {
        backgroundColor: FORM_COLORS.BACKGROUND_3,
        borderRadius: scale(12),
        padding: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        marginTop: verticalScale(24),
    },
    profileImageContainer: {
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
        borderRadius: scale(50),
        padding: scale(14),
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
        gap: scale(8),
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    userName: {
        color: TEXT_COLORS.BUTTON,
        fontSize: scale(24),
        fontWeight: 'bold',
        lineHeight: scale(32),
    },
    userDescription: {
        color: TEXT_COLORS.CAPTION_1,
        fontSize: scale(14),
        fontWeight: '500',
        lineHeight: scale(20),
    },
});

export default ProfileInfo;