import React from 'react';
import { View, Text, Image } from 'react-native';
import userProfileScreen from '../styles/userProfileScreen';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { PRIMARY_COLORS } from '../../../constants/colors';
import { DropItemProps } from '../types/DropItem';

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
                            <Entypo
                                name="heart"
                                size={45}
                                color="rgba(255, 71, 87, 0.8)"
                            />{' '}
                            {/* 투명도 위해 상수 사용 안함 */}
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
                        <SimpleLineIcons
                            name="location-pin"
                            size={16}
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
