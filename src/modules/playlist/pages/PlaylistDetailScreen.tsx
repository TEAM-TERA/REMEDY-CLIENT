import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import TrackPlayer, { usePlaybackState, useActiveTrack } from 'react-native-track-player';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Icon from '../../../components/icon/Icon';
import {
  BACKGROUND_COLORS,
  TEXT_COLORS,
  FORM_COLORS,
  SECONDARY_COLORS,
  PRIMARY_COLORS
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDroppingById, toggleLike, getLikeCount } from '../../drop/api/dropApi';
import type { PlaylistDropDetail, PlaylistDetailSong } from '../types/PlaylistDetail';
import Config from 'react-native-config';
import { usePlayerStore } from '../../../stores/playerStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaylistDetail'>;

function PlaylistDetailScreen({ navigation, route }: Props) {
  const { droppingId } = route.params;
  const { playIfDifferent, setCurrentId, currentId, playPlaylist, skipToSongInPlaylist, isPlaylistMode } = usePlayerStore();
  const playbackState = usePlaybackState();
  const activeTrack = useActiveTrack();
  const queryClient = useQueryClient();

  const isPlaying = playbackState.state === 'playing';
  const currentTrackId = activeTrack?.id;

  const { data: playlistDetail, isLoading, error } = useQuery({
    queryKey: ['playlistDropDetail', droppingId],
    queryFn: () => getDroppingById(droppingId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: likeCountData } = useQuery({
    queryKey: ['likeCount', droppingId],
    queryFn: () => getLikeCount(droppingId),
    staleTime: 1 * 60 * 1000, // 1분
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(droppingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeCount', droppingId] });
    },
  });

  const getImageUrl = (albumImagePath?: string) => {
    if (!albumImagePath) {
      return require('../../../assets/images/profileImage.png');
    }
    if (albumImagePath.startsWith('http')) {
      return { uri: albumImagePath };
    }
    const baseUrl = Config.MUSIC_API_BASE_URL || 'http://localhost:3000';
    return { uri: `${baseUrl}${albumImagePath}` };
  };

  const handleSongPress = async (songId: string, title: string, artist: string, albumImagePath?: string) => {
    if (!playlistDetail?.songs) return;

    console.log('🎵 Song pressed:', songId, 'Current playing:', currentId, 'Is playlist mode:', isPlaylistMode);

    // Check if this is the currently playing song
    if (currentId === songId) {
      console.log('🎵 Same song already playing, just navigating to detail screen');
      // Just navigate to the detail screen without changing playback
      navigation.navigate('MusicPlayer', {
        songId,
        songInfo: {
          title,
          artist,
          albumImagePath: albumImagePath || '',
        }
      });
      return;
    }

    // Check if we're currently in playlist mode and the song is in the current queue
    if (isPlaylistMode) {
      console.log('🎵 In playlist mode, trying to skip to song:', songId);
      // Try to skip to the song within the existing playlist
      try {
        await skipToSongInPlaylist(songId);
        // Check if the skip was successful by verifying current track
        const activeTrack = await TrackPlayer.getActiveTrack();
        if (activeTrack?.id === songId) {
          console.log('✅ Successfully skipped to song in playlist');
          // Navigate to MusicPlayer screen for successful skip
          navigation.navigate('MusicPlayer', {
            songId,
            songInfo: {
              title,
              artist,
              albumImagePath: albumImagePath || '',
            }
          });
          return;
        } else {
          console.log('⚠️ Skip failed, falling back to restart playlist');
          throw new Error('Skip failed');
        }
      } catch (error) {
        console.log('🔄 Skip failed, restarting playlist from clicked song');
        // Fall through to restart playlist logic
      }
    }

    // If we reach here: either not in playlist mode or skip failed
    console.log('🎵 Starting new playlist from clicked song');
    // Find the index of the clicked song
    const songIndex = playlistDetail.songs.findIndex(song => song.songId === songId);
    if (songIndex === -1) return;

    // Prepare song IDs and metadata for the entire playlist
    const songIds = playlistDetail.songs.map(song => song.songId);
    const songMetas = playlistDetail.songs.map(song => {
      const artwork = getImageUrl(song.albumImagePath);
      return {
        title: song.title,
        artist: song.artist,
        artwork: typeof artwork === 'object' && 'uri' in artwork ? artwork.uri : undefined,
      };
    });

    // Play the entire playlist starting from the clicked song
    await playPlaylist(songIds, songIndex, songMetas);

    // Navigate to MusicPlayer screen
    navigation.navigate('MusicPlayer', {
      songId,
      songInfo: {
        title,
        artist,
        albumImagePath: albumImagePath || '',
      }
    });
  };

  const handlePlayButtonPress = async () => {
    if (!playlistDetail?.songs || playlistDetail.songs.length === 0) return;

    // Prepare song IDs and metadata for the entire playlist
    const songIds = playlistDetail.songs.map(song => song.songId);
    const songMetas = playlistDetail.songs.map(song => {
      const artwork = getImageUrl(song.albumImagePath);
      return {
        title: song.title,
        artist: song.artist,
        artwork: typeof artwork === 'object' && 'uri' in artwork ? artwork.uri : undefined,
      };
    });

    // Play the entire playlist starting from the first song
    await playPlaylist(songIds, 0, songMetas);
  };

  const handleLikePress = () => {
    likeMutation.mutate();
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !playlistDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>플레이리스트를 불러올 수 없습니다</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const firstSongImage = playlistDetail.songs && playlistDetail.songs.length > 0
    ? getImageUrl(playlistDetail.songs[0].albumImagePath)
    : require('../../../assets/images/profileImage.png');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="left" width={10} height={18} fill={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>
        <View style={styles.headerLocation}>
          <Icon name="playlist" width={16} height={16} fill={SECONDARY_COLORS.DEFAULT} />
          <Text style={styles.headerLocationText}>플레이리스트</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Large Circular Playlist Cover */}
        <View style={styles.playlistCoverSection}>
          <View style={styles.playlistCoverCard}>
            <View style={styles.circularCoverContainer}>
              <Image
                source={firstSongImage}
                style={styles.circularCover}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Playlist Info */}
        <View style={styles.playlistInfoSection}>
          <View style={styles.playlistTitleRow}>
            <Text style={styles.playlistTitle}>{playlistDetail.playlistName}</Text>
          </View>
          <View style={styles.playlistCreatorRow}>
            <View style={styles.creatorDot} />
            <Text style={styles.creatorName}>User_1</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.likeButton} onPress={handleLikePress} disabled={likeMutation.isPending}>
            <Icon name="heart" width={16} height={16} fill={SECONDARY_COLORS.DEFAULT} />
            <Text style={styles.likeCount}>{likeCountData?.likeCount || 0}</Text>
          </TouchableOpacity>

          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.shuffleButton}>
              <Icon name="shuffle" width={16} height={16} fill={TEXT_COLORS.TEXT2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayButtonPress}>
              <Icon name="play" width={12} height={12} fill={TEXT_COLORS.TEXT2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Songs List with Special Design */}
        <View style={styles.songsSection}>
          {playlistDetail.songs?.map((song: PlaylistDetailSong, index: number) => {
            const isCurrentlyPlaying = currentTrackId === song.songId;

            return (
              <TouchableOpacity
                key={song.songId}
                style={styles.specialSongItem}
                onPress={() => handleSongPress(song.songId, song.title, song.artist, song.albumImagePath)}
                activeOpacity={0.8}
              >
                {/* Orange gradient background for currently playing song */}
                {isCurrentlyPlaying && (
                  <View style={styles.songGradientBackground} />
                )}

                {/* Orange line on left */}
                <View style={styles.orangeLine} />

                {/* Song image with special effect */}
                <View style={styles.songImageContainer}>
                  {isCurrentlyPlaying && <View style={styles.songImageGlow} />}
                  <Image
                    source={getImageUrl(song.albumImagePath)}
                    style={styles.songImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Song info with gradient text */}
                <View style={styles.songInfo}>
                  <Text style={[styles.songTitle, isCurrentlyPlaying && styles.gradientTitle]} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={[styles.songArtist, isCurrentlyPlaying && styles.gradientArtist]} numberOfLines={1}>
                    by {song.artist}
                  </Text>
                </View>

                {/* More options button or playing indicator */}
                <TouchableOpacity style={styles.moreButton}>
                  {isCurrentlyPlaying ? (
                    <TouchableOpacity onPress={togglePlayPause}>
                      <Icon
                        name={isPlaying ? "pause" : "play"}
                        width={16}
                        height={16}
                        fill={SECONDARY_COLORS.DEFAULT}
                      />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <View style={styles.moreDot} />
                      <View style={styles.moreDot} />
                      <View style={styles.moreDot} />
                    </>
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  headerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FORM_COLORS.BACKGROUND_3,
    paddingHorizontal: scale(16),
    paddingVertical: scale(4),
    borderRadius: scale(16),
    gap: scale(8),
  },
  headerLocationText: {
    ...TYPOGRAPHY.BODY_2,
    color: SECONDARY_COLORS.DEFAULT,
    fontSize: scale(16),
    lineHeight: scale(22),
  },
  placeholder: {
    width: scale(24),
    height: scale(24),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  errorText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
    textAlign: 'center',
    marginBottom: scale(20),
  },
  retryButton: {
    backgroundColor: SECONDARY_COLORS.DEFAULT,
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(8),
  },
  retryButtonText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  // Large circular playlist cover
  playlistCoverSection: {
    alignItems: 'center',
    marginBottom: scale(24),
    height: scale(180),
  },
  playlistCoverCard: {
    width: scale(343),
    height: scale(180),
    backgroundColor: FORM_COLORS.BACKGROUND_3,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  circularCoverContainer: {
    width: scale(300),
    height: scale(300),
    borderRadius: scale(150),
    overflow: 'hidden',
    shadowColor: '#F23F6F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  circularCover: {
    width: '100%',
    height: '100%',
  },
  // Playlist info section
  playlistInfoSection: {
    paddingHorizontal: scale(12),
    marginBottom: scale(12),
  },
  playlistTitleRow: {
    marginBottom: scale(4),
  },
  playlistTitle: {
    ...TYPOGRAPHY.HEADLINE_1,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(16),
    lineHeight: scale(22),
    fontWeight: 'bold',
  },
  playlistCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  creatorDot: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: PRIMARY_COLORS.DEFAULT,
  },
  creatorName: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(12),
    lineHeight: scale(16),
    fontWeight: '500',
  },
  // Action buttons
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    marginBottom: scale(12),
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  likeCount: {
    ...TYPOGRAPHY.BODY_2,
    color: SECONDARY_COLORS.DEFAULT,
    fontSize: scale(12),
    lineHeight: scale(16.5),
    fontWeight: 'bold',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  shuffleButton: {
    width: scale(24),
    height: scale(24),
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
  // Songs section with special design
  songsSection: {
    paddingHorizontal: scale(12),
    marginBottom: scale(40),
  },
  specialSongItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(80),
    marginBottom: scale(12),
    position: 'relative',
    overflow: 'hidden',
  },
  songGradientBackground: {
    position: 'absolute',
    left: scale(15),
    top: 0,
    width: scale(304),
    height: '100%',
    backgroundColor: `${SECONDARY_COLORS.DEFAULT}20`,
    zIndex: 1,
  },
  orangeLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: scale(1),
    height: '100%',
    backgroundColor: SECONDARY_COLORS.DEFAULT,
    zIndex: 3,
  },
  songImageContainer: {
    position: 'relative',
    width: scale(80),
    height: scale(80),
    marginLeft: scale(8),
    marginRight: scale(16),
    zIndex: 2,
  },
  songImageGlow: {
    position: 'absolute',
    left: scale(50),
    top: scale(10),
    width: scale(60),
    height: scale(60),
    backgroundColor: 'rgba(239, 146, 16, 0.2)',
    borderRadius: scale(30),
    zIndex: 1,
  },
  songImage: {
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
  songInfo: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  songTitle: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(16),
    lineHeight: scale(22),
    fontWeight: '500',
    marginBottom: scale(2),
  },
  songArtist: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(12),
    lineHeight: scale(16),
    fontWeight: '500',
  },
  gradientTitle: {
    color: SECONDARY_COLORS.DEFAULT,
  },
  gradientArtist: {
    color: TEXT_COLORS.TEXT2,
  },
  moreButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  moreDot: {
    width: scale(3),
    height: scale(3),
    backgroundColor: SECONDARY_COLORS.DEFAULT,
    borderRadius: scale(1.5),
    marginBottom: scale(2),
  },
});

export default PlaylistDetailScreen;