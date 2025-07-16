import { Text, View } from "react-native";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { HistoryProps } from "../../types/History";
import XSvg from "../XSvg/XSvg";

function History({musicTitle} : HistoryProps){
    return(
        <View style = {styles.container}>
            <Text style = {[TYPOGRAPHY.CAPTION_3, styles.text]}>{musicTitle}</Text>
            <XSvg></XSvg>
        </View>        
    )
}

export default History;