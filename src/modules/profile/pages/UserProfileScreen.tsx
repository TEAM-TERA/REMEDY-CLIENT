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

    const { data: myDrops = [], isLoading: dropLoading } = useMyDrop();
    const { data: myLikes = [], isLoading: likeLoading, error: likeError } = useMyLikes();

    const { data: me, isLoading, isError, refetch, isFetching } = useMyProfile();

    const [songTitles, setSongTitles] = useState<Record<string, string>>({});
    const [songImages, setSongImages] = useState<Record<string, string>>({});

    // 데이터 디버깅
    useEffect(() => {
        console.log('=== 드랍 데이터 상태 ===');
        console.log('myDrops:', myDrops);
        console.log('dropLoading:', dropLoading);
        console.log('myDrops 타입:', typeof myDrops);
        console.log('myDrops 배열인가?:', Array.isArray(myDrops));
        console.log('myDrops 길이:', myDrops ? myDrops.length : 'undefined');
    }, [myDrops, dropLoading]);

    useEffect(() => {
        console.log('=== 좋아요 데이터 상태 ===');
        console.log('myLikes:', myLikes);
        console.log('likeLoading:', likeLoading);
        console.log('likeError:', likeError);
        console.log('myLikes 타입:', typeof myLikes);
        console.log('myLikes 배열인가?:', Array.isArray(myLikes));
        console.log('myLikes 길이:', myLikes ? myLikes.length : 'undefined');
        if (myLikes && myLikes.length > 0) {
            console.log('첫 번째 좋아요 아이템:', myLikes[0]);
        }
        if (likeError) {
            console.error('좋아요 목록 API 에러:', likeError);
        }
    }, [myLikes, likeLoading, likeError]);

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


    const dropsArray = Array.isArray(myDrops) ? myDrops : [];
    const likesArray = Array.isArray(myLikes) ? myLikes : [];

    // 필터링 전 데이터 확인
    console.log('=== currentData 계산 ===');
    console.log('activeTab:', activeTab);
    console.log('dropsArray 길이:', dropsArray.length);
    console.log('dropsArray 내용:', dropsArray);

    const filteredDrops = dropsArray.filter((d: any) => d && d.droppingId);
    console.log('필터링된 dropsArray 길이:', filteredDrops.length);
    console.log('필터링된 dropsArray 내용:', filteredDrops);

    const filteredLikes = likesArray.filter((like: any) => like && like.droppingId);
    console.log('필터링된 likesArray 길이:', filteredLikes.length);
    console.log('필터링된 likesArray 내용:', filteredLikes);

    const currentData: DropItemData[] =
    activeTab === "drop"
        ? filteredDrops
            .map((d: any) => ({
                droppingId: d.droppingId,
                memo: songTitles[d.songId] || d.songId || "알 수 없는 곡",
                location: d.address || "위치 정보 없음",
                imageSource: songImages[d.songId] ? { uri: songImages[d.songId] } : undefined,
                hasHeart: false,
            }))
        : filteredLikes
            .map((like: any) => {
                console.log('좋아요 아이템 매핑:', {
                    droppingId: like.droppingId,
                    title: like.title,
                    imageUrl: like.imageUrl,
                    address: like.address
                });
                return {
                    droppingId: like.droppingId,
                    memo: like.title || "알 수 없는 곡",
                    location: like.address || "위치 정보 없음",
                    imageSource: like.imageUrl ? { uri: like.imageUrl } : undefined,
                    hasHeart: true,
                };
            });

    console.log('최종 currentData 길이:', currentData.length);
    console.log('최종 currentData 내용:', currentData);

    const handleEditPress = () => {
        navigation.navigate('NameEdit');
    };

    const handleSettingPress = () => {
        navigation.navigate('Setting');
    };

    const handleRefetchProfile = () => {
        refetch();
    }
    
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
                        {(activeTab === "like" && likeError) ? (
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(40) }}>
                                <Text style={{ color: TEXT_COLORS.CAPTION, marginBottom: verticalScale(16) }}>
                                    좋아요 목록을 불러올 수 없습니다
                                </Text>
                                <Text style={{ color: TEXT_COLORS.CAPTION, marginBottom: verticalScale(16), fontSize: 12 }}>
                                    {likeError?.message || '네트워크 오류가 발생했습니다'}
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
                                .filter((item) => item && item.droppingId)
                                .map((item, index) => (
                                    <DropItem
                                        key={`${item.droppingId}-${index}`}
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

