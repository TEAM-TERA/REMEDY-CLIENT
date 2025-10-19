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
import { PRIMARY_COLORS, TERTIARY_COLORS } from '../../../constants/colors';

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
                <View style={[styles.container, styles.centeredContainer]}>
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
                <View style={[styles.container, styles.centeredContainer]}>
                    <Text style={styles.errorText}>도전과제를 불러오는데 실패했습니다.</Text>
                </View>
            </SafeAreaView>
        );
    }

    // 탭에 따라 데이터 필터링
    const currentData = achievements?.filter(userAchievement => {
        const period = userAchievement.achievement.period;

        return activeTab === 'daily'
            ? period === 'DAILY'
            : period === 'PERMANENT';
    }) || [];

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

                    {currentData.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <Text style={styles.emptyStateText}>
                                {activeTab === 'daily'
                                    ? '진행 중인 일일 도전과제가 없습니다.'
                                    : '진행 중인 상시 도전과제가 없습니다.'}
                            </Text>
                        </View>
                    ) : (
                        currentData.map(userAchievement => {
                            const { currentValue, achievement: { targetValue } } = userAchievement;
                            const percent = targetValue > 0 ? Math.round((currentValue / targetValue) * 100) : 0;

                            return (
                                <ChallengeCard
                                    key={userAchievement.userAchievementId}
                                    title={userAchievement.achievement.title}
                                    description={`${userAchievement.currentValue} / ${userAchievement.achievement.targetValue}`}
                                    coin={userAchievement.achievement.rewardAmount}
                                    progress={`${percent}%`}
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
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ChallengeScreen;
