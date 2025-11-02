import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../../../types/navigation';
import type { DropItemData } from '../types/DropItemData';
import { TEXT_COLORS } from '../../../constants/colors';
import { styles } from '../styles/userProfileScreen';
import Header from '../components/Header';
import DropItem from '../components/DropItem';
import Icon from '../../../components/icon/Icon';
import Button from '../../../components/button/Button';
import { useMyProfile } from '../hooks/useMyProfile';
import { useMyDrop } from '../hooks/useMyDrop';
import { useMyLikes } from '../hooks/useMyLike';
import { getSongInfo } from '../../drop/api/dropApi';
import { scale, verticalScale } from '../../../utils/scalers';

function UserProfileScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const [activeTab, setActiveTab] = useState<'drop' | 'like'>('drop');
    const defaultProfileImg = require('../../../assets/images/profileImage.png');

    const { data: myDrops, isLoading: dropLoading } = useMyDrop();
    const { data: myLikes, isLoading: likeLoading } = useMyLikes();

    const { data: me, isLoading, isError, refetch, isFetching } = useMyProfile();

    const [songTitles, setSongTitles] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadTitles = async () => {
            const drops = Array.isArray(myDrops) ? myDrops : [];
            if (!drops || drops.length === 0) return;
            const uniqueIds = Array.from(new Set(drops.map((d: any) => d.songId).filter(Boolean)));
            try {
                const results = await Promise.all(uniqueIds.map(async (id: string) => {
                    try {
                        const info = await getSongInfo(id);
                        return [id, info?.title as string];
                    } catch {
                        return [id, id];
                    }
                }));
                const map: Record<string, string> = {};
                results.forEach(([id, title]) => { map[id as string] = (title as string) || String(id); });
                setSongTitles(map);
            } catch {
                console.log('songTitles 로드 실패');
            }
        };
        loadTitles();
    }, [myDrops]);

    const currentData: DropItemData[] =
    activeTab === "drop"
        ? (Array.isArray(myDrops) ? myDrops : []).map((d: any) => ({
            droppingId: d.droppingId,
            memo: songTitles[d.songId] || d.songId,
            location: d.address,
            imageSource: undefined,
            hasHeart: false, 
    }))
        : (Array.isArray(myLikes) ? myLikes : []).map((id: any) => ({
            droppingId: id,
            memo: "좋아요한 곡",
            location: "",
            imageSource: undefined,
            hasHeart: true,
    }));

    const handleEditPress = () => {
        navigation.navigate('NameEdit');
    };

    const handleSettingPress = () => {
        navigation.navigate('Setting');
    };

    const handleRefetchProfile = () => {
        refetch();
    }
    
    if(isLoading){
        return (
            <SafeAreaView style={styles.safeAreaView}>
              <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator />
                <Text style={{ marginTop: verticalScale(8) }}>프로필 정보를 불러오고 있습니다!</Text>
              </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
          <SafeAreaView style={styles.safeAreaView}>
            <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
              <Text>프로필 정보를 가져오는데 실패했어요!.</Text>
              <Button title = "다시 시도하기" onPress = {handleRefetchProfile}></Button>
            </View>
          </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.container}>
                <Header
                    title="프로필"
                    rightComponent={
                        <TouchableOpacity onPress={handleSettingPress}>
                            <Icon
                                name="setting"
                                width={scale(20)}
                                height={scale(20)}
                                color={TEXT_COLORS.DEFAULT}
                            />
                        </TouchableOpacity>
                    }
                />
                <View style={styles.profileContainer}>
                    <Image
                        source={(me as any)?.profileImageUrl && (me as any).profileImageUrl.trim() !== '' ? {uri : (me as any).profileImageUrl} : defaultProfileImg}
                        style={styles.profileImage}
                    />
                    <View style={styles.aliasContainer}>
                        <Text style={styles.aliasText}>모험가</Text>
                    </View>
                    <View style={styles.profileNameContainer}>
                        <Text style={styles.userNameText}>
                            {(me as any)?.username ?? '테스트'}
                        </Text>
                        <TouchableOpacity onPress={handleEditPress}>
                            <Icon
                                name="edit"
                                width={scale(20)}
                                height={scale(20)}
                                color={TEXT_COLORS.CAPTION}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.tabContainer}>
                    <View style={styles.nav}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('drop')}
                            activeOpacity={1}
                        >
                            <Text
                                style={[
                                    styles.navText,
                                    activeTab === 'drop' &&
                                        styles.navTextActive,
                                ]}
                            >
                                드랍
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('like')}
                            activeOpacity={1}
                        >
                            <Text
                                style={[
                                    styles.navText,
                                    activeTab === 'like' &&
                                        styles.navTextActive,
                                ]}
                            >
                                좋아요
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                    >
                        {currentData.map((item) => (
                            <DropItem
                                key={item.droppingId}
                                memo={item.memo}
                                location={item.location}
                                imageSource={item.imageSource}
                                hasHeart={item.hasHeart}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}
export default UserProfileScreen;

