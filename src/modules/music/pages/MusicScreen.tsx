import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/MusicScreen';
import Icon from '../../../components/icon/Icon';
import { PRIMARY_COLORS, TEXT_COLORS, UI_COLORS } from '../../../constants/colors';
import CdPlayer from '../../../components/cdPlayer/CdPlayer';
import { useDropLikeCount } from '../hooks/useLike';
import { useToggleLike } from '../hooks/useLike';
import { useMyLikes } from '../../profile/hooks/useMyLike';
import { useHLSPlayer } from '../../../hooks/music/useHLSPlayer';
import { useBackgroundAudioPermission } from '../../../hooks/useBackgroundAudioPermission';
import { useQuery } from '@tanstack/react-query';
import { getSongInfo, getDroppingById } from '../../drop/api/dropApi';
import { BACKGROUND_COLORS } from '../../../constants/colors';
import { usePlayerStore } from '../../../stores/playerStore';

type Props = {
  route: {
    params: {
      droppingId: string;
      songId?: string;
      title?: string;
      artist?: string;
      message?: string;
      location?: string;
      likeCount?: number;
    };
  };
};

function MusicScreen({ route }: Props) {
  const navigation = useNavigation();
  const { droppingId, songId, title, artist, message, location } = route.params;

  const musicLikeCount = useDropLikeCount(droppingId);
  const toggleLike = useToggleLike(droppingId);
  const myLikes = useMyLikes();
  const isLiked = !!myLikes.data?.some((like) => like.droppingId === droppingId);
  const musicPlayer = useHLSPlayer(songId);
  const playNext = usePlayerStore(state => state.playNext);
  const playPrevious = usePlayerStore(state => state.playPrevious);

  const { requestBackgroundAudioPermission } = useBackgroundAudioPermission();
  const [hasRequestedPermission, setHasRequestedPermission] = React.useState(false);

  const { data: songInfo } = useQuery({
    queryKey: ['songInfo', songId],
    queryFn: () => getSongInfo(songId || ''),
    enabled: !!songId,
  });

  const { data: droppingInfo } = useQuery({
    queryKey: ['droppingInfo', droppingId],
    queryFn: () => getDroppingById(droppingId || ''),
    enabled: !!droppingId,
  });

  useEffect(() => {
    if (songId && !hasRequestedPermission) {
      setHasRequestedPermission(true);
      requestBackgroundAudioPermission();
    }
  }, [songId, requestBackgroundAudioPermission, hasRequestedPermission]);

  const handleTogglePlay = () => {
    musicPlayer.togglePlay();
  };

  const handleNext = () => {
    void playNext();
  };

  const handlePrev = () => {
    void playPrevious();
  };

  const handleSeek = (value: number) => {
    musicPlayer.seekTo(value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION_1} />
          </TouchableOpacity>
        </View>
        <View style={styles.cdPlayerSection}>
          <CdPlayer imageUrl={songInfo?.albumImagePath} isPlaying={musicPlayer.isPlaying} />
        </View>

        <View style={styles.musicInfoSection}>

          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                {songInfo?.title || title || '드랍핑 음악'}
              </Text>
            </View>
            <View style={styles.artistRow}>
              <Text style={styles.artist}>
                by {songInfo?.artist || artist || '알 수 없는 아티스트'}
              </Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="download" width={12} height={12} color="#EF9210" />
                  <Text style={[styles.actionButtonText, styles.saveButtonText]}>저장</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleLike.mutate()}
                  disabled={toggleLike.isPending}
                >
                  <Icon
                    name={isLiked ? "heart" : "like"}
                    width={12}
                    height={12}
                    color={PRIMARY_COLORS.DEFAULT}
                  />
                  <Text style={[styles.actionButtonText, styles.likeButtonText]}>
                    {musicLikeCount.data?.likeCount ?? 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

         <View style={styles.progressSection}>
            <Text style={styles.timeText}>{formatTime(musicPlayer.currentTime)}</Text>
            <Slider
              style={styles.progressSlider}
              minimumValue={0}
              maximumValue={musicPlayer.duration || 0}
              value={musicPlayer.currentTime}
              minimumTrackTintColor={PRIMARY_COLORS.DEFAULT}
              maximumTrackTintColor={TEXT_COLORS.TEXT2}
              thumbTintColor={PRIMARY_COLORS.DEFAULT}
              onSlidingComplete={handleSeek}
            />
            <Text style={styles.timeText}>{formatTime(musicPlayer.duration)}</Text>
          </View>
        </View>

        <View style={styles.playControlsSection}>
          <TouchableOpacity style={styles.skipButton} onPress={handlePrev}>
            <Icon name="prevTrack" width={22} height={27} color={TEXT_COLORS.DEFAULT} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playPauseButton} onPress={handleTogglePlay}>
            {musicPlayer.isPlaying ? (
              <View style={{ flexDirection: 'row', gap: 2 }}>
                <View style={{ width: 4, height: 20, backgroundColor: TEXT_COLORS.TEXT2 }} />
                <View style={{ width: 4, height: 20, backgroundColor: TEXT_COLORS.TEXT2 }} />
              </View>
            ) : (
              <Icon name="play" width={24} height={24} color={BACKGROUND_COLORS.BACKGROUND} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
            <Icon name="nextTrack" width={22} height={27} color={TEXT_COLORS.DEFAULT} />
          </TouchableOpacity>
        </View>

        <View style={styles.userLocationSection}>
          <View style={styles.userInfoRow}>
            <View style={styles.userCard}>
              <View style={styles.userDot} />
              <Text style={styles.userName}>
                {droppingInfo?.username || 'User_1'}
              </Text>
            </View>
          </View>

          {location && (
            <View style={styles.locationRow}>
              <View style={styles.locationIcon}>
                <Icon name="location" width={18} height={16} color={PRIMARY_COLORS.DEFAULT} />
              </View>
              {location.split(' ').map((tag, index) => (
                <View key={index} style={styles.locationTag}>
                  <Text style={styles.locationTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          {(message || droppingInfo?.content) && (
            <View style={styles.messageSection}>
              <View style={styles.messageContainer}>
                <View style={styles.messageContent}>
                  <Text style={styles.messageText}>
                    {message || droppingInfo?.content}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MusicScreen;
