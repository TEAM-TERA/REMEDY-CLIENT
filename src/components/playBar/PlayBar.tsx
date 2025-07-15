import { View, Text } from "react-native";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../constants/typography";
import Slider from "@react-native-community/slider";
import PlaySvg from "./PlaySvg";

function PlayBar({currentTime, }){
    return(
        <View style = {styles.container}>
            <PlaySvg></PlaySvg>
            <Text style = {[TYPOGRAPHY.CAPTION_3, styles.timeText]}>{formatTime(currentTime)}</Text>
        </View>
    )
}

export default PlayBar;