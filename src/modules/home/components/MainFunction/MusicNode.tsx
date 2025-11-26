import React from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, DerivedValue } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicNode';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../types/navigation';
import { scale } from '../../../../utils/scalers';
import Icon from '../../../../components/icon/Icon';
import { navigate } from '../../../../navigation';

interface MusicNodeProps {
    data: {
        dropping: any;
        songInfo?: any;
        isDropOption?: boolean;
    };
    isMain: boolean;
    index: number;
    baseAngle: number;
    rotation: SharedValue<number>;
    baseRotation: SharedValue<number>;
    mainNodeIndex: DerivedValue<number>;
    nodeIndex: number;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
    currentAddress?: string;
}

const MusicNode = React.memo(function MusicNode({ data, isMain: _isMain, index: _index, baseAngle, rotation, baseRotation, mainNodeIndex, nodeIndex, currentLocation, currentAddress }: MusicNodeProps) {
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

    // 드랍 옵션별 아이콘과 색상 설정
    const getDropOptionInfo = React.useMemo(() => {
        if (!data.isDropOption) return null;

        switch (data.dropping.type) {
            case 'music':
                return { iconName: 'music' as const, color: '#E61F54' };
            case 'playlist':
                return { iconName: 'playlist' as const, color: '#EF9210' };
            case 'debate':
                return { iconName: 'debate' as const, color: '#6210EF' };
            default:
                return { iconName: 'music' as const, color: '#E61F54' };
        }
    }, [data.isDropOption, data.dropping.type]);

    const animatedStyle = useAnimatedStyle(() => {
        'worklet';
        if (data.isDropOption) {
            const angleInRadians = (baseAngle * Math.PI) / 180;
            const translateX = Math.cos(angleInRadians) * radius;
            const translateY = Math.sin(angleInRadians) * radius;
            return {
                transform: [
                    {
                        translateX: translateX,
                    },
                    {
                        translateY: translateY,
                    },
                    {
                        scale: 1.0,
                    },
                ],
                opacity: 1.0,
            };
        }
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
        if (data.isDropOption) {
            switch (data.dropping.type) {
                case 'music':
                    navigate('Drop');
                    break;
                case 'playlist':
                    if (currentLocation && currentAddress) {
                        navigate('PlaylistSelection', {
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            address: currentAddress,
                        });
                    } else {
                        console.warn('위치 정보가 없습니다.');
                    }
                    break;
                case 'debate':
                    navigate('DebateDrop');
                    break;
            }
            return;
        }

        navigation.navigate('Music', {
          droppingId: data.dropping.droppingId,
          songId: data.dropping.songId,
          title: data.songInfo?.title || '드랍핑 음악',
          artist: data.songInfo?.artist || '알 수 없는 아티스트',
          location: data.dropping.address,
          message: data.dropping.content,
        });
    }, [navigation, data.dropping, data.songInfo, data.isDropOption, currentLocation, currentAddress]);


    return (
        <Animated.View style={[styles.nodeContainer, animatedStyle]}>
            <TouchableOpacity
                onPress={handlePress}
                style={styles.container}
            >
                {data.isDropOption ? (
                    <>
                        <View style={[styles.musicImg, { backgroundColor: '#161622', justifyContent: 'center', alignItems: 'center' }]}>
                            <Icon
                                name={getDropOptionInfo?.iconName || 'music'}
                                width={32}
                                height={32}
                                color={getDropOptionInfo?.color || '#E61F54'}
                            />
                        </View>
                        <Text style={[styles.musicTitle, { color: getDropOptionInfo?.color || '#E61F54' }]}>
                            {data.dropping.title}
                        </Text>
                        <Text style={styles.singerText}>
                            {data.dropping.type === 'music' ? '' :
                             data.dropping.type === 'playlist' ? '' : ''}
                        </Text>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.data.dropping.droppingId === nextProps.data.dropping.droppingId &&
        prevProps.data.dropping.songId === nextProps.data.dropping.songId &&
        prevProps.baseAngle === nextProps.baseAngle &&
        prevProps.nodeIndex === nextProps.nodeIndex &&
        prevProps.data.isDropOption === nextProps.data.isDropOption &&
        prevProps.data.songInfo?.albumImagePath === nextProps.data.songInfo?.albumImagePath &&
        prevProps.data.songInfo?.title === nextProps.data.songInfo?.title &&
        prevProps.data.songInfo?.artist === nextProps.data.songInfo?.artist
    );
});

export default MusicNode;
