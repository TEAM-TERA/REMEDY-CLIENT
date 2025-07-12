import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import infoEditScreen from '../styles/infoEditScreen';
import Header from '../components/Header';
import FormInput from '../components/FormInput';
import DateInput from '../components/DateInput';
import GenderButton from '../components/GenderButton';
import { InfoEditFormData, GenderType } from '../types/InfoEdit';

function InfoEditScreen() {
    const [formData, setFormData] = useState<InfoEditFormData>({
        name: 'User_1',
        birthDate: '2008.09.04',
        gender: 'male',
    });

    const handleNameChange = (text: string) => {
        setFormData(prev => ({ ...prev, name: text }));
    };

    const handleGenderSelect = (gender: GenderType) => {
        setFormData(prev => ({ ...prev, gender }));
    };

    const handleBirthDateChange = (text: string) => {
        setFormData(prev => ({ ...prev, birthDate: text }));
    };

    const handleDatePress = () => {
        // TODO: DatePicker 모달 열기
    };

    const handleSubmit = () => {
        // TODO: 정보 수정 API 호출
    };

    return (
        <SafeAreaView style={infoEditScreen.safeAreaView}>
            <View style={infoEditScreen.container}>
                <Header title="정보 수정" onBackPress={() => {}} />

                <View style={infoEditScreen.content}>
                    <FormInput
                        label="이름"
                        value={formData.name}
                        onChangeText={handleNameChange}
                        placeholder="이름을 입력하세요"
                    />

                    <DateInput
                        value={formData.birthDate}
                        onChangeText={handleBirthDateChange}
                        onDatePickerPress={handleDatePress}
                        placeholder="YYYY.MM.DD"
                    />

                    <View style={infoEditScreen.genderContainer}>
                        <Text style={infoEditScreen.label}>성별</Text>
                        <View style={infoEditScreen.genderButtons}>
                            <GenderButton
                                label="남성"
                                isSelected={formData.gender === 'male'}
                                onPress={() => handleGenderSelect('male')}
                            />
                            <GenderButton
                                label="여성"
                                isSelected={formData.gender === 'female'}
                                onPress={() => handleGenderSelect('female')}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={infoEditScreen.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={infoEditScreen.submitButtonText}>
                            수정하기
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default InfoEditScreen;
