import { View, TextInput, Platform } from "react-native";
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
                styles.text,
                Platform.OS === 'android' ? { paddingVertical: 0, textAlignVertical: 'center' as const } : null
            ]}
            placeholder = {placeholder}
            placeholderTextColor={Platform.OS === 'android' ? '#9CA3AF' : TEXT_COLORS.CAPTION}
            keyboardType={keyboardType}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={secureTextEntry}/>
        </View>
    )
}

export default Input;