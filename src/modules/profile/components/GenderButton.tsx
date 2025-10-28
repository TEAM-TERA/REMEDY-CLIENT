import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/infoEditScreen';
import { GenderButtonProps } from '../types/InfoEdit';

function GenderButton({ label, isSelected, onPress }: GenderButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.genderButton,
                isSelected && styles.genderButtonSelected,
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.genderButtonText,
                    isSelected && styles.genderButtonTextSelected,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default GenderButton;
