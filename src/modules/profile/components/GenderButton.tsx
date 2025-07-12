import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import infoEditScreen from '../styles/infoEditScreen';
import { GenderButtonProps } from '../types/InfoEdit';

function GenderButton({ label, isSelected, onPress }: GenderButtonProps) {
    return (
        <TouchableOpacity 
            style={[
                infoEditScreen.genderButton,
                isSelected && infoEditScreen.genderButtonSelected
            ]}
            onPress={onPress}
        >
            <Text 
                style={[
                    infoEditScreen.genderButtonText,
                    isSelected && infoEditScreen.genderButtonTextSelected
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default GenderButton;
