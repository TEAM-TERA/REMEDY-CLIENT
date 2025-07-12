import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import settingScreen from '../styles/settingScreen';
import Header from '../components/Header';
import SettingSection from '../components/SettingSection';
import SettingItem from '../components/SettingItem';

function SettingScreen() {
    return (
        <SafeAreaView style={settingScreen.safeAreaView}>
            <View style={settingScreen.container}>
                <Header title="설정" onBackPress={() => {}} />

                <SettingSection title="내 계정">
                    <SettingItem title="내 정보" onPress={() => {}} />
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
                        rightText="10.0"
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
