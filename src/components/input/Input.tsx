import { View, TextInput, Platform, Text } from "react-native";
import { useState } from "react";
import { InputProps } from "../../types/Input";
import { styles } from "./styles";
import { TEXT_COLORS } from "../../constants/colors";
import Icon from "../icon/Icon";
import { scale } from "../../utils/scalers";

function Input({placeholder, value, onChangeText, width, containerWidth, keyboardType, error, secureTextEntry, helperText, onFocus, onBlur} : InputProps){
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const containerStyle = [
        styles.container,
        containerWidth !== undefined && styles.containerCentered,
        containerWidth !== undefined && { width: containerWidth },
        error && styles.containerError,
    ];

    const textInputStyle = [
        styles.text,
        width !== undefined ? { width } : styles.textFlex,
        Platform.OS === 'android' && styles.textAndroid,
    ];

    return(
        <View style={styles.wrapper}>
            <View style={containerStyle}>
                <TextInput
                value = {value}
                onChangeText = {onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                style={textInputStyle}
                placeholder = {placeholder}
                placeholderTextColor={TEXT_COLORS.CAPTION_1}
                keyboardType={keyboardType}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={secureTextEntry && !isPasswordVisible}/>
                {secureTextEntry && (
                    <Icon 
                        name={isPasswordVisible ? "eyeOn" : "eyeOff"}
                        onPress={togglePasswordVisibility}
                        width={scale(20)}
                        height={scale(20)}
                        color={TEXT_COLORS.CAPTION_1}
                        accessibilityLabel={isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
                        accessibilityHint="비밀번호 표시 여부를 전환합니다"
                    />
                )}
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