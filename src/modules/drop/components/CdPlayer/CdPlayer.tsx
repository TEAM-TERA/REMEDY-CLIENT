import { Image, View } from "react-native";
import { styles } from "./styles";
import CircleSvg from "../CircleSvg/CircleSvg";
import CircleBlurSvg from "../CircleSvg/CircleBlurSvg";
import DiscSvg from "./DiscSvg";

function CdPlayer(){
    return(
        <View style = {styles.container}>
            <DiscSvg></DiscSvg>
            <CircleSvg></CircleSvg>
            <CircleBlurSvg></CircleBlurSvg>
        </View>
    )
}

export default CdPlayer;