import { View, TextInput } from "react-native";
import { InputProps } from "../../types/Input";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../constants/typography";

function Input({placeholder, value, onChangeText} : InputProps){
    return(
        <View style = {styles.container}>
            <TextInput
            value = {value}
            onChangeText = {onChangeText}
            style = {[TYPOGRAPHY.INPUT_TEXT, styles.text]}
            placeholder = {placeholder}/>
        </View>
    )
}

export default Input;