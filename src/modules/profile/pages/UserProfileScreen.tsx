import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { ProfileStackParamList, RootStackParamList } from '../../../types/navigation';
import Icon from '../../../components/icon/Icon';
import TabNavigation from '../components/TabNavigation';
import MusicCard from '../components/MusicCard';
import PlaylistGrid from '../components/PlaylistGrid';
import CreatePlaylistModal from '../../music/components/CreatePlaylistModal';
import ToastModal from '../../../components/modal/ToastModal';
import {
  BACKGROUND_COLORS,
  TEXT_COLORS,
  PRIMARY_COLORS,
  SECONDARY_COLORS,
  TERTIARY_COLORS,
  UI_COLORS,
  FORM_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale, verticalScale } from '../../../utils/scalers';
import { useMyProfile } from '../hooks/useMyProfile';
import { useMyDrop } from '../hooks/useMyDrop';
import { useMyLikes } from '../hooks/useMyLike';
import { useMyPlaylists } from '../hooks/useMyPlaylists';
import { useCreatePlaylist } from '../../music/hooks/useCreatePlaylist';
import { getSongInfo } from '../../drop/api/dropApi';
import { updateProfileImageApi, getMyLikesApi } from '../../auth/api/authApi';
import { getErrorMessage } from '../../../utils/errorHandler';
import Config from 'react-native-config';

type DropItemData = {
  droppingId: string;
  memo: string;
  artist: string;
  location: string;
  imageSource?: { uri: string };
  hasHeart: boolean;
};

// 드랍 타입 정의
type DroppingType = 'MUSIC' | 'PLAYLIST' | 'VOTE';

type DroppingData = {
  type: DroppingType;
  droppingId: string;
  userId: number;
  // MUSIC type
  songId?: string;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  // PLAYLIST type
  playlistName?: string;
  songIds?: string[];
  firstAlbumImageUrl?: string;
  // VOTE type
  topic?: string;
  options?: string[];
  // Common
  content: string;
  latitude: number;
  longitude: number;
  address: string;
};


function UserProfileScreen() {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList & RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'drop' | 'like' | 'playlist'>('drop');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: myDrops = [], isLoading: dropLoading } = useMyDrop();
  const { data: myLikesResponse, isLoading: likeLoading, error: likeError } = useMyLikes();
  const myLikes = myLikesResponse?.droppings || [];

  const { data: me, isLoading, isError, refetch } = useMyProfile();
  const { data: myPlaylistsData, isLoading: playlistLoading } = useMyPlaylists();

  const [songTitles, setSongTitles] = useState<Record<string, string>>({});
  const [songImages, setSongImages] = useState<Record<string, string>>({});
  const [songArtists, setSongArtists] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);

  const createPlaylistMutation = useCreatePlaylist();

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSettings = () => {
    navigation.navigate('Setting');
  };

  const handleEditProfile = () => {
    navigation.navigate('NameEdit');
  };

  const handleProfileImagePress = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 0.8 as any,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        Alert.alert('오류', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        uploadProfileImage(asset);
      }
    });
  };

  const uploadProfileImage = async (imageAsset: any) => {
    try {
      setIsUploadingImage(true);

      const imageFile = {
        uri: imageAsset.uri,
        type: imageAsset.type,
        name: imageAsset.fileName || 'profile.jpg',
      };

      const result = await updateProfileImageApi(imageFile);

      if (result?.profileImageUrl) {
        // 프로필 데이터 새로고침
        refetch();

        Alert.alert('성공', '프로필 이미지가 업데이트되었습니다.');
      } else {
        Alert.alert('오류', '이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Profile image upload error:', error);
      Alert.alert('오류', '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreatePlaylist = () => {
    console.log('플레이리스트 생성 버튼 클릭됨');
    setShowCreatePlaylistModal(true);
  };

  const handleConfirmCreatePlaylist = async (playlistName: string) => {
    try {
      await createPlaylistMutation.mutateAsync(playlistName);
      setShowCreatePlaylistModal(false);
      setToastMessage('플레이리스트가 생성되었습니다');
      setShowToast(true);
    } catch (error) {
      console.error('플레이리스트 생성 실패:', error);
      setToastMessage(getErrorMessage(error));
      setShowToast(true);
    }
  };

  const handleCloseCreatePlaylistModal = () => {
    setShowCreatePlaylistModal(false);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/100x100/1D1D26/E9E2E3?text=Music';

    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${Config.MUSIC_API_BASE_URL}${imagePath}`;
  };

  const getLocationTags = (address: string) => {
    if (!address) return [];
    const parts = address.split(' ');
    return parts.slice(0, 4); // 최대 4개만 표시
  };

  const renderMusicItem = (item: DroppingData) => (
    <View key={item.droppingId} style={styles.musicItem}>
      <View style={styles.musicCard}>
        <View style={styles.musicContent}>
          <View style={styles.albumContainer}>
            <View style={styles.albumShadow} />
            <View style={styles.albumCoverContainer}>
              <Image
                source={{ uri: getImageUrl(item.albumImageUrl || '') }}
                style={styles.albumCover}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.musicInfo}>
            <Text style={styles.musicTitle} numberOfLines={2}>
              {item.title || 'LILAC'}
            </Text>
            <Text style={styles.musicArtist} numberOfLines={1}>
              by {item.artist || 'IU'}
            </Text>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Icon name="setting" width={3} height={13.5} color={TEXT_COLORS.CAPTION} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.locationTags}>
        <Icon name="location" width={16} height={18} color={TEXT_COLORS.CAPTION} />
        {getLocationTags(item.address).map((tag, index) => (
          <View key={index} style={styles.locationTag}>
            <Text style={styles.locationTagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPlaylistItem = (item: DroppingData) => (
    <View key={item.droppingId} style={styles.musicItem}>
      <View style={styles.musicCard}>
        <View style={styles.musicContent}>
          <View style={styles.playlistContainer}>
            <View style={styles.playlistHeader} />
            <View style={styles.playlistCover}>
              <Image
                source={{ uri: getImageUrl(item.firstAlbumImageUrl || '') }}
                style={styles.playlistCoverImage}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.musicInfo}>
            <Text style={[styles.musicTitle, styles.playlistTitle]} numberOfLines={2}>
              {item.playlistName || '환상 소곡집 op.3 : Monster'}
            </Text>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Icon name="setting" width={3} height={13.5} color={TEXT_COLORS.CAPTION} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.locationTags}>
        <Icon name="location" width={16} height={18} color={TEXT_COLORS.CAPTION} />
        {getLocationTags(item.address).map((tag, index) => (
          <View key={index} style={[styles.locationTag, styles.playlistLocationTag]}>
            <Text style={[styles.locationTagText, styles.playlistLocationTagText]}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderVoteItem = (item: DroppingData) => (
    <View key={item.droppingId} style={styles.musicItem}>
      <View style={styles.musicCard}>
        <View style={styles.musicContent}>
          <View style={styles.voteContainer}>
            <View style={styles.voteImageContainer}>
              <View style={styles.voteImageBack} />
              <View style={styles.voteImageFront}>
                <Image
                  source={{ uri: getImageUrl(item.firstAlbumImageUrl || '') }}
                  style={styles.voteImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          <View style={styles.musicInfo}>
            <Text style={[styles.musicTitle, styles.voteTitle]} numberOfLines={2}>
              {item.topic || '어떤 노래가 더 좋은가'}
            </Text>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Icon name="setting" width={3} height={13.5} color={TEXT_COLORS.CAPTION} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.locationTags}>
        <Icon name="location" width={16} height={18} color={TEXT_COLORS.CAPTION} />
        {getLocationTags(item.address).map((tag, index) => (
          <View key={index} style={[styles.locationTag, styles.voteLocationTag]}>
            <Text style={[styles.locationTagText, styles.voteLocationTagText]}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDropItem = (item: any) => {
    // droppingType을 type으로 변환하여 호환성 유지
    const itemType = item.type || item.droppingType;

    console.log('🔥 [DEBUG] renderDropItem - itemType:', itemType, 'original item:', item);

    switch (itemType) {
      case 'MUSIC':
        return renderMusicItem(item);
      case 'PLAYLIST':
        return renderPlaylistItem(item);
      case 'VOTE':
        return renderVoteItem(item);
      default:
        console.log('🔥 [DEBUG] renderDropItem - Unknown type:', itemType);
        return null;
    }
  };


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
        ? filteredLikes.map((like: any) => {
            let memo = "";
            let artist = "";
            let imageSource = undefined;

            if (like.droppingType === "MUSIC") {
              memo = like.title || "알 수 없는 곡";
              artist = like.artist || "알 수 없는 가수";
              imageSource = like.imageUrl ? { uri: like.imageUrl } : undefined;
            } else if (like.droppingType === "PLAYLIST") {
              memo = like.playlistName || "알 수 없는 플레이리스트";
              artist = "플레이리스트";
            } else if (like.droppingType === "VOTE") {
              memo = like.topic || "알 수 없는 투표";
              artist = "투표";
            }

            return {
              droppingId: like.droppingId,
              memo,
              artist,
              location: like.address || "위치 정보 없음",
              imageSource,
              hasHeart: true,
            };
          })
        : [];

  // 새로운 타입별 UI용 데이터 (드랍/좋아요 탭용)
  const droppingsData: any[] =
    activeTab === "drop"
      ? filteredDrops
      : activeTab === "like"
        ? filteredLikes.map((like: any) => {
            // 좋아요 데이터를 DroppingData 형식으로 변환
            const converted = {
              type: like.droppingType, // droppingType을 type으로 변환
              droppingId: like.droppingId,
              userId: 0, // 좋아요에서는 userId 정보가 없음
              address: like.address,
              content: '', // 좋아요에서는 content 정보가 없음
              latitude: 0, // 좋아요에서는 좌표 정보가 없음
              longitude: 0,
              // MUSIC type fields
              title: like.title,
              artist: like.artist,
              albumImageUrl: like.imageUrl,
              // PLAYLIST type fields
              playlistName: like.playlistName,
              // VOTE type fields
              topic: like.topic,
            };
            return converted;
          })
        : [];

  if(isLoading || (dropLoading && !myDrops) || (likeLoading && !myLikes) || (playlistLoading && !myPlaylistsData)){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={PRIMARY_COLORS.DEFAULT} />
          <Text style={styles.loadingText}>프로필 정보를 불러오고 있습니다!</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>프로필 정보를 가져오는데 실패했어요!</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>다시 시도하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
          <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Icon name="user" width={14} height={16} color={TEXT_COLORS.CAPTION} />
          <Text style={styles.headerTitle}>프로필</Text>
        </View>

        <TouchableOpacity onPress={handleSettings} style={styles.headerButton}>
          <Icon name="setting" width={24} height={24} color={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleProfileImagePress}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: me?.profileImageUrl || 'https://via.placeholder.com/72x72/E61F54/FFFFFF?text=U' }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            {isUploadingImage && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{me?.username || 'User_1'}</Text>
              <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                <Icon name="edit" width={12.75} height={12.75} color={TEXT_COLORS.CAPTION} />
              </TouchableOpacity>
            </View>

            <Text style={styles.userBio}>
              {me?.username}입니다{'\n'}
              ~~~~~~~~~{'\n'}
              ~~~~~~~~
            </Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <TabNavigation
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />

          <View style={styles.contentContainer}>
            {activeTab === 'playlist' ? (
              <PlaylistGrid
                playlists={playlists}
                onCreatePlaylist={handleCreatePlaylist}
              />
            ) : (
              <View style={styles.newDesignContainer}>
                {(activeTab === "like" && likeError) ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      좋아요 목록을 불러올 수 없습니다
                    </Text>
                  </View>
                ) : droppingsData.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {activeTab === 'drop'
                        ? '아직 드랍한 음악이 없습니다'
                        : '좋아요한 음악이 없습니다'
                      }
                    </Text>
                  </View>
                ) : (
                  droppingsData
                    .filter((item) => item && item.droppingId)
                    .map((item) => {
                      return renderDropItem(item);
                    })
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

      <CreatePlaylistModal
        visible={showCreatePlaylistModal}
        onClose={handleCloseCreatePlaylistModal}
        onConfirm={handleConfirmCreatePlaylist}
        isCreating={createPlaylistMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  retryButton: {
    backgroundColor: PRIMARY_COLORS.DEFAULT,
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(8),
  },
  retryButtonText: {
    color: TEXT_COLORS.BUTTON,
    fontSize: scale(14),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    height: scale(48),
  },
  headerButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_COLORS.BACKGROUND,
    paddingHorizontal: scale(16),
    paddingVertical: scale(4),
    borderRadius: scale(16),
    gap: scale(8),
  },
  headerTitle: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  profileContainer: {
    backgroundColor: UI_COLORS.BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    padding: scale(12),
    borderRadius: scale(12),
    marginBottom: scale(24),
    height: scale(128),
  },
  profileImageContainer: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36), // 반지름을 절반으로 설정하여 완전한 원 만들기
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(50),
  },
  profileInfo: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: scale(8),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  userName: {
    ...TYPOGRAPHY.HEADLINE_2,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(24),
    lineHeight: scale(32),
  },
  editButton: {
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userBio: {
    ...TYPOGRAPHY.CAPTION_1,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(14),
    lineHeight: scale(20),
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
  newDesignContainer: {
    gap: scale(8),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
  },
  emptyText: {
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(14),
  },
  musicItem: {
    gap: scale(8),
    width: scale(319),
    alignSelf: 'center',
  },
  musicCard: {
    backgroundColor: 'transparent',
    borderRadius: scale(8),
    shadowColor: '#0F0F24',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 8,
  },
  musicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(100),
    gap: scale(12),
    paddingRight: scale(12),
  },
  albumContainer: {
    position: 'relative',
  },
  albumShadow: {
    position: 'absolute',
    top: scale(10),
    left: scale(54),
    width: scale(80),
    height: scale(80),
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: scale(8),
  },
  albumCoverContainer: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(8),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  albumCover: {
    width: scale(100),
    height: scale(100),
  },
  playlistContainer: {
    width: scale(134),
    height: scale(100),
    position: 'relative',
  },
  playlistHeader: {
    position: 'absolute',
    top: 0,
    left: scale(8),
    right: scale(8),
    height: scale(8),
    backgroundColor: FORM_COLORS.BACKGROUND_2,
    borderColor: FORM_COLORS.STROKE,
    borderWidth: 1,
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
  },
  playlistCover: {
    position: 'absolute',
    top: scale(10),
    left: 0,
    right: 0,
    height: scale(72),
    borderRadius: scale(8),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistCoverImage: {
    width: scale(256),
    height: scale(256),
    shadowColor: '#000',
    shadowOffset: { width: 4.8, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6.4,
    elevation: 4,
  },
  voteContainer: {
    width: scale(100),
    height: scale(100),
    position: 'relative',
  },
  voteImageContainer: {
    width: scale(100),
    height: scale(100),
  },
  voteImageBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: scale(70),
    height: scale(70),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  voteImageFront: {
    position: 'absolute',
    top: scale(30),
    left: scale(30),
    width: scale(70),
    height: scale(70),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteImage: {
    width: scale(49),
    height: scale(49),
  },
  musicInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(4),
  },
  musicTitle: {
    ...TYPOGRAPHY.SUBTITLE,
    color: PRIMARY_COLORS.DEFAULT,
    fontSize: scale(18),
    lineHeight: scale(24),
    maxHeight: scale(52),
  },
  musicArtist: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(12),
    lineHeight: scale(16),
  },
  playlistTitle: {
    color: SECONDARY_COLORS.DEFAULT,
    maxHeight: scale(52),
  },
  voteTitle: {
    color: TERTIARY_COLORS.DEFAULT,
    maxHeight: scale(68),
  },
  menuButton: {
    width: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(4),
  },
  locationTag: {
    backgroundColor: FORM_COLORS.BACKGROUND_1,
    borderColor: FORM_COLORS.STROKE,
    borderWidth: 1,
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(24),
  },
  locationTagText: {
    ...TYPOGRAPHY.CAPTION_1,
    color: PRIMARY_COLORS.DEFAULT,
    fontSize: scale(14),
    lineHeight: scale(16),
  },
  playlistLocationTag: {
    marginTop: scale(-4),
  },
  playlistLocationTagText: {

    color: SECONDARY_COLORS.DEFAULT,
  },
  voteLocationTag: {
    // 투표용 태그 스타일
  },
  voteLocationTagText: {
    color: TERTIARY_COLORS.DEFAULT,
  },
});

export default UserProfileScreen;