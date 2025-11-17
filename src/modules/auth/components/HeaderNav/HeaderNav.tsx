import { Text, View } from "react-native";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../../../constants/typography";
import LeftArrowSvg from "../../../../components/icon/icons/LeftArrowSvg";
import Blank from "../Blank/Blank";

function HeaderNav({title}: {title: string}){
    return(
        <View style = {styles.container}>
            <LeftArrowSvg></LeftArrowSvg>
            <Text style = {[TYPOGRAPHY.SUBTITLE, styles.text]}>{title}</Text>
            <Blank></Blank>
        </View>
    )
}

export default HeaderNav;