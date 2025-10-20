import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types/navigation';
import Header from '../../profile/components/Header';
import { styles } from '../styles/ChallengeScreen';
import { useActiveAchievements } from '../hooks/useAchievements';
import { useMyAchievements } from '../hooks/useMyAchievements';
import { useMyDrop } from '../../profile/hooks/useMyDrop';
import ChallengeCard from '../components/ChallengeCard';
import { PRIMARY_COLORS, TERTIARY_COLORS } from '../../../constants/colors';

function ChallengeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Challenge'>>();
    const [activeTab, setActiveTab] = useState<'daily' | 'always'>('daily');
    const [openCardIds, setOpenCardIds] = useState<number[]>([]);

    const { data: achievements, isLoading, error } = useActiveAchievements();
    const { data: myAchievements } = useMyAchievements();
    const { data: myDrops } = useMyDrop();
    console.log(achievements);
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

    const achievementList = Array.isArray(achievements) ? achievements : [];
    const currentData = achievementList.filter(achievement => {
        const period = achievement.period;
        return activeTab === 'daily' ? period === 'DAILY' : period === 'PERMANENT';
    });

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
                        currentData.map(achievement => {
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const current = (myDrops || []).filter(d => {
                                const anyDrop: any = d as any;
                                const createdAt = anyDrop.createdAt ? new Date(anyDrop.createdAt) : null;
                                if (!createdAt) return false;
                                const createdDay = new Date(createdAt);
                                createdDay.setHours(0,0,0,0);
                                return createdDay.getTime() === today.getTime();
                            }).length;
                            const target = achievement.targetValue;
                            console.log(current, target,myDrops);
                            const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

                            return (
                                <ChallengeCard
                                    key={achievement.achievementId}
                                    title={achievement.title}
                                    description={`${current} / ${target}`}
                                    coin={achievement.rewardAmount}
                                    progress={`${percent}%`}
                                    totalCount={target}
                                    sideBarColor={
                                        activeTab === 'daily'
                                            ? PRIMARY_COLORS.DEFAULT
                                            : TERTIARY_COLORS.DEFAULT
                                    }
                                    isOpen={openCardIds.includes(achievement.achievementId)}
                                    onToggle={() =>
                                        setOpenCardIds(prev =>
                                            prev.includes(achievement.achievementId)
                                                ? prev.filter(id => id !== achievement.achievementId)
                                                : [...prev, achievement.achievementId],
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
