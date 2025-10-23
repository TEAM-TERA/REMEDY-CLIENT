import React from 'react';
import { View, Text, Image } from 'react-native';
import userProfileScreen from '../styles/userProfileScreen';
import { PRIMARY_COLORS } from '../../../constants/colors';
import { DropItemProps } from '../types/DropItem';
import Icon from '../../../components/icon/Icon';

function DropItem({
    memo,
    location,
    imageSource,
    hasHeart = false,
}: DropItemProps) {
    return (
        <View style={userProfileScreen.dropBox}>
            <View style={userProfileScreen.dropBoxFrame}>
                <View style={userProfileScreen.dropMusic}>
                    <Image
                        source={imageSource}
                        style={userProfileScreen.albumImage}
                    />
                    {hasHeart && (
                        <View style={userProfileScreen.heartOverlay}>
                            <Icon
                                name="heart"
                                width={24}
                                height={24}
                                color="rgba(255, 71, 87, 0.8)"
                            />
                        </View>
                    )}
                    <View style={userProfileScreen.albumDisk}>
                        <View style={userProfileScreen.albumDiskSmall} />
                    </View>
                </View>

                <View style={userProfileScreen.memoContainer}>
                    <Text
                        style={userProfileScreen.memoText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {memo}
                    </Text>
                    <View style={userProfileScreen.location}>
                        <Icon
                            name="location"
                            width={16}
                            height={16}
                            color={PRIMARY_COLORS.PLUS_TWENTY}
                        />
                        <Text style={userProfileScreen.locationText}>
                            {location}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
export default DropItem;
