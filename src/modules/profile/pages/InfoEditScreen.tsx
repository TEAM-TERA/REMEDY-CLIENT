import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
        setFormData({ name, birthDate, gender: 'male' });
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
    };

    const handleSubmit = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <Header title="정보 수정" />

            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
                extraHeight={Platform.OS === 'ios' ? 150 : 200}
            >
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
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

export default InfoEditScreen;
