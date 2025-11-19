import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, DerivedValue } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicNode';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../types/navigation';
import { scale } from '../../../../utils/scalers';

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

const MusicNode = React.memo(function MusicNode({ data, isMain: _isMain, index: _index, baseAngle, rotation, mainNodeIndex, nodeIndex }: MusicNodeProps) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // 모든 노드가 같은 반지름의 원 위에 배치
    const radius = scale(120);

    const imageSource = React.useMemo(() => {
        if (data.songInfo?.albumImagePath && data.songInfo.albumImagePath.trim() !== "") {
            return { uri: data.songInfo.albumImagePath };
        }
        return require('../../../../assets/images/profileImage.png');
    }, [data.songInfo?.albumImagePath]);

    const animatedStyle = useAnimatedStyle(() => {
        'worklet';

        // baseAngle + rotation 값을 더해서 동적으로 회전
        const currentAngle = baseAngle + rotation.value;
        const angleInRadians = (currentAngle * Math.PI) / 180;

        // 현재 각도를 -180 ~ 180 범위로 정규화
        const normalizedAngle = ((currentAngle + 180) % 360) - 180;

        // 메인 위치(-60°) 기준으로 투명도와 스케일 계산 (더 정확한 범위)
        const distanceFromMain = Math.abs(normalizedAngle - (-60));

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

        // 스케일: 메인 노드는 64px(1.0), 서브 노드는 48px(0.75)로 통일
        const scale = isCurrentlyMain ? 1.0 : 0.75;

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

    const handlePress = React.useCallback(() => {
        navigation.navigate('Music', {
          droppingId: data.dropping.droppingId,
          songId: data.dropping.songId,
          title: data.songInfo?.title || '드랍핑 음악',
          artist: data.songInfo?.artist || '알 수 없는 아티스트',
          location: data.dropping.address,
          message: data.dropping.content,
        });
    }, [navigation, data.dropping.droppingId, data.dropping.songId, data.dropping.address, data.dropping.content, data.songInfo?.title, data.songInfo?.artist]);


    return (
        <Animated.View style={[styles.nodeContainer, animatedStyle]}>
            <TouchableOpacity
                onPress={handlePress}
                style={styles.container}
            >
                <Image
                    source={imageSource}
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
}, (prevProps, nextProps) => {
    // rotation과 mainNodeIndex는 SharedValue/DerivedValue이므로 참조 비교로 충분
    // 실제 값 변경은 worklet 내부에서 처리됨
    return (
        prevProps.data.dropping.droppingId === nextProps.data.dropping.droppingId &&
        prevProps.data.dropping.songId === nextProps.data.dropping.songId &&
        prevProps.baseAngle === nextProps.baseAngle &&
        prevProps.nodeIndex === nextProps.nodeIndex &&
        prevProps.data.songInfo?.albumImagePath === nextProps.data.songInfo?.albumImagePath &&
        prevProps.data.songInfo?.title === nextProps.data.songInfo?.title &&
        prevProps.data.songInfo?.artist === nextProps.data.songInfo?.artist
    );
});

export default MusicNode;
