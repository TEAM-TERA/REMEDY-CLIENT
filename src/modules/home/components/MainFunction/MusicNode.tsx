import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, DerivedValue } from 'react-native-reanimated';
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
    baseAngle: number;
    rotation: SharedValue<number>;
    mainNodeIndex: DerivedValue<number>;
    nodeIndex: number;
}

function MusicNode({ data, isMain: _isMain, index: _index, baseAngle, rotation, mainNodeIndex, nodeIndex }: MusicNodeProps) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // 모든 노드가 같은 반지름의 원 위에 배치
    const radius = 120;

    const animatedStyle = useAnimatedStyle(() => {
        'worklet';

        // baseAngle + rotation 값을 더해서 동적으로 회전
        const currentAngle = baseAngle + rotation.value;
        const angleInRadians = (currentAngle * Math.PI) / 180;

        // 현재 각도를 -180 ~ 180 범위로 정규화
        const normalizedAngle = ((currentAngle + 180) % 360) - 180;

        // 메인 위치(-120°) 기준으로 투명도와 스케일 계산 (더 정확한 범위)
        const distanceFromMain = Math.abs(normalizedAngle - (-120));

        // 현재 이 노드가 메인 노드인지 동적으로 확인
        const isCurrentlyMain = mainNodeIndex.value === nodeIndex;

        // 전체 노드들의 기본 가시성 (60도 범위)
        const isVisible = distanceFromMain < 60;

        // 투명도: 메인 노드는 완전히 선명, 나머지는 거리에 따라
        const opacity = isCurrentlyMain
            ? 1.0
            : isVisible
            ? interpolate(distanceFromMain, [0, 60], [0.8, 0.2], 'clamp')
            : 0.1;

        // 스케일: 메인 노드는 크게, 나머지는 작게
        const scale = isCurrentlyMain
            ? 1.0
            : isVisible
            ? interpolate(distanceFromMain, [0, 60], [0.85, 0.6], 'clamp')
            : 0.5;

        return {
            transform: [
                {
                    translateX: Math.cos(angleInRadians) * radius,
                },
                {
                    translateY: Math.sin(angleInRadians) * radius,
                },
                {
                    scale: scale,
                },
            ],
            opacity: opacity,
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
                style={styles.container}
            >
                <Image
                    source={data.dropping.imageSource || require('../../../../assets/images/profileImage.png')}
                    style={styles.musicImg}
                />
                <Text style={styles.musicTitle}>
                    {data.songInfo?.title || data.dropping.title || '드랍핑 음악'}
                </Text>
                <Text style={styles.singerText}>
                    {data.songInfo?.artist || data.dropping.singer || '알 수 없는 아티스트'}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default MusicNode;
