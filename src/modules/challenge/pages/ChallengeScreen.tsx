import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';
import Header from '../../profile/components/Header';
import { styles } from '../styles/ChallengeScreen';
import { useMyAchievements } from '../hooks/useMyAchievements';
import ChallengeCard from '../components/ChallengeCard';
import { PRIMARY_COLORS, TERTIARY_COLORS, TEXT_COLORS } from '../../../constants/colors';

function ChallengeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Challenge'>>();
    const [activeTab, setActiveTab] = useState<'daily' | 'always'>('daily');
    const [openCardIds, setOpenCardIds] = useState<number[]>([]);

    // API에서 데이터 가져오기
    const { data: achievements, isLoading, error } = useMyAchievements();

    // 로딩 상태
    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <Header
                    title="도전 과제"
                    onBackPress={() => navigation.goBack()}
                />
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={PRIMARY_COLORS.DEFAULT} />
                </View>
            </SafeAreaView>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <Header
                    title="도전 과제"
                    onBackPress={() => navigation.goBack()}
                />
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: TEXT_COLORS.CAPTION_LIGHTER }}>도전과제를 불러오는데 실패했습니다.</Text>
                </View>
            </SafeAreaView>
        );
    }

    // 탭에 따라 데이터 필터링
    const currentData = achievements?.filter(userAchievement => {
        // achievement 객체가 있는지 확인
        const period = (userAchievement as any).achievement?.period || (userAchievement as any).period;
        console.log('Filtering achievement:', userAchievement, 'period:', period);

        return activeTab === 'daily'
            ? period === 'DAILY'
            : period === 'PERMANENT';
    }) || [];

    console.log('Filtered currentData:', currentData);

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView contentContainerStyle={styles.container}>
                <Header
                    title="도전 과제"
                    onBackPress={() => navigation.goBack()}
                />
                <View style={styles.section}>
                    <View style={styles.nav}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('daily')}
                            activeOpacity={1}
                        >
                            <Text
                                style={[
                                    styles.navText,
                                    activeTab === 'daily' && styles.navTextActive,
                                ]}
                            >
                                일일
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('always')}
                            activeOpacity={1}
                        >
                            <Text
                                style={[
                                    styles.navText,
                                    activeTab === 'always' && styles.navTextActive,
                                ]}
                            >
                                상시
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {currentData.map(userAchievement => (
                        <ChallengeCard
                            key={userAchievement.userAchievementId}
                            title={userAchievement.achievement.title}
                            description={`${userAchievement.currentValue} / ${userAchievement.achievement.targetValue}`}
                            coin={userAchievement.achievement.rewardAmount}
                            progress={`${Math.round((userAchievement.currentValue / userAchievement.achievement.targetValue) * 100)}%`}
                            sideBarColor={
                                activeTab === 'daily'
                                    ? PRIMARY_COLORS.DEFAULT
                                    : TERTIARY_COLORS.DEFAULT
                            }
                            isOpen={openCardIds.includes(userAchievement.userAchievementId)}
                            onToggle={() =>
                                setOpenCardIds(prev =>
                                    prev.includes(userAchievement.userAchievementId)
                                        ? prev.filter(id => id !== userAchievement.userAchievementId)
                                        : [...prev, userAchievement.userAchievementId],
                                )
                            }
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ChallengeScreen;
