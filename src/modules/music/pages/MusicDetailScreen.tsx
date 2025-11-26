import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import TrackPlayer, { State, usePlaybackState, useActiveTrack } from 'react-native-track-player';
import Icon from '../../../components/icon/Icon';
import { BACKGROUND_COLORS, TEXT_COLORS, TERTIARY_COLORS, UI_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { RootStackParamList } from '../../../types/navigation';
import { usePlayerStore } from '../../../stores/playerStore';
import Config from 'react-native-config';

type Props = {
  route: RouteProp<RootStackParamList, 'MusicDetail'>;
};

export default function MusicDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<Props['route']>();
  const { songId: initialSongId } = route.params;

  const {
    currentId,
    playIfDifferent,
    playNext,
    playPrevious,
    skipToSongInPlaylist,
    isPlaylistMode,
    queue,
    playlistMetas
  } = usePlayerStore();

  const playbackState = usePlaybackState();
  const activeTrack = useActiveTrack();

  const isPlaying = playbackState.state === 'playing';
  const currentTrack = activeTrack;

  // Use current playing track ID if available, fallback to initial songId
  const displaySongId = currentId || initialSongId;

  // Get current track metadata from playlist or use activeTrack as fallback
  const getCurrentTrackInfo = useCallback(() => {
    if (isPlaylistMode && currentId && queue.length > 0 && playlistMetas.length > 0) {
      const currentIndex = queue.indexOf(currentId);
      if (currentIndex !== -1 && currentIndex < playlistMetas.length) {
        const meta = playlistMetas[currentIndex];
        console.log('🎵 Using playlist metadata:', { currentId, index: currentIndex, meta });
        return {
          title: meta.title || 'Unknown',
          artist: meta.artist || 'Unknown',
          artwork: meta.artwork || '',
        };
      }
    }

    // Fallback to activeTrack
    console.log('🎵 Using activeTrack fallback:', currentTrack);
    return {
      title: currentTrack?.title || 'LILAC',
      artist: currentTrack?.artist || 'IU',
      artwork: currentTrack?.artwork || '',
    };
  }, [isPlaylistMode, currentId, queue, playlistMetas, currentTrack]);

  const displayTrackInfo = getCurrentTrackInfo();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePlay = useCallback(async () => {
    if (!displaySongId) return;

    try {
      setIsLoading(true);

      if (currentId === displaySongId) {
        // 현재 곡이면 일시정지/재생 토글
        if (isPlaying) {
          await TrackPlayer.pause();
        } else {
          await TrackPlayer.play();
        }
      } else {
        // 다른 곡이면 플레이리스트 모드 고려해서 재생
        if (isPlaylistMode) {
          console.log('🎵 MusicDetailScreen: In playlist mode, skipping to song:', displaySongId);
          await skipToSongInPlaylist(displaySongId);
        } else {
          console.log('🎵 MusicDetailScreen: Single song mode, playing different song');
          await playIfDifferent(displaySongId, {
            title: displayTrackInfo.title,
            artist: displayTrackInfo.artist,
            artwork: getImageUrl(displayTrackInfo.artwork),
          });
        }
      }
    } catch (error) {
      console.error('음악 재생 실패:', error);
      Alert.alert('오류', '음악 재생에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [displaySongId, currentId, isPlaying, playIfDifferent, currentTrack, skipToSongInPlaylist, isPlaylistMode]);

  const handleNext = useCallback(async () => {
    try {
      setIsLoading(true);
      await playNext();
    } catch (error) {
      console.error('다음 곡 재생 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [playNext]);

  const handlePrevious = useCallback(async () => {
    try {
      setIsLoading(true);
      await playPrevious();
    } catch (error) {
      console.error('이전 곡 재생 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [playPrevious]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300/1D1D26/E9E2E3?text=Music';

    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${Config.MUSIC_API_BASE_URL}${imagePath}`;
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 진행률 업데이트
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const trackDuration = await TrackPlayer.getDuration();
        const trackPosition = await TrackPlayer.getPosition();

        setDuration(trackDuration);
        setPosition(trackPosition);

        if (trackDuration > 0) {
          setProgress(trackPosition / trackDuration);
        }
      } catch (error) {
        // TrackPlayer가 초기화되지 않은 경우 에러 무시
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track 변경 감지 및 로깅
  useEffect(() => {
    console.log('🎵 [MusicDetailScreen] Track info updated:', {
      displaySongId,
      currentId,
      isPlaylistMode,
      activeTrackId: currentTrack?.id,
      displayTrackInfo,
      queueLength: queue.length,
      playlistMetasLength: playlistMetas.length,
    });
  }, [displayTrackInfo, currentId, displaySongId, isPlaylistMode, queue.length, playlistMetas.length]);

  const currentIsPlaying = currentId === displaySongId && isPlaying;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Vinyl Record */}
        <View style={styles.recordContainer}>
          <View style={styles.recordPlayer}>
            <View style={styles.recordPlayerMask}>
              <Image
                source={{ uri: getImageUrl(displayTrackInfo.artwork || '') }}
                style={styles.recordCover}
                resizeMode="cover"
              />
            </View>
            <View style={styles.recordCenter} />
          </View>
        </View>

        {/* Music Info */}
        <View style={styles.musicInfo}>
          <View style={styles.musicHeader}>
            <Text style={styles.musicTitle}>
              {displayTrackInfo.title}
            </Text>
          </View>
          <View style={styles.artistInfo}>
            <Text style={styles.artistText}>
              by {displayTrackInfo.artist}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="music" width={15} height={13.333} color={TEXT_COLORS.DEFAULT} />
        </TouchableOpacity>

        <View style={styles.mainControls}>
          <TouchableOpacity onPress={handlePrevious} style={styles.skipButton}>
            <View style={{ transform: [{ rotate: '180deg' }, { scaleY: -1 }] }}>
              <Icon name="play" width={13} height={15.6} color={TEXT_COLORS.DEFAULT} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePlay}
            style={[styles.playButton, isLoading && styles.playButtonDisabled]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={BACKGROUND_COLORS.BACKGROUND} />
            ) : currentIsPlaying ? (
              <View style={styles.pauseIcon}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            ) : (
              <Icon name="play" width={12} height={14.4} color={BACKGROUND_COLORS.BACKGROUND} />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.skipButton}>
            <Icon name="play" width={13} height={15.6} color={TEXT_COLORS.DEFAULT} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.controlButton}>
          <Icon name="music" width={13.5} height={16.5} color={TEXT_COLORS.DEFAULT} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(24),
  },
  recordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordPlayer: {
    width: scale(300),
    height: scale(300),
    borderRadius: scale(150),
    backgroundColor: 'rgba(242, 63, 111, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  recordPlayerMask: {
    width: scale(300),
    height: scale(300),
    borderRadius: scale(150),
    overflow: 'hidden',
    position: 'relative',
  },
  recordCover: {
    width: scale(300),
    height: scale(300),
  },
  recordCenter: {
    position: 'absolute',
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    backgroundColor: 'rgba(0,0,0,0.3)',
    top: '50%',
    left: '50%',
    marginLeft: scale(-45),
    marginTop: scale(-45),
  },
  musicInfo: {
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(12),
  },
  musicHeader: {
    alignItems: 'center',
  },
  musicTitle: {
    ...TYPOGRAPHY.HEADLINE_1,
    color: TERTIARY_COLORS.DEFAULT,
    fontSize: scale(32),
    lineHeight: scale(40),
    textAlign: 'center',
  },
  artistInfo: {
    alignItems: 'center',
  },
  artistText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
    lineHeight: scale(22),
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    width: '100%',
    paddingHorizontal: scale(12),
  },
  timeText: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(12),
    lineHeight: scale(16),
  },
  progressBar: {
    flex: 1,
    height: scale(4),
    backgroundColor: UI_COLORS.BACKGROUND,
    borderRadius: scale(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: TERTIARY_COLORS.DEFAULT,
    borderRadius: scale(2),
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingBottom: scale(32),
  },
  controlButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  skipButton: {
    width: scale(36),
    height: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: TEXT_COLORS.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonDisabled: {
    opacity: 0.7,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: scale(2.4),
    alignItems: 'center',
  },
  pauseBar: {
    width: scale(4.8),
    height: scale(20.4),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
});