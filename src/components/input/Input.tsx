import { View, TextInput, Platform, Text } from "react-native";
import { InputProps } from "../../types/Input";
import { styles } from "./styles";
import { TEXT_COLORS } from "../../constants/colors";

function Input({placeholder, value, onChangeText, width, containerWidth, keyboardType, error, secureTextEntry, helperText, onFocus, onBlur} : InputProps){
    return(
        <View style={styles.wrapper}>
            <View style = {[
                styles.container, 
                containerWidth !== undefined ? { width: containerWidth, alignSelf: 'center', borderRadius: 8 } : null,
                error ? styles.containerError : null,
            ]}>
                <TextInput
                value = {value}
                onChangeText = {onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                style = {[
                    styles.text,
                    width !== undefined ? { width } : { flex: 1 },
                    Platform.OS === 'android' ? { paddingVertical: 0, textAlignVertical: 'center' as const } : null
                ]}
                placeholder = {placeholder}
                placeholderTextColor={Platform.OS === 'android' ? '#9CA3AF' : TEXT_COLORS.CAPTION}
                keyboardType={keyboardType}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={secureTextEntry}/>
            </View>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : helperText ? (
                <Text style={styles.helperText}>{helperText}</Text>
            ) : null}
        </View>
    )
}

export default Input;