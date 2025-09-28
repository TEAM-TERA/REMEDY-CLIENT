import { Image, View } from "react-native";
import { styles } from "./styles";
import CircleSvg from "../CircleSvg/CircleSvg";
import CircleBlurSvg from "../CircleSvg/CircleBlurSvg";
import DiscSvg from "./DiscSvg";

function CdPlayer({ imageUrl }: { imageUrl?: any }){
    return(
        <View style = {styles.container}>
            <DiscSvg imageUrl={imageUrl}></DiscSvg>
            <CircleSvg></CircleSvg>
            <CircleBlurSvg></CircleBlurSvg>
        </View>
    )
}

export default CdPlayer;