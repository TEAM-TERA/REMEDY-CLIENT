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
import TrackPlayer, { State } from 'react-native-track-player';
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
  const { songId } = route.params;

  const {
    currentId,
    currentTrack,
    playIfDifferent,
    togglePlayPause,
    isPlaying,
    next,
    previous
  } = usePlayerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePlay = useCallback(async () => {
    if (!songId) return;

    try {
      setIsLoading(true);

      if (currentId === songId) {
        // 현재 곡이면 일시정지/재생 토글
        await togglePlayPause();
      } else {
        // 다른 곡이면 새로 재생
        await playIfDifferent(songId, {
          title: currentTrack?.title || 'Unknown',
          artist: currentTrack?.artist || 'Unknown',
          artwork: getImageUrl(currentTrack?.albumImagePath || ''),
        });
      }
    } catch (error) {
      console.error('음악 재생 실패:', error);
      Alert.alert('오류', '음악 재생에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [songId, currentId, togglePlayPause, playIfDifferent, currentTrack]);

  const handleNext = useCallback(async () => {
    try {
      setIsLoading(true);
      await next();
    } catch (error) {
      console.error('다음 곡 재생 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [next]);

  const handlePrevious = useCallback(async () => {
    try {
      setIsLoading(true);
      await previous();
    } catch (error) {
      console.error('이전 곡 재생 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [previous]);

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

  const currentIsPlaying = currentId === songId && isPlaying;

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
                source={{ uri: getImageUrl(currentTrack?.albumImagePath || '') }}
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
              {currentTrack?.title || 'LILAC'}
            </Text>
          </View>
          <View style={styles.artistInfo}>
            <Text style={styles.artistText}>
              by {currentTrack?.artist || 'IU'}
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