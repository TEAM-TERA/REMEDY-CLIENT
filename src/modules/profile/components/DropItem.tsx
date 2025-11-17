import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../styles/userProfileScreen';
import { PRIMARY_COLORS } from '../../../constants/colors';
import { DropItemProps } from '../types/DropItem';
import Icon from '../../../components/icon/Icon';
import { scale } from '../../../utils/scalers';

function DropItem({
    memo,
    location,
    imageSource,
    hasHeart = false,
}: DropItemProps) {
    return (
        <View style={styles.dropBox}>
            <View style={styles.dropBoxFrame}>
                <View style={styles.dropMusic}>
                    <Image
                        source={imageSource}
                        style={styles.albumImage}
                    />
                    {hasHeart && (
                        <View style={styles.heartOverlay}>
                            <Icon
                                name="heart"
                                width={scale(24)}
                                height={scale(24)}
                                color="rgba(255, 71, 87, 0.8)"
                            />
                        </View>
                    )}
                    <View style={styles.albumDisk}>
                        <View style={styles.albumDiskSmall} />
                    </View>
                </View>

                <View style={styles.memoContainer}>
                    <Text
                        style={styles.memoText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {memo}
                    </Text>
                    <View style={styles.location}>
                        <Icon
                            name="location"
                            width={scale(16)}
                            height={scale(16)}
                            color={PRIMARY_COLORS.PLUS_TWENTY}
                        />
                        <Text style={styles.locationText}>
                            {location}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
export default DropItem;

