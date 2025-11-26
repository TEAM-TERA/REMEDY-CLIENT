import React, { memo, useState, useEffect } from 'react';
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
import TrackPlayer, { State, Event } from 'react-native-track-player';

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
  const { currentId, playIfDifferent, setQueue, isShuffleEnabled, setShuffleEnabled } = usePlayerStore();
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);

  // 재생 상태 체크
  useEffect(() => {
    const checkPlaybackState = async () => {
      try {
        const state = await TrackPlayer.getPlaybackState();
        setIsCurrentlyPlaying(state.state === State.Playing);
      } catch (error) {
        console.error('Failed to get playback state:', error);
      }
    };

    checkPlaybackState();
    const interval = setInterval(checkPlaybackState, 1000);
    return () => clearInterval(interval);
  }, [currentId]);

  // 플레이리스트 내에서 다음 곡 재생 (메타데이터 포함)
  const handlePlayNextInPlaylist = async () => {
    if (!playlist?.songs || !currentId) return;

    const currentIndex = playlist.songs.findIndex(song => song.id === currentId);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % playlist.songs.length;
    const nextSong = playlist.songs[nextIndex];

    console.log('🔄 Auto-playing next song:', {
      currentId,
      currentIndex,
      nextIndex,
      nextSong: nextSong ? { id: nextSong.id, title: nextSong.title, artist: nextSong.artist } : null
    });

    if (nextSong) {
      await handlePlaySong(nextSong);
    }
  };

  // 자동 다음 곡 재생을 위한 이벤트 리스너
  useEffect(() => {
    const onTrackPlaybackQueueEnded = async () => {
      console.log('Track ended, playing next...');
      await handlePlayNextInPlaylist();
    };

    // TrackPlayer 이벤트 리스너 등록
    const trackEndedListener = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, onTrackPlaybackQueueEnded);

    return () => {
      trackEndedListener.remove();
    };
  }, [playlist, currentId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleTogglePlayPause = async () => {
    try {
      if (currentId && playlist?.songs) {
        // 현재 재생 중인 곡 찾기
        const currentSong = playlist.songs.find(song => song.id === currentId);
        if (currentSong) {
          // MusicPlayer 화면으로 이동
          navigation.navigate('MusicPlayer', {
            songId: currentSong.id,
            songInfo: {
              title: currentSong.title,
              artist: currentSong.artist,
              albumImagePath: currentSong.albumImagePath,
            }
          });
          return;
        }
      }

      // 현재 재생 중인 곡이 없으면 첫 번째 곡부터 재생
      await handlePlayAll();
    } catch (error) {
      console.error('Failed to toggle playback:', error);
    }
  };

  const handleToggleShuffle = () => {
    setShuffleEnabled(!isShuffleEnabled);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handlePlaySong = async (song: Song) => {
    try {
      const imageUrl = song.albumImagePath.startsWith('http')
        ? song.albumImagePath
        : `${Config.MUSIC_API_BASE_URL}${song.albumImagePath}`;

      console.log('🎵 Playing song with metadata:', {
        id: song.id,
        title: song.title,
        artist: song.artist,
        albumImagePath: song.albumImagePath,
      });

      await playIfDifferent(song.id, {
        title: song.title || '음악',
        artist: song.artist || '알 수 없음',
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
      let songsToPlay = [...playlist.songs];

      // 셔플이 활성화된 경우 곡 순서를 섞음
      if (isShuffleEnabled) {
        songsToPlay = shuffleArray(songsToPlay);
      }

      // 첫 번째 곡 재생
      await handlePlaySong(songsToPlay[0]);

      // 큐에 모든 곡 설정
      setQueue(songsToPlay.map(song => song.id));

      setIsCurrentlyPlaying(true);

      // MusicPlayer 화면으로 이동
      navigation.navigate('MusicPlayer', {
        songId: songsToPlay[0].id,
        songInfo: {
          title: songsToPlay[0].title,
          artist: songsToPlay[0].artist,
          albumImagePath: songsToPlay[0].albumImagePath,
        }
      });
    } catch (error) {
      console.error('Failed to play playlist:', error);
      Alert.alert('오류', '플레이리스트 재생에 실패했습니다.');
    }
  };

  const handleMusicDetail = async (song: Song) => {
    if (!playlist?.songs) return;

    try {
      // 선택한 곡을 재생
      await handlePlaySong(song);

      // 선택한 곡부터 시작하는 큐 생성
      const selectedIndex = playlist.songs.findIndex(s => s.id === song.id);
      if (selectedIndex !== -1) {
        let reorderedSongs = [...playlist.songs];

        if (isShuffleEnabled) {
          // 셔플이 활성화된 경우: 선택한 곡을 첫 번째로 하고 나머지를 셞플
          const otherSongs = playlist.songs.filter(s => s.id !== song.id);
          const shuffledOthers = shuffleArray(otherSongs);
          reorderedSongs = [song, ...shuffledOthers];
        } else {
          // 일반 모드: 선택한 곡부터 시작하는 순서
          reorderedSongs = [
            ...playlist.songs.slice(selectedIndex),
            ...playlist.songs.slice(0, selectedIndex)
          ];
        }

        setQueue(reorderedSongs.map(s => s.id));
      }

      setIsCurrentlyPlaying(true);

      navigation.navigate('MusicPlayer', {
        songId: song.id,
        songInfo: {
          title: song.title,
          artist: song.artist,
          albumImagePath: song.albumImagePath,
        }
      });
    } catch (error) {
      console.error('Failed to play selected song:', error);
    }
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

  // 플레이리스트 데이터 로깅 (디버깅용)
  if (playlist && __DEV__) {
    console.log('📋 Playlist data:', {
      name: playlist.name,
      songsCount: playlist.songs?.length,
      firstSong: playlist.songs?.[0] ? {
        id: playlist.songs[0].id,
        title: playlist.songs[0].title,
        artist: playlist.songs[0].artist,
        fields: Object.keys(playlist.songs[0])
      } : null
    });
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
            <Text style={styles.songCount}>{playlist.songs.length}곡</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.leftControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="plus" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="edit" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="heart" width={16} height={16} color={SECONDARY_COLORS.DEFAULT} />
            </TouchableOpacity>
          </View>

          <View style={styles.rightControls}>
            <TouchableOpacity
              style={[styles.controlButton, isShuffleEnabled && styles.activeControlButton]}
              onPress={handleToggleShuffle}
            >
              <Icon name="shuffle" width={20} height={20} color={isShuffleEnabled ? SECONDARY_COLORS.DEFAULT : TEXT_COLORS.DEFAULT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="delete" width={20} height={20} color={SECONDARY_COLORS.DEFAULT} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={currentId ? handleTogglePlayPause : handlePlayAll}>
              <Icon
                name={isCurrentlyPlaying ? "pause" : "play"}
                width={14}
                height={14}
                color={TEXT_COLORS.BUTTON}
              />
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
  songCount: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(12),
    lineHeight: scale(16),
    marginLeft: scale(8),
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(28),
    marginTop: scale(24),
    marginBottom: scale(16),
  },
  leftControls: {
    flexDirection: 'row',
    gap: scale(20),
  },
  rightControls: {
    flexDirection: 'row',
    gap: scale(20),
    alignItems: 'center',
  },
  controlButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: 'rgba(255, 148, 41, 0.15)',
  },
  playButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
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