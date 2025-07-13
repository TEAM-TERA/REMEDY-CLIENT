import { Text, View } from "react-native";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../../../constants/typography";
import BackSvg from "../BackSvg/BackSvg";

function HeaderNav(){
    return(
        <View style = {styles.container}>
            <BackSvg></BackSvg>
            <Text style = {[TYPOGRAPHY.SUBTITLE, styles.text]}></Text>
        </View>
    )
}

export default HeaderNav;