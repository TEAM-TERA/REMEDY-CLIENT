import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, DerivedValue } from 'react-native-reanimated';
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
    baseRotation: SharedValue<number>;
    mainNodeIndex: DerivedValue<number>;
    nodeIndex: number;
}

const MusicNode = React.memo(function MusicNode({ data, isMain: _isMain, index: _index, baseAngle, rotation, baseRotation, mainNodeIndex, nodeIndex }: MusicNodeProps) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // 컨테이너 크기(scale(300))의 반지름에서 노드 크기와 여유 공간을 뺀 값
    const containerSize = scale(300);
    const nodeSize = scale(64); // 메인 노드 크기
    const padding = scale(10); // 여유 공간
    const radius = (containerSize / 2) - (nodeSize / 2) - padding;

    const imageSource = React.useMemo(() => {
        console.log('MusicNode imageSource 계산:', {
            songId: data.dropping?.songId,
            hasSongInfo: !!data.songInfo,
            albumImagePath: data.songInfo?.albumImagePath,
            songInfoKeys: data.songInfo ? Object.keys(data.songInfo) : []
        });
        
        if (data.songInfo?.albumImagePath && data.songInfo.albumImagePath.trim() !== "") {
            return { uri: data.songInfo.albumImagePath };
        }
        return require('../../../../assets/images/profileImage.png');
    }, [data.songInfo?.albumImagePath, data.dropping?.songId]);

    const animatedStyle = useAnimatedStyle(() => {
        'worklet';

        // baseAngle + 누적 회전값(baseRotation) + 현재 제스처 회전값(rotation)을 더해서 동적으로 회전
        // undefined 체크를 통해 안전하게 처리
        const baseRotationValue = baseRotation?.value ?? 0;
        const rotationValue = rotation?.value ?? 0;
        const totalRotation = baseRotationValue + rotationValue;
        const currentAngle = baseAngle + totalRotation;
        const angleInRadians = (currentAngle * Math.PI) / 180;

        // 현재 이 노드가 메인 노드인지 동적으로 확인
        const mainNodeIndexValue = mainNodeIndex?.value ?? 0;
        const isCurrentlyMain = mainNodeIndexValue === nodeIndex;

        // 각도에 따라 반지름 조정 (하단 노드는 더 바깥으로)
        // -180도(왼쪽) ~ 0도(오른쪽) 범위에서 -90도(아래)가 최대
        const normalizedAngle = ((currentAngle + 180) % 360) - 180;
        const distanceFromBottom = Math.abs(normalizedAngle - (-90)); // -90도(아래)와의 거리
        
        // 메인 노드는 반지름 조정 안 함
        let radiusMultiplier = 1.0;
        if (!isCurrentlyMain && distanceFromBottom < 45) {
          // -90도 근처(±45도)는 반지름 증가 (최대 +30%)
          radiusMultiplier = 1.0 + (0.3 * (1 - distanceFromBottom / 45));
        }
        
        const dynamicRadius = radius * radiusMultiplier;

        // 투명도: 메인 노드는 완전히 선명, 서브 노드는 40%
        const opacity = isCurrentlyMain ? 1.0 : 0.4;

        // 스케일: 메인 노드는 64px(1.0), 서브 노드는 48px(0.75)로 통일
        const nodeScale = isCurrentlyMain ? 1.0 : 0.75;

        return {
            transform: [
                {
                    translateX: Math.cos(angleInRadians) * dynamicRadius,
                },
                {
                    translateY: Math.sin(angleInRadians) * dynamicRadius,
                },
                {
                    scale: nodeScale,
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
