import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { TEXT_COLORS } from '../../../constants/colors';
import { styles } from '../styles/infoEditScreen';
import { DateInputProps } from '../types/InfoEdit';
import Icon from '../../../components/icon/Icon';
import { scale } from '../../../utils/scalers';

function DateInput({
    value,
    onChangeText,
    onDatePickerPress,
    placeholder = 'YYYY.MM.DD',
    label = '생년월일',
}: DateInputProps) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.dateInputContainer}>
                <TextInput
                    style={styles.dateTextInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={TEXT_COLORS.CAPTION}
                    keyboardType="numeric"
                />
                <TouchableOpacity onPress={onDatePickerPress}>
                    <Icon name="calendar" width={scale(24)} height={scale(24)} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DateInput;

