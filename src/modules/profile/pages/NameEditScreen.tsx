import React, { useState } from 'react';
import {
    StatusBar,
    View,
    Text,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { styles } from '../styles/NameEditScreen';
import Header from '../components/Header';
import Button from '../../../components/button/Button';
import { updateMyProfile } from '../api/profileApi';
import { useMyProfile } from '../hooks/useMyProfile';

function NameEditScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { data: userProfile } = useMyProfile();
    const [userName, setUserName] = useState(userProfile?.username || '');

    const updateProfileMutation = useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
            Alert.alert('성공', '이름이 성공적으로 수정되었습니다.', [
                {
                    text: '확인',
                    onPress: () => navigation.goBack(),
                },
            ]);
        },
        onError: (error: any) => {
            console.error('프로필 수정 에러:', error);
            console.error('에러 응답 데이터:', error.response?.data);
            console.error('에러 상태 코드:', error.response?.status);
            Alert.alert('오류', '이름 수정에 실패했습니다. 다시 시도해주세요.');
        },
    });

    const handleUpdateProfile = () => {
        if (!userName.trim()) {
            Alert.alert('오류', '이름을 입력해주세요.');
            return;
        }

        const payload = {
            username: userName.trim(),
            ...(userProfile?.gender !== undefined && userProfile?.gender !== null && { gender: userProfile.gender }),
            ...(userProfile?.birthDate && { birthDate: userProfile.birthDate }),
        };
        
        console.log('프로필 수정 요청 데이터:', payload);
        console.log('현재 사용자 프로필:', userProfile);
        updateProfileMutation.mutate(payload);
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <StatusBar translucent={false} />

            <View style={styles.container}>
                <Header title="이름 수정" />

                <View style={styles.nameEditContainer}>
                    <Text style={styles.title}>이름</Text>
                    <TextInput
                        style={styles.nameEditInput}
                        value={userName}
                        onChangeText={setUserName}
                        placeholder="이름을 입력하세요"
                        placeholderTextColor="#666"
                    />
                </View>

                <Button
                    title="수정하기"
                    onPress={handleUpdateProfile}
                    disabled={updateProfileMutation.isPending}
                    style={styles.button}
                />
            </View>
        </SafeAreaView>
    );
}

export default NameEditScreen;
