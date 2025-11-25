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
}

const MusicNode = React.memo(function MusicNode({ data, isMain: _isMain, index: _index, baseAngle, rotation, baseRotation, mainNodeIndex, nodeIndex }: MusicNodeProps) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // 모든 노드가 같은 반지름의 원 위에 배치
    const radius = scale(120);

    const imageSource = React.useMemo(() => {
        if (data.songInfo?.albumImagePath && data.songInfo.albumImagePath.trim() !== "") {
            return { uri: data.songInfo.albumImagePath };
        }
        return require('../../../../assets/images/profileImage.png');
    }, [data.songInfo?.albumImagePath]);

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

        const normalizedAngle = ((currentAngle + 180) % 360) - 180;

        const distanceFromMain = Math.abs(normalizedAngle - (-90));

        const mainNodeIndexValue = mainNodeIndex?.value ?? 0;
        const isCurrentlyMain = mainNodeIndexValue === nodeIndex;

        const isVisible = distanceFromMain < 60;

        const opacity = isCurrentlyMain
            ? 1.0
            : isVisible
            ? interpolate(distanceFromMain, [0, 60], [0.8, 0.2], 'clamp')
            : 0.1;

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
        if (data.isDropOption) {
            switch (data.dropping.type) {
                case 'music':
                    navigate('Drop');
                    break;
                case 'playlist':
                    console.log('플레이리스트 드랍 선택됨');
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
    }, [navigation, data.dropping, data.songInfo, data.isDropOption]);


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
