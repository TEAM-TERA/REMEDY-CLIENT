import { View, TextInput } from "react-native";
import { InputProps } from "../../types/Input";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../constants/typography";
import { TEXT_COLORS } from "../../constants/colors";

function Input({placeholder, value, onChangeText, width, keyboardType, error, secureTextEntry} : InputProps){
    return(
        <View style = {styles.container}>
            <TextInput
            value = {value}
            onChangeText = {onChangeText}
            style = {[
                TYPOGRAPHY.INPUT_TEXT, 
                styles.text,
                width !== undefined ? { width } : null
            ]}
            placeholder = {placeholder}
            placeholderTextColor={TEXT_COLORS.CAPTION}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}/>
        </View>
    )
}

export default Input;