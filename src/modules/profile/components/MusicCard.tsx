import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from '../../../components/icon/Icon';
import { scale, verticalScale } from '../../../utils/scalers';
import { TEXT_COLORS, FORM_COLORS, PRIMARY_COLORS } from '../../../constants/colors';
import type { DropItemData } from '../types/DropItemData';
import { TYPOGRAPHY } from '../../../constants/typography';

interface MusicCardProps {
    item: DropItemData;
}

const SmallCDIcon = () => (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <Circle cx="40" cy="40" r="39.5" fill="#2A2A2A" stroke="#404040" />
        <Circle cx="40" cy="40" r="15" fill="#E61F54" />
    </Svg>
);

const MusicCard: React.FC<MusicCardProps> = ({ item }) => {
    return (
        <View style={styles.musicItemContainer}>
            <View style={styles.musicCard}>
                <View style={styles.albumCoverContainer}>
                    <View style={styles.cdOverlay}>
                        <SmallCDIcon />
                    </View>
                    <Image
                        source={item.imageSource || require('../../../assets/images/profileImage.png')}
                        style={styles.albumCover}
                    />
                </View>

                <View style={styles.musicContent}>
                    <Text style={styles.musicTitle} numberOfLines={3}>
                        {item.memo || "알 수 없는 곡"}
                    </Text>
                </View>

                <TouchableOpacity style={styles.moreOptionsButton}>
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                </TouchableOpacity>
            </View>

            <View style={styles.locationTagsContainer}>
                <Icon name="location" width={scale(16)} height={scale(18)} color={PRIMARY_COLORS.DEFAULT} />
                {item.location && item.location.split(' ').map((locationPart, partIndex) => (
                    <View key={partIndex} style={styles.locationTag}>
                        <Text style={styles.locationTagText}>
                            {locationPart}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    musicItemContainer: {
        gap: scale(8),
    },
    musicCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        borderRadius: scale(8),
        gap: scale(12),
        shadowColor: '#0F0F24',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 25,
        elevation: 12,
    },
    albumCoverContainer: {
        position: 'relative',
        width: scale(100),
        height: scale(100),
    },
    albumCover: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(8),
        backgroundColor: '#333333',
    },
    cdOverlay: {
        position: 'absolute',
        top: scale(10),
        left: scale(54),
        width: scale(80),
        height: scale(80),
    },
    musicContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: scale(8),
        paddingLeft: scale(8),
    },
    musicTitle: {
        ...TYPOGRAPHY.BODY_1,
        textAlign: 'left',
        width: '100%',
        color: PRIMARY_COLORS.DEFAULT,
        maxHeight: scale(68),
        marginLeft: scale(18),
    },
    moreOptionsButton: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: scale(8),
        width: scale(18),
    },
    moreDot: {
        width: scale(3),
        height: scale(3),
        backgroundColor: TEXT_COLORS.CAPTION_1,
        borderRadius: scale(1.5),
        marginBottom: scale(4.5),
    },
    locationTagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: scale(4),
        marginTop: scale(8),
    },
    locationTag: {
        backgroundColor: FORM_COLORS.BACKGROUND_1,
        borderWidth: 1,
        borderColor: FORM_COLORS.STROKE,
        borderRadius: scale(24),
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
    },
    locationTagText: {
        color: '#F23F6F',
        fontSize: scale(14),
        fontWeight: '500',
        lineHeight: scale(16),
    },
});

export default MusicCard;