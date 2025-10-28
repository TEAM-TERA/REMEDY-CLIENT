import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../../../types/navigation';
import { styles } from '../styles/settingScreen';
import Header from '../components/Header';
import SettingSection from '../components/SettingSection';
import SettingItem from '../components/SettingItem';

function SettingScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

    const handleInfoEditPress = () => {
        navigation.navigate('InfoEdit');
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
                    <SettingItem title="비밀번호 변경" onPress={() => {}} />
                </SettingSection>

                <SettingSection title="앱 사용 환경 설정">
                    <SettingItem title="알림 설정" onPress={() => {}} />
                    <SettingItem
                        title="위치정보 수집 및 이용 동의"
                        onPress={() => {}}
                    />
                </SettingSection>

                <SettingSection title="앱 정보">
                    <SettingItem
                        title="버전"
                        rightText="0.1.0"
                        showArrow={false}
                    />
                    <SettingItem
                        title="회원 탈퇴"
                        onPress={() => {}}
                        isDestructive={true}
                    />
                </SettingSection>
            </View>
        </SafeAreaView>
    );
}

export default SettingScreen;
