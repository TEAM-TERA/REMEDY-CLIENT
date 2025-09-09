import { View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { styles } from './styles';
import DiscSvg from './DiscSvg';

interface CdPlayerProps {
    imageUrl: string;
}

function CdPlayer({ imageUrl }: CdPlayerProps) {
    const [tilt, setTilt] = useState(0);
    const reqRef = useRef<number | null>(null);

    useEffect(() => {
        const animate = () => {
            setTilt(prev => (prev + 1) % 360);
            reqRef.current = requestAnimationFrame(animate);
        };
        reqRef.current = requestAnimationFrame(animate);
        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, []);

    return (
        <View style={styles.container}>
            <DiscSvg imageUrl={imageUrl} tilt={tilt} />
        </View>
    );
}

export default CdPlayer;
