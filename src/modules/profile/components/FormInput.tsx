import React from 'react';
import { View, Text, TextInput } from 'react-native';
import infoEditScreen from '../styles/infoEditScreen';
import { FormInputProps } from '../types/InfoEdit';
import { TEXT_COLORS } from '../../../constants/colors';

function FormInput({
    label,
    value,
    onChangeText,
    placeholder,
}: FormInputProps) {
    return (
        <View style={infoEditScreen.inputContainer}>
            <Text style={infoEditScreen.label}>{label}</Text>
            <TextInput
                style={infoEditScreen.textInput}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={TEXT_COLORS.CAPTION}
            />
        </View>
    );
}

export default FormInput;
