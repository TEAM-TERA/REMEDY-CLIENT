import React, { useContext, useState } from 'react';
import { View, Alert, Text, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../../../types/navigation';
import { styles } from '../styles/settingScreen';
import Header from '../components/Header';
import SettingSection from '../components/SettingSection';
import SettingItem from '../components/SettingItem';
import { AuthContext } from '../../auth/auth-context';
import { navigate } from '../../../navigation';
import Button from '../../../components/button/Button';
import axiosInstance from '../../auth/api/axiosInstance';
import { TERMS } from '../../../constants/terms';

function SettingScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const { logout } = useContext(AuthContext);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const handleInfoEditPress = () => {
        navigation.navigate('InfoEdit');
    };

    const handleLocationInfoPress = () => {
        setShowLocationModal(true);
    };

    const handleWithdrawalPress = () => {
        Alert.alert(
            '회원 탈퇴',
            '정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다.',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '탈퇴',
                    style: 'destructive',
                    onPress: async () => {
                        setIsWithdrawing(true);
                        try {
                            await axiosInstance.post('/users/withdrawal');
                            Alert.alert('완료', '회원 탈퇴가 완료되었습니다.', [
                                {
                                    text: '확인',
                                    onPress: async () => {
                                        await logout();
                                        navigate('Auth');
                                    }
                                }
                            ]);
                        } catch (error) {
                            console.error('회원 탈퇴 실패:', error);
                            Alert.alert('오류', '회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
                        } finally {
                            setIsWithdrawing(false);
                        }
                    }
                }
            ]
        );
    };

    const handleLogoutPress = () => {
        Alert.alert(
            '로그아웃',
            '로그아웃 하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '확인',
                    onPress: async () => {
                        try {
                            await logout();
                            navigate('Auth');
                        } catch (error) {
                            console.error('로그아웃 실패:', error);
                            Alert.alert('오류', '로그아웃에 실패했습니다.');
                        }
                    }
                }
            ]
        );
    };
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>
                <Header title="설정" />

                <SettingSection title="내 계정">
                    <SettingItem
                        title="내 정보"
                        onPress={handleInfoEditPress}
                    />
                    <SettingItem title="로그아웃" onPress={handleLogoutPress} />
                </SettingSection>

                <SettingSection title="앱 사용 환경 설정">
                    <SettingItem
                        title="위치정보 수집 및 이용 동의"
                        onPress={handleLocationInfoPress}
                    />
                </SettingSection>

                <SettingSection title="앱 정보">
                    <SettingItem
                        title="버전"
                        rightText="0.1.1"
                        showArrow={false}
                    />
                    <SettingItem
                        title="회원 탈퇴"
                        onPress={handleWithdrawalPress}
                        isDestructive={true}
                        disabled={isWithdrawing}
                    />
                </SettingSection>
            </View>

            <Modal
                visible={showLocationModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowLocationModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {TERMS.find(term => term.id === 'location')?.title}
                        </Text>
                        <ScrollView style={styles.modalScrollView}>
                            <Text style={styles.modalText}>
                                {TERMS.find(term => term.id === 'location')?.contentLines.join('\n')}
                            </Text>
                        </ScrollView>
                        <View style={styles.modalButtonContainer}>
                            <Button
                                title="확인"
                                onPress={() => setShowLocationModal(false)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default SettingScreen;
