import { View } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { styles } from './styles';
import DiscSvg from './DiscSvg';

interface CdPlayerProps {
    imageUrl?: string;
    isPlaying?: boolean;
}

function CdPlayer({ imageUrl, isPlaying = true }: CdPlayerProps) {
    const [tilt, setTilt] = useState(0);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isPlaying) {
            const animate = (timestamp: number) => {
                if (!startTimeRef.current) {
                    startTimeRef.current = timestamp;
                }

                const elapsed = timestamp - startTimeRef.current;
                const rotationValue = (elapsed / 3000) * 360; // 3초에 360도 회전

                setTilt(rotationValue % 360);

                if (__DEV__ && Math.random() < 0.01) {
                    console.log('🎵 CD rotation:', Math.round(rotationValue % 360), '°');
                }

                animationFrameRef.current = requestAnimationFrame(animate);
            };

            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            startTimeRef.current = null;
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying]);

    return (
        <View style={styles.container}>
            <DiscSvg imageUrl={imageUrl} tilt={tilt} />
        </View>
    );
}

export default CdPlayer;