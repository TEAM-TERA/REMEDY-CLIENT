import { Text, View, TouchableOpacity } from "react-native";
import { ButtonProps } from "../../types/Button";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../constants/typography";

function Button({title, onPress, disabled, style, textStyle} : ButtonProps){
    return(
        <TouchableOpacity 
        onPress={onPress}
        disabled={disabled}
        style = {[styles.container, style]}>
            <Text style = {[styles.text, TYPOGRAPHY.BUTTON_TEXT, textStyle]}>{title}</Text>
        </TouchableOpacity>       
    )
}

export default Button;