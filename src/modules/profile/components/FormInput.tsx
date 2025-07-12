import React from 'react';
import { View, Text, TextInput } from 'react-native';

import infoEditScreen from '../styles/infoEditScreen';
import { FormInputProps } from '../types/InfoEdit';

function FormInput({ label, value, onChangeText, placeholder }: FormInputProps) {
    return (
        <View style={infoEditScreen.inputContainer}>
            <Text style={infoEditScreen.label}>
                {label}
            </Text>
            <TextInput
                style={infoEditScreen.textInput}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#434356"
            />
        </View>
    );
}

export default FormInput;
