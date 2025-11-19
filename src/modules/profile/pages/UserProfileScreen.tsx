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
import { getSongInfo, getDroppingById } from '../../drop/api/dropApi';
import { scale, verticalScale } from '../../../utils/scalers';

function UserProfileScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const [activeTab, setActiveTab] = useState<'drop' | 'like'>('drop');
    const defaultProfileImg = require('../../../assets/images/profileImage.png');

    const { data: myDrops = [], isLoading: dropLoading } = useMyDrop();
    const { data: myLikes = [], isLoading: likeLoading } = useMyLikes();

    const { data: me, isLoading, isError, refetch, isFetching } = useMyProfile();

    const [songTitles, setSongTitles] = useState<Record<string, string>>({});
    const [songImages, setSongImages] = useState<Record<string, string>>({});
    const [likeDroppings, setLikeDroppings] = useState<Record<string, any>>({});
    const [likeDroppingsLoading, setLikeDroppingsLoading] = useState(false);

    useEffect(() => {
        const loadSongInfo = async () => {
            if (!myDrops || !Array.isArray(myDrops) || myDrops.length === 0) return;

            const drops = myDrops;
            const uniqueIds = Array.from(new Set(
                drops
                    .filter((d: any) => d && d.songId)
                    .map((d: any) => d.songId)
                    .filter(Boolean)
            ));
            try {
                const results = await Promise.all(uniqueIds.map(async (id: string) => {
                    try {
                        const info = await getSongInfo(id);
                        return [id, info?.title as string, info?.albumImagePath as string];
                    } catch {
                        return [id, id, ''];
                    }
                }));
                const titleMap: Record<string, string> = {};
                const imageMap: Record<string, string> = {};
                results.forEach(([id, title, image]) => {
                    titleMap[id as string] = (title as string) || String(id);
                    imageMap[id as string] = (image as string) || '';
                });
                setSongTitles(titleMap);
                setSongImages(imageMap);
            } catch {
                console.log('songInfo 로드 실패');
            }
        };
        loadSongInfo();
    }, [myDrops]);

    useEffect(() => {
        const loadLikeDroppings = async () => {
            if (!myLikes || !Array.isArray(myLikes) || myLikes.length === 0) {
                setLikeDroppings({});
                setLikeDroppingsLoading(false);
                return;
            }

            const likes = myLikes;

            setLikeDroppingsLoading(true);
            try {
                const results = await Promise.all(likes.map(async (droppingId: string) => {
                    try {
                        console.log(`좋아요 드랍핑 로드 중: ${droppingId}`);
                        const dropping = await getDroppingById(droppingId);
                        console.log(`드랍핑 정보:`, dropping);

                        if (dropping?.songId) {
                            const songInfo = await getSongInfo(dropping.songId);
                            console.log(`곡 정보:`, songInfo);
                            return [droppingId, { ...dropping, songInfo }];
                        }
                        return [droppingId, dropping];
                    } catch (error) {
                        console.error(`드랍핑 ${droppingId} 로드 실패:`, error);
                        return [droppingId, null];
                    }
                }));

                const map: Record<string, any> = {};
                results.forEach(([id, data]) => {
                    if (data !== null) {
                        map[id as string] = data;
                    }
                });
                console.log('좋아요 드랍핑 최종 데이터:', map);
                setLikeDroppings(map);
            } catch (error) {
                console.error('좋아요 드랍핑 로드 실패:', error);
            } finally {
                setLikeDroppingsLoading(false);
            }
        };
        loadLikeDroppings();
    }, [myLikes]);

    const currentData: DropItemData[] =
    activeTab === "drop"
        ? (myDrops || [])
            .filter((d: any) => d && d.droppingId) // null/undefined 아이템 필터링
            .map((d: any) => ({
                droppingId: d.droppingId,
                memo: songTitles[d.songId] || d.songId || "알 수 없는 곡",
                location: d.address || "위치 정보 없음",
                imageSource: songImages[d.songId] ? { uri: songImages[d.songId] } : undefined,
                hasHeart: false,
            }))
        : (myLikes || [])
            .filter((droppingId: string) => droppingId) // null/undefined 아이템 필터링
            .map((droppingId: string) => {
                const dropping = likeDroppings[droppingId];
                const songInfo = dropping?.songInfo;

                // 로딩 중이거나 데이터가 없는 경우 처리
                if (likeDroppingsLoading && !dropping) {
                    return {
                        droppingId: droppingId,
                        memo: "로딩 중...",
                        location: "위치 정보 로딩 중...",
                        imageSource: undefined,
                        hasHeart: true,
                    };
                }

                // 데이터가 없는 경우
                if (!dropping) {
                    return {
                        droppingId: droppingId,
                        memo: "데이터를 불러올 수 없습니다",
                        location: "위치 정보 없음",
                        imageSource: undefined,
                        hasHeart: true,
                    };
                }

                return {
                    droppingId: droppingId,
                    memo: songInfo?.title || dropping?.content || "좋아요한 곡",
                    location: dropping?.address || "위치 정보 없음",
                    imageSource: songInfo?.albumImagePath ? { uri: songInfo.albumImagePath } : undefined,
                    hasHeart: true,
                };
            });

    const handleEditPress = () => {
        navigation.navigate('NameEdit');
    };

    const handleSettingPress = () => {
        navigation.navigate('Setting');
    };

    const handleRefetchProfile = () => {
        refetch();
    }
    
    // 로딩 상태 처리
    if(isLoading || (dropLoading && !myDrops) || (likeLoading && !myLikes)){
        return (
            <SafeAreaView style={styles.safeAreaView}>
              <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator />
                <Text style={{ marginTop: verticalScale(8) }}>프로필 정보를 불러오고 있습니다!</Text>
              </View>
            </SafeAreaView>
        );
    }

    // 에러 상태 처리
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
                        source={me?.profileImageUrl && me.profileImageUrl.trim() !== '' ? {uri : me.profileImageUrl} : defaultProfileImg}
                        style={styles.profileImage}
                    />
                    <View style={styles.aliasContainer}>
                        <Text style={styles.aliasText}>모험가</Text>
                    </View>
                    <View style={styles.profileNameContainer}>
                        <Text style={styles.userNameText}>
                            {me?.username ?? '테스트'}
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
                        {activeTab === 'like' && likeDroppingsLoading && currentData.length === 0 ? (
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(40) }}>
                                <ActivityIndicator />
                                <Text style={{ marginTop: verticalScale(8), color: TEXT_COLORS.CAPTION }}>
                                    좋아요 목록을 불러오고 있습니다...
                                </Text>
                            </View>
                        ) : currentData.length === 0 ? (
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(40) }}>
                                <Text style={{ color: TEXT_COLORS.CAPTION }}>
                                    {activeTab === 'drop' ? '아직 드랍한 음악이 없습니다' : '좋아요한 음악이 없습니다'}
                                </Text>
                            </View>
                        ) : (
                            (currentData || [])
                                .filter((item) => item && item.droppingId) // null/undefined 아이템 필터링
                                .map((item) => (
                                    <DropItem
                                        key={item.droppingId}
                                        memo={item.memo || "제목 없음"}
                                        location={item.location || "위치 정보 없음"}
                                        imageSource={item.imageSource}
                                        hasHeart={item.hasHeart || false}
                                    />
                                ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}
export default UserProfileScreen;

