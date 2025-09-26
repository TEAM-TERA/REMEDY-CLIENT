import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicNode';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../types/navigation';

interface MusicNodeProps {
    data: {
        dropping: any;
        songInfo?: any;
    };
    isMain: boolean;
    index: number;
}

function MusicNode({ data, isMain, index }: MusicNodeProps) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const getRadius = () => {
        switch (index) {
            case 0:
                return 110;
            case 1:
                return 120;
            case 2:
                return 150;
            default:
                return 50;
        }
    };

    const radius = getRadius();

    const getAngle = () => {
        switch (index) {
            case 0:
                return -100;
            case 1:
                return -145;
            case 2:
                return 180;
            default:
                return 0;
        }
    };

    const angle = getAngle();

    const animatedStyle = useAnimatedStyle(() => {
        'worklet';
        const angleInRadians = (angle * Math.PI) / 180;

        return {
            transform: [
                {
                    translateX: Math.cos(angleInRadians) * radius,
                },
                {
                    translateY: Math.sin(angleInRadians) * radius,
                },
            ],
            opacity: isMain ? 1.0 : 0.8,
        };
    });

    const handlePress = () => {
        navigation.navigate('Music', {
          droppingId: data.dropping.droppingId,
          songId: data.dropping.songId,
          title: data.songInfo?.title || '드랍핑 음악',
          artist: data.songInfo?.artist || '알 수 없는 아티스트',
          location: data.dropping.address,
        });
    };

    return (
        <Animated.View style={[styles.nodeContainer, animatedStyle]}>
            <TouchableOpacity
                onPress={handlePress}
                style={isMain ? styles.container : styles.subContainer}
            >
                <Image
                    source={require('../../../../assets/images/profileImage.png')}
                    style={isMain ? styles.musicImg : styles.subMusicImg}
                />
                <Text style={isMain ? styles.musicTitle : styles.subMusicTitle}>
                    {data.songInfo?.title || '드랍핑 음악'}
                </Text>
                <Text style={isMain ? styles.singerText : styles.subSingerText}>
                    {data.songInfo?.artist || '알 수 없는 아티스트'}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default MusicNode;
