import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TEXT_COLORS } from '../../../constants/colors';
import infoEditScreen from '../styles/infoEditScreen';
import { DateInputProps } from '../types/InfoEdit';
import Icon from '../../../components/icon/Icon';

function DateInput({
    value,
    onChangeText,
    onDatePickerPress,
    placeholder = 'YYYY.MM.DD',
    label = '생년월일',
}: DateInputProps) {
    return (
        <View style={infoEditScreen.inputContainer}>
            <Text style={infoEditScreen.label}>{label}</Text>
            <View style={infoEditScreen.dateInputContainer}>
                <TextInput
                    style={infoEditScreen.dateTextInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={TEXT_COLORS.CAPTION}
                    keyboardType="numeric"
                />
                <TouchableOpacity onPress={onDatePickerPress}>
                    <Icon name="calendar" width={24} height={24} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DateInput;
