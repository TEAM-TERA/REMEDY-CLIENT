import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation, runOnJS } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Icon from '../../../components/icon/Icon';
import { BACKGROUND_COLORS, TEXT_COLORS, SECONDARY_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { usePlayerStore } from '../../../stores/playerStore';
import { useHLSPlayer } from '../../../hooks/music/useHLSPlayer';
import { useBackgroundAudioPermission } from '../../../hooks/useBackgroundAudioPermission';
import { useQuery } from '@tanstack/react-query';
import { getSongInfo } from '../../drop/api/dropApi';
import Config from 'react-native-config';

type Props = NativeStackScreenProps<RootStackParamList, 'MusicPlayer'>;

function MusicPlayerScreen({ route, navigation }: Props) {
  const { songId, songInfo } = route.params;
  const {
    currentId,
    isShuffleEnabled,
    isRepeatEnabled,
    setShuffleEnabled,
    setRepeatEnabled
  } = usePlayerStore();

  // 현재 재생 중인 곡 ID 사용
  const activeSongId = currentId || songId;
  const musicPlayer = useHLSPlayer(activeSongId);
  const playNext = usePlayerStore(state => state.playNext);
  const playPrevious = usePlayerStore(state => state.playPrevious);

  const { requestBackgroundAudioPermission } = useBackgroundAudioPermission();
  const [hasRequestedPermission, setHasRequestedPermission] = React.useState(false);

  // 회전 애니메이션
  const rotation = useSharedValue(0);

  const { data: fetchedSongInfo } = useQuery({
    queryKey: ['songInfo', activeSongId],
    queryFn: () => getSongInfo(activeSongId || ''),
    enabled: !!activeSongId,
  });

  // Use fetched data or fallback to route params
  const currentSongInfo = fetchedSongInfo || songInfo || {
    title: '음악',
    artist: '알 수 없음',
    albumImagePath: '',
  };

  useEffect(() => {
    if (songId && !hasRequestedPermission) {
      setHasRequestedPermission(true);
      requestBackgroundAudioPermission();
    }
  }, [songId, requestBackgroundAudioPermission, hasRequestedPermission]);

  // 회전 애니메이션 효과
  useEffect(() => {
    if (musicPlayer.isPlaying) {
      // 현재 rotation 값에서 계속 회전하도록 수정
      rotation.value = withRepeat(
        withTiming(rotation.value + 360, { duration: 3000 }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
    }
  }, [musicPlayer.isPlaying]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleTogglePlayPause = () => {
    musicPlayer.togglePlay();
  };

  const handlePrevious = () => {
    void playPrevious();
  };

  const handleNext = () => {
    void playNext();
  };

  const handleSeek = (value: number) => {
    musicPlayer.seekTo(value);
  };

  const handleToggleShuffle = () => {
    setShuffleEnabled(!isShuffleEnabled);
  };

  const handleToggleRepeat = () => {
    setRepeatEnabled(!isRepeatEnabled);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300/1D1D26/E9E2E3?text=Music';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = Config.MUSIC_API_BASE_URL;
    return `${baseUrl}${imagePath}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="left" width={10} height={18} fill={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>
      </View>

      {/* Album Cover */}
      <View style={styles.albumContainer}>
        <View style={styles.albumCover}>
          <Animated.View style={[styles.rotatingContainer, animatedStyle]}>
            <Image
              source={{ uri: getImageUrl(currentSongInfo.albumImagePath) }}
              style={styles.albumImage}
              resizeMode="cover"
            />
          </Animated.View>
          <View style={styles.albumCenter} />
        </View>
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{currentSongInfo.title}</Text>
        <Text style={styles.artistName}>by {currentSongInfo.artist}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(musicPlayer.currentTime)}</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={musicPlayer.duration || 1}
            value={musicPlayer.currentTime}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={SECONDARY_COLORS.DEFAULT}
            maximumTrackTintColor={TEXT_COLORS.CAPTION}
            thumbTintColor={SECONDARY_COLORS.DEFAULT}
          />
        </View>
        <Text style={styles.timeText}>{formatTime(musicPlayer.duration)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={handleToggleShuffle}>
          <Icon
            name="shuffle"
            width={20}
            height={20}
            fill={isShuffleEnabled ? SECONDARY_COLORS.DEFAULT : TEXT_COLORS.DEFAULT}
          />
        </TouchableOpacity>

        <View style={styles.mainControls}>
          <TouchableOpacity onPress={handlePrevious}>
            <Icon name="prevTrack" width={24} height={24} fill={TEXT_COLORS.DEFAULT} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton} onPress={handleTogglePlayPause}>
            <Icon
              name={musicPlayer.isPlaying ? "pause" : "play"}
              width={24}
              height={24}
              fill={BACKGROUND_COLORS.BACKGROUND}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext}>
            <Icon name="nextTrack" width={24} height={24} fill={TEXT_COLORS.DEFAULT} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.controlButton} onPress={handleToggleRepeat}>
          <Icon
            name="repeat"
            width={20}
            height={20}
            fill={isRepeatEnabled ? SECONDARY_COLORS.DEFAULT : TEXT_COLORS.DEFAULT}
          />
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
  albumContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scale(20),
  },
  albumCover: {
    width: scale(320),
    height: scale(320),
    borderRadius: scale(160),
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#F23F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  rotatingContainer: {
    width: scale(320),
    height: scale(320),
    borderRadius: scale(160),
    overflow: 'hidden',
  },
  albumImage: {
    width: scale(320),
    height: scale(320),
  },
  albumCenter: {
    position: 'absolute',
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: 'rgba(0,0,0,0.3)',
    top: '50%',
    left: '50%',
    marginLeft: scale(-40),
    marginTop: scale(-40),
  },
  songInfo: {
    alignItems: 'flex-start',
    paddingHorizontal: scale(24),
    marginBottom: scale(24),
  },
  songTitle: {
    ...TYPOGRAPHY.HEADLINE_1,
    color: SECONDARY_COLORS.DEFAULT,
    fontSize: scale(32),
    lineHeight: scale(40),
    marginBottom: scale(4),
  },
  artistName: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(16),
    lineHeight: scale(22),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    marginBottom: scale(24),
    gap: scale(8),
  },
  timeText: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(12),
    lineHeight: scale(16),
  },
  sliderContainer: {
    flex: 1,
    height: scale(10),
  },
  slider: {
    flex: 1,
    height: scale(10),
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    marginTop: scale(12),
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
  playButton: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: TEXT_COLORS.TEXT2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MusicPlayerScreen;