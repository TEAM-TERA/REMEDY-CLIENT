import { Image, View } from "react-native";
import { styles } from "./styles";
import CircleSvg from "../CircleSvg/CircleSvg";
import CircleBlurSvg from "../CircleSvg/CircleBlurSvg";
import DiscSvg from "./DiscSvg";

function CdPlayer(){
    return(
        <View style = {styles.container}>
            <DiscSvg imageUrl="https://entertainimg.kbsmedia.co.kr/cms/uploads/CONTENTS_20230425095757_b457a570577d7444e7cef5c0a6e73bd7.png"></DiscSvg>
            <CircleSvg></CircleSvg>
            <CircleBlurSvg></CircleBlurSvg>
        </View>
    )
}

export default CdPlayer;