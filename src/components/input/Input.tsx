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