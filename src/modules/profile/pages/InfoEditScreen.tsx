import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../../../types/navigation';
import { styles } from '../styles/infoEditScreen';
import Header from '../components/Header';
import FormInput from '../components/FormInput';
import DateInput from '../components/DateInput';
import GenderButton from '../components/GenderButton';
import { InfoEditFormData, GenderType } from '../types/InfoEdit';
import { useMyProfile } from '../hooks/useMyProfile';

function InfoEditScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const [formData, setFormData] = useState<InfoEditFormData>({
        name: '',
        birthDate: '',
        gender: 'male',
    });
    const { data: me } = useMyProfile();

    useEffect(() => {
        if (!me) return;
        const name = me.username || '';
        const birthDate = (me.birthDate || '').replaceAll('-', '.');
        const gender: GenderType = me.gender === undefined || me.gender === null
            ? 'male'
            : (me.gender ? 'male' : 'female');
        setFormData({ name, birthDate, gender });
    }, [me]);

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
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>
                <Header title="정보 수정" />

                <View style={styles.content}>
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
                        label="생년월일"
                    />

                    <View style={styles.genderContainer}>
                        <Text style={styles.label}>성별</Text>
                        <View style={styles.genderButtons}>
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
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>
                            수정하기
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default InfoEditScreen;
