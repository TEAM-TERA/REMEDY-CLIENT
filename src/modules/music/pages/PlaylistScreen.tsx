import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
  StatusBar,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Icon from '../../../components/icon/Icon';
import { BACKGROUND_COLORS, TEXT_COLORS, SECONDARY_COLORS, UI_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { usePlaylist } from '../hooks/usePlaylist';
import { usePlayerStore } from '../../../stores/playerStore';
import type { Song } from '../types/playlist';
import Config from 'react-native-config';

type Props = NativeStackScreenProps<RootStackParamList, 'Playlist'>;

const PlaylistItem = memo(({ song, onPress, isPlaying = false }: { song: Song; onPress: () => void; isPlaying?: boolean }) => {
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const baseUrl = Config.MUSIC_API_BASE_URL;
    return `${baseUrl}${imagePath}`;
  };

  return (
    <TouchableOpacity style={[styles.musicItem, isPlaying && styles.musicItemPlaying]} onPress={onPress}>
      {isPlaying && <View style={styles.gradientOverlay} />}

      <View style={styles.musicLeftSection}>
        <View style={styles.indicatorLine} />
        <View style={styles.albumCoverContainer}>
          <View style={styles.albumCoverShadow} />
          <Image
            source={{ uri: getImageUrl(song.albumImagePath) }}
            style={styles.albumCover}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.musicInfo}>
        <Text
          style={[styles.musicTitle, isPlaying && styles.musicTitlePlaying]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {song.title}
        </Text>
        <Text
          style={[styles.musicArtist, isPlaying && styles.musicArtistPlaying]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          by {song.artist}
        </Text>
      </View>

      <View style={styles.musicActions}>
        <TouchableOpacity style={styles.menuButton}>
          <View style={{ transform: [{ rotate: '270deg' }] }}>
            <Icon name="setting" width={3} height={13.5} color={TEXT_COLORS.CAPTION} />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

function PlaylistScreen({ route, navigation }: Props) {
  const { playlistId } = route.params;
  const { data: playlist, isLoading, isError, refetch } = usePlaylist(playlistId);
  const { currentId, playIfDifferent, setQueue } = usePlayerStore();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePlaySong = async (song: Song) => {
    try {
      const imageUrl = song.albumImagePath.startsWith('http')
        ? song.albumImagePath
        : `${Config.MUSIC_API_BASE_URL}${song.albumImagePath}`;

      await playIfDifferent(song.id, {
        title: song.title,
        artist: song.artist,
        artwork: imageUrl,
      });
    } catch (error) {
      console.error('Failed to play song:', error);
      Alert.alert('오류', '음악 재생에 실패했습니다.');
    }
  };

  const handlePlayAll = async () => {
    if (!playlist?.songs.length) return;

    try {
      // Play first song
      await handlePlaySong(playlist.songs[0]);
      // Set queue with all songs
      setQueue(playlist.songs.map(song => song.id));
    } catch (error) {
      console.error('Failed to play playlist:', error);
      Alert.alert('오류', '플레이리스트 재생에 실패했습니다.');
    }
  };

  const handleMusicDetail = (song: Song) => {
    navigation.navigate('MusicDetail', { songId: song.id });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={SECONDARY_COLORS.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            플레이리스트 로딩에 실패했습니다.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getPlaylistCoverImage = () => {
    if (playlist.songs.length > 0) {
      const imagePath = playlist.songs[0].albumImagePath;
      return imagePath.startsWith('http')
        ? imagePath
        : `${Config.MUSIC_API_BASE_URL}${imagePath}`;
    }
    return 'https://via.placeholder.com/300x300/1D1D26/E9E2E3?text=Playlist';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Icon name="music" width={22.477} height={16.52} color={TEXT_COLORS.CAPTION} />
          <Text style={styles.headerTitle}>플레이리스트</Text>
        </View>

        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Vinyl Record Cover */}
        <View style={styles.recordContainer}>
          <View style={styles.recordBackground} />

          {/* CD Player with Album Cover */}
          <View style={styles.cdPlayerContainer}>
            {/* Semicircular CD Disc */}
            <View style={styles.semicircularCdContainer}>
              <View style={styles.semicircularCd}>
                <Image
                  source={{ uri: getPlaylistCoverImage() }}
                  style={styles.semicircularCover}
                  resizeMode="cover"
                />
                <View style={styles.cdCenter} />
              </View>
            </View>

            {/* Smaller decorative elements from SVG */}
            <View style={styles.smallCircle1} />
            <View style={styles.smallCircle2} />
            <View style={styles.smallElement} />
          </View>

          <View style={styles.recordOverlay} />
        </View>

        {/* Playlist Info */}
        <View style={styles.playlistInfo}>
          <View style={styles.playlistHeader}>
            <Text style={styles.playlistTitle}>{playlist.name}</Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.userAvatar} />
            <Text style={styles.userName}>User_1</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.leftControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="plus" width={12} height={12} color={TEXT_COLORS.DEFAULT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="edit" width={12.75} height={12.75} color={TEXT_COLORS.DEFAULT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="heart" width={12} height={13.5} color={SECONDARY_COLORS.DEFAULT} />
            </TouchableOpacity>
          </View>

          <View style={styles.rightControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="music" width={15} height={13.333} color={TEXT_COLORS.DEFAULT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayAll}>
              <Icon name="play" width={10.667} height={12} color={TEXT_COLORS.BUTTON} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Music List */}
        <View style={styles.musicList}>
          {playlist.songs.map((song) => (
            <PlaylistItem
              key={song.id}
              song={song}
              onPress={() => handleMusicDetail(song)}
              isPlaying={currentId === song.id}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PlaylistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    height: scale(48),
  },
  backButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
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
  spacer: {
    width: scale(24),
    height: scale(24),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(24),
  },
  recordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: scale(180),
    marginBottom: scale(12),
    position: 'relative',
  },
  recordBackground: {
    position: 'absolute',
    top: 0,
    left: scale(16),
    right: scale(16),
    height: scale(181),
    backgroundColor: '#161622',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  cdPlayerContainer: {
    width: scale(343),
    height: scale(180),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  semicircularCdContainer: {
    position: 'absolute',
    right: scale(20),
    top: scale(0),
    width: scale(200),
    height: scale(100),
    overflow: 'hidden',
  },
  semicircularCd: {
    width: scale(200),
    height: scale(200),
    borderRadius: scale(100),
    backgroundColor: '#212131',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  semicircularCover: {
    width: scale(180),
    height: scale(180),
    borderRadius: scale(90),
  },
  cdCenter: {
    position: 'absolute',
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: 'rgba(0,0,0,0.6)',
    top: '50%',
    left: '50%',
    marginLeft: scale(-10),
    marginTop: scale(-10),
  },
  smallCircle1: {
    position: 'absolute',
    left: scale(20),
    top: scale(30),
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: '#1C1C2B',
  },
  smallCircle2: {
    position: 'absolute',
    left: scale(54),
    top: scale(34),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#1C1C2B',
  },
  smallElement: {
    position: 'absolute',
    left: scale(10),
    top: scale(58),
    width: scale(20),
    height: scale(40),
    backgroundColor: '#1C1C2B',
    borderRadius: scale(10),
  },
  recordOverlay: {
    position: 'absolute',
    width: scale(343),
    height: scale(180),
    left: scale(16),
    right: scale(16),
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  playlistInfo: {
    paddingHorizontal: scale(28),
    gap: scale(4),
  },
  playlistHeader: {
    gap: scale(48),
  },
  playlistTitle: {
    ...TYPOGRAPHY.BODY_1,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
    lineHeight: scale(22),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(4),
    gap: scale(8),
  },
  userAvatar: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: SECONDARY_COLORS.DEFAULT,
  },
  userName: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(12),
    lineHeight: scale(16),
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(28),
    marginVertical: scale(12),
  },
  leftControls: {
    flexDirection: 'row',
    gap: scale(16),
  },
  rightControls: {
    flexDirection: 'row',
    gap: scale(16),
    alignItems: 'center',
  },
  controlButton: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: SECONDARY_COLORS.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicList: {
    paddingHorizontal: scale(28),
    gap: scale(12),
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    position: 'relative',
    height: scale(80),
  },
  musicItemPlaying: {
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: scale(15),
    right: 0,
    height: scale(80),
    backgroundColor: 'rgba(239, 146, 16, 0.1)',
    borderRadius: scale(8),
  },
  musicLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  indicatorLine: {
    width: 0,
    height: scale(20),
    borderLeftWidth: 1.5,
    borderLeftColor: SECONDARY_COLORS.DEFAULT,
  },
  albumCoverContainer: {
    position: 'relative',
  },
  albumCoverShadow: {
    position: 'absolute',
    top: scale(10),
    left: scale(50),
    width: scale(60),
    height: scale(60),
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: scale(8),
    zIndex: 1,
  },
  albumCover: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(8),
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  musicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  musicTitle: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
    lineHeight: scale(22),
  },
  musicTitlePlaying: {
    color: SECONDARY_COLORS.DEFAULT,
  },
  musicArtist: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(12),
    lineHeight: scale(16),
  },
  musicArtistPlaying: {
    color: TEXT_COLORS.DEFAULT,
  },
  musicActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(16),
  },
  errorText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(14),
    textAlign: 'center',
    marginBottom: scale(16),
  },
  retryButton: {
    backgroundColor: SECONDARY_COLORS.DEFAULT,
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(8),
  },
  retryButtonText: {
    ...TYPOGRAPHY.BUTTON_TEXT,
    color: TEXT_COLORS.BUTTON,
    fontSize: scale(14),
  },
});