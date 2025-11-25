import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Platform, Alert, PermissionsAndroid } from 'react-native';
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
import { useUpdateProfileImage } from '../hooks/useUpdateProfileImage';
import { getSongInfo } from '../../drop/api/dropApi';
import { scale, verticalScale } from '../../../utils/scalers';
import { BACKGROUND_COLORS, TEXT_COLORS } from '../../../constants/colors';
import ToastModal from '../../../components/modal/ToastModal';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

function UserProfileScreen() {
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const [activeTab, setActiveTab] = useState<'drop' | 'like' | 'playlist'>('drop');

    const { data: myDrops = [], isLoading: dropLoading } = useMyDrop();
    const { data: myLikes = [], isLoading: likeLoading, error: likeError } = useMyLikes();
    const { data: me, isLoading, isError, refetch } = useMyProfile();
    const { data: myPlaylistsData, isLoading: playlistLoading } = useMyPlaylists();

    const [songTitles, setSongTitles] = useState<Record<string, string>>({});
    const [songImages, setSongImages] = useState<Record<string, string>>({});
    const [songArtists, setSongArtists] = useState<Record<string, string>>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const updateProfileImageMutation = useUpdateProfileImage();

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
                        return [id, info?.title as string, info?.artist as string, info?.albumImagePath as string];
                    } catch {
                        return [id, id, '', ''];
                    }
                }));
                const titleMap: Record<string, string> = {};
                const artistMap: Record<string, string> = {};
                const imageMap: Record<string, string> = {};
                results.forEach(([id, title, artist, image]) => {
                    titleMap[id as string] = (title as string) || String(id);
                    artistMap[id as string] = (artist as string) || '';
                    imageMap[id as string] = (image as string) || '';
                });
                setSongTitles(titleMap);
                setSongArtists(artistMap);
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
                artist: songArtists[d.songId] || "알 수 없는 가수",
                location: d.address || "위치 정보 없음",
                imageSource: songImages[d.songId] ? { uri: songImages[d.songId] } : undefined,
                hasHeart: false,
            }))
            : activeTab === "like"
                ? filteredLikes.map((like: any) => ({
                    droppingId: like.droppingId,
                    memo: like.title || "알 수 없는 곡",
                    artist: like.artist || "알 수 없는 가수",
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

    const handleImagePress = async () => {
        console.log('프로필 이미지 클릭됨');

        if (Platform.OS === 'android') {
            try {
                const permission = Platform.Version >= 33
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

                const granted = await PermissionsAndroid.request(permission, {
                    title: '저장소 접근 권한',
                    message: '갤러리에서 이미지를 선택하려면 저장소 접근 권한이 필요합니다.',
                    buttonNeutral: '나중에',
                    buttonNegative: '취소',
                    buttonPositive: '확인',
                });

                console.log('권한 요청 결과:', granted);

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('권한 필요', '갤러리 접근을 위해 저장소 권한이 필요합니다.');
                    return;
                }
            } catch (err) {
                console.warn('권한 요청 실패:', err);
            }
        }

        openImagePicker();
    };

    const openImagePicker = async () => {
        console.log('갤러리 열기 시도');

        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            maxHeight: 1024,
            maxWidth: 1024,
            quality: 0.8 as any,
            selectionLimit: 1,
        };

        const handleImagePickerResponse = async (response: ImagePickerResponse) => {
            console.log('Image picker response:', response);

            if (response.didCancel) {
                console.log('사용자가 이미지 선택을 취소했습니다');
                return;
            }

            if (response.errorMessage) {
                console.error('Image picker error:', response.errorMessage);
                Alert.alert('오류', `이미지 선택 오류: ${response.errorMessage}`);
                return;
            }

            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                console.log('선택된 이미지:', asset);

                if (asset.uri && asset.fileName && asset.type) {
                    try {
                        console.log('이미지 업로드 시작');
                        const formData = new FormData();
                        formData.append('image', {
                            uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
                            type: asset.type,
                            name: asset.fileName,
                        } as any);

                        await updateProfileImageMutation.mutateAsync(formData);
                        console.log('이미지 업로드 성공');
                        setToastMessage('프로필 이미지 변경 완료');
                        setShowToast(true);
                    } catch (error) {
                        console.error('프로필 이미지 업로드 실패:', error);
                        setToastMessage('프로필 이미지 업데이트에 실패했습니다');
                        setShowToast(true);
                    }
                } else {
                    console.error('이미지 정보 부족:', { uri: asset.uri, fileName: asset.fileName, type: asset.type });
                }
            } else {
                console.log('선택된 이미지가 없습니다');
            }
        };

        try {
            console.log('launchImageLibrary 호출');
            launchImageLibrary(options, handleImagePickerResponse);
        } catch (error) {
            console.error('launchImageLibrary 에러:', error);
            Alert.alert('오류', '갤러리를 열 수 없습니다. 앱을 다시 시작해보세요.');
        }
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
                    profileImageUrl={me?.profileImageUrl || undefined}
                    onEditPress={handleEditPress}
                    onImagePress={handleImagePress}
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

            <ToastModal
                visible={showToast}
                message={toastMessage}
                type="success"
                onClose={() => setShowToast(false)}
            />
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

