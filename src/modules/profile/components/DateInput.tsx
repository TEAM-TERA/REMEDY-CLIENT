import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { TEXT_COLORS } from '../../../constants/colors';
import infoEditScreen from '../styles/infoEditScreen';
import { DateInputProps } from '../types/InfoEdit';

function DateInput({
    value,
    onChangeText,
    onDatePickerPress,
    placeholder = 'YYYY.MM.DD',
}: DateInputProps) {
    return (
        <View style={infoEditScreen.inputContainer}>
            <Text style={infoEditScreen.label}>생년월일</Text>
            <View style={infoEditScreen.dateInputContainer}>
                <TextInput
                    style={infoEditScreen.dateTextInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#434356"
                    keyboardType="numeric"
                />
                <TouchableOpacity onPress={onDatePickerPress}>
                    <MaterialIcons
                        name="calendar-today"
                        size={20}
                        color={TEXT_COLORS.CAPTION}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DateInput;
