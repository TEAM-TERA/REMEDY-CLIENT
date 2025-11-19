import { View } from 'react-native';
import { useEffect, memo, useState, useCallback } from 'react';
import { useSharedValue, withRepeat, withTiming, cancelAnimation, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { styles } from './styles';
import DiscSvg from './DiscSvg';

interface CdPlayerProps {
    imageUrl?: string;
    isPlaying?: boolean;
}

function CdPlayer({ imageUrl, isPlaying = true }: CdPlayerProps) {
    const rotation = useSharedValue(0);
    const [tilt, setTilt] = useState(0);

    const updateTilt = useCallback((value: number) => {
        setTilt(value);
    }, []);

    useEffect(() => {
        if (isPlaying) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 3000 }),
                -1,
                false
            );
        } else {
            cancelAnimation(rotation);
        }
    }, [isPlaying, rotation]);

    useAnimatedReaction(
        () => rotation.value,
        (value) => {
            runOnJS(updateTilt)(value);
        },
        []
    );

    return (
        <View style={styles.container}>
            <DiscSvg imageUrl={imageUrl} tilt={tilt} />
        </View>
    );
}

export default memo(CdPlayer);