import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../types/navigation';
import Header from '../../profile/components/Header';
import { styles } from '../styles/ChallengeScreen';
import {
    dailyChallengeData,
    alwaysChallengeData,
} from '../datas/challengeData';
import ChallengeCard from '../components/ChallengeCard';
import { PRIMARY_COLORS, TERTIARY_COLORS } from '../../../constants/colors';

function ChallengeScreen() {
    const navigation =
        useNavigation<StackNavigationProp<RootStackParamList, 'Challenge'>>();
    const [activeTab, setActiveTab] = useState<'daily' | 'always'>('daily');
    const [openCardIds, setOpenCardIds] = useState<number[]>([]);
    const currentData =
        activeTab === 'daily' ? dailyChallengeData : alwaysChallengeData;

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
                                    activeTab === 'daily' &&
                                        styles.navTextActive,
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
                                    activeTab === 'always' &&
                                        styles.navTextActive,
                                ]}
                            >
                                상시
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {currentData.map(challenge => (
                        <ChallengeCard
                            key={challenge.id}
                            title={challenge.title}
                            description={challenge.description}
                            coin={challenge.coin}
                            progress={`${challenge.progress}%`}
                            sideBarColor={
                                activeTab === 'daily'
                                    ? PRIMARY_COLORS.DEFAULT
                                    : TERTIARY_COLORS.DEFAULT
                            }
                            isOpen={openCardIds.includes(challenge.id)}
                            onToggle={() =>
                                setOpenCardIds(prev =>
                                    prev.includes(challenge.id)
                                        ? prev.filter(id => id !== challenge.id)
                                        : [...prev, challenge.id],
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
