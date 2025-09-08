import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicNode';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../types/navigation';
import { Dropping } from '../../types/musicList';

interface MusicNodeProps {
    data: Dropping;
    isMain: boolean;
    index: number;
}

function MusicNode({ data, isMain, index }: MusicNodeProps) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // 각 노드의 반지름 설정. 클수록 원의 중심에서 멀어짐.
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
        // 화면에 보일 세가지 노드의 각 위치 설정
        switch (index) {
            case 0:
                return -100; // 12시 방향
            case 1:
                return -145; // 11시 방향
            case 2:
                return 180; // 10시 방향
            default:
                return 0;
        }
    };

    const angle = getAngle();

    // 원형 좌표 계산
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
          droppingId: data.droppingId,
          title: data.title,
          artist: data.singer,
          location: data.address,
        });
    };

    return (
        <Animated.View style={[styles.nodeContainer, animatedStyle]}>
            <TouchableOpacity
                onPress={handlePress}
                style={isMain ? styles.container : styles.subContainer}
            >
                <Image
                    source={data.imageSource}
                    style={isMain ? styles.musicImg : styles.subMusicImg}
                />
                <Text style={isMain ? styles.musicTitle : styles.subMusicTitle}>
                    {data.title}
                </Text>
                <Text style={isMain ? styles.singerText : styles.subSingerText}>
                    {data.singer}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default MusicNode;
