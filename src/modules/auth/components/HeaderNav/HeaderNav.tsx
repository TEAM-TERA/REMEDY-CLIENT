import { Text, View } from "react-native";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../../../constants/typography";

function HaderNav(){
    return(
        <View style = {styles.container}>
            <Text style = {[TYPOGRAPHY.SUBTITLE, styles.text]}></Text>
        </View>
    )
}