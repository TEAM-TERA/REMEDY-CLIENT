import { View } from 'react-native';
import { useEffect, useRef, useState, memo } from 'react';
import { styles } from './styles';
import DiscSvg from './DiscSvg';

interface CdPlayerProps {
    imageUrl?: string;
    isPlaying?: boolean;
}

const MemoizedDiscSvg = memo(DiscSvg);

function CdPlayer({ imageUrl, isPlaying = true }: CdPlayerProps) {
    const [tilt, setTilt] = useState(0);
    const reqRef = useRef<number | null>(null);
    const lastTime = useRef<number>(0);

    useEffect(() => {
        // isPlaying이 false면 애니메이션을 시작하지 않음
        if (!isPlaying) {
            if (reqRef.current) {
                cancelAnimationFrame(reqRef.current);
                reqRef.current = null;
            }
            return;
        }

        const animate = (time: number) => {
            if (time - lastTime.current > 16) {
                setTilt(prev => (prev + 2) % 360);
                lastTime.current = time;
            }
            reqRef.current = requestAnimationFrame(animate);
        };
        reqRef.current = requestAnimationFrame(animate);

        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [isPlaying]);

    return (
        <View style={styles.container}>
            <MemoizedDiscSvg imageUrl={imageUrl} tilt={tilt} />
        </View>
    );
}

export default memo(CdPlayer);