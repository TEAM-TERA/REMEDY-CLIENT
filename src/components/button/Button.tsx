import { Text, View } from "react-native";
import { ButtonProps } from "../../types/Button";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../constants/typography";

function Button({title} : ButtonProps){
    return(
        <View style = {styles.container}>
            <Text style = {[styles.text, TYPOGRAPHY.BUTTON_TEXT]}>{title}</Text>
        </View>       
    )
}

export default Button;