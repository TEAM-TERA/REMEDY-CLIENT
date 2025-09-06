import { Image, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { styles } from "./styles";
import CircleSvg from "../CircleSvg/CircleSvg";
import CircleBlurSvg from "../CircleSvg/CircleBlurSvg";
import DiscSvg from "./DiscSvg";

function CdPlayer() {
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
        <View style = {styles.container}>
            <DiscSvg
                imageUrl = "https://entertainimg.kbsmedia.co.kr/cms/uploads/CONTENTS_20230425095757_b457a570577d7444e7cef5c0a6e73bd7.png"
                tilt = {tilt}
            ></DiscSvg>
            <CircleSvg></CircleSvg>
            <CircleBlurSvg></CircleBlurSvg>
        </View>
    )
}

export default CdPlayer;