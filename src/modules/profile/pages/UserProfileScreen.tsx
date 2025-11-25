import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList } from '../../../types/navigation';
import type { DropItemData } from '../types/DropItemData';
import Button from '../../../components/button/Button';
import ProfileHeader from '../../../components/header/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';
import TabNavigation from '../components/TabNavigation';
import MusicCard from '../components/MusicCard';
import PlaylistGrid from '../components/PlaylistGrid';
import { useMyProfile } from '../hooks/useMyProfile';
import { useMyDrop } from '../hooks/useMyDrop';
import { useMyLikes } from '../hooks/useMyLike';
import { useMyPlaylists } from '../hooks/useMyPlaylists';
import { getSongInfo } from '../../drop/api/dropApi';
import { scale, verticalScale } from '../../../utils/scalers';
import { BACKGROUND_COLORS, TEXT_COLORS } from '../../../constants/colors';

function UserProfileScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const [activeTab, setActiveTab] = useState<'drop' | 'like' | 'playlist'>('drop');

    const { data: myDrops = [], isLoading: dropLoading } = useMyDrop();
    const { data: myLikes = [], isLoading: likeLoading, error: likeError } = useMyLikes();
    const { data: me, isLoading, isError, refetch } = useMyProfile();
    const { data: myPlaylistsData, isLoading: playlistLoading } = useMyPlaylists();

    const [songTitles, setSongTitles] = useState<Record<string, string>>({});
    const [songImages, setSongImages] = useState<Record<string, string>>({});

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

    const filteredDrops = dropsArray.filter((d: any) => d && d.droppingId);
    const filteredLikes = likesArray.filter((like: any) => like && like.droppingId);

    const playlists = myPlaylistsData?.playlists || [];

    const currentData: DropItemData[] =
        activeTab === "drop"
            ? filteredDrops.map((d: any) => ({
                droppingId: d.droppingId,
                memo: songTitles[d.songId] || d.songId || "알 수 없는 곡",
                location: d.address || "위치 정보 없음",
                imageSource: songImages[d.songId] ? { uri: songImages[d.songId] } : undefined,
                hasHeart: false,
            }))
            : activeTab === "like"
                ? filteredLikes.map((like: any) => ({
                    droppingId: like.droppingId,
                    memo: like.title || "알 수 없는 곡",
                    location: like.address || "위치 정보 없음",
                    imageSource: like.imageUrl ? { uri: like.imageUrl } : undefined,
                    hasHeart: true,
                }))
                : [];

    const handleEditPress = () => {
        navigation.navigate('NameEdit');
    };

    const handleSettingPress = () => {
        navigation.navigate('Setting');
    };

    const handleRefetchProfile = () => {
        refetch();
    };

    if(isLoading || (dropLoading && !myDrops) || (likeLoading && !myLikes) || (playlistLoading && !myPlaylistsData)){
        return (
            <SafeAreaView style={newStyles.container}>
              <View style={[newStyles.loadingContainer]}>
                <ActivityIndicator color="#E61F54" />
                <Text style={newStyles.loadingText}>프로필 정보를 불러오고 있습니다!</Text>
              </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
          <SafeAreaView style={newStyles.container}>
            <View style={newStyles.loadingContainer}>
              <Text style={newStyles.errorText}>프로필 정보를 가져오는데 실패했어요!</Text>
              <Button title="다시 시도하기" onPress={handleRefetchProfile} />
            </View>
          </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={newStyles.container}>
            <ProfileHeader onSettingPress={handleSettingPress} />

            <ScrollView style={newStyles.content} showsVerticalScrollIndicator={false}>
                <ProfileInfo
                    username={me?.username}
                    onEditPress={handleEditPress}
                />

                <View style={newStyles.contentSection}>
                    <TabNavigation
                        activeTab={activeTab}
                        onTabPress={setActiveTab}
                    />

                    <View style={newStyles.contentContainer}>
                        {activeTab === 'playlist' ? (
                            <PlaylistGrid playlists={playlists} />
                        ) : (
                            <View style={newStyles.musicList}>
                                {(activeTab === "like" && likeError) ? (
                                    <View style={newStyles.emptyContainer}>
                                        <Text style={newStyles.emptyText}>
                                            좋아요 목록을 불러올 수 없습니다
                                        </Text>
                                    </View>
                                ) : currentData.length === 0 ? (
                                    <View style={newStyles.emptyContainer}>
                                        <Text style={newStyles.emptyText}>
                                            {activeTab === 'drop'
                                                ? '아직 드랍한 음악이 없습니다'
                                                : '좋아요한 음악이 없습니다'
                                            }
                                        </Text>
                                    </View>
                                ) : (
                                    currentData
                                        .filter((item) => item && item.droppingId)
                                        .map((item, index) => (
                                            <MusicCard
                                                key={`${item.droppingId}-${index}`}
                                                item={item}
                                            />
                                        ))
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const newStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(12),
    },
    loadingText: {
        color: TEXT_COLORS.DEFAULT,
        fontSize: scale(14),
    },
    errorText: {
        color: TEXT_COLORS.DEFAULT,
        fontSize: scale(14),
        marginBottom: verticalScale(16),
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: scale(16),
    },
    contentSection: {
        backgroundColor: 'transparent',
        borderRadius: scale(12),
        paddingHorizontal: scale(8),
        paddingVertical: scale(24),
        marginTop: verticalScale(24),
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    musicList: {
        gap: verticalScale(24),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(40),
    },
    emptyText: {
        color: TEXT_COLORS.CAPTION_1,
        fontSize: scale(14),
    },
});

export default UserProfileScreen;

