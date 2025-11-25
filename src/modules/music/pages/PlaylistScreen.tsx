import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { styles } from '../styles/PlaylistScreen';
import Icon from '../../../components/icon/Icon';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../constants/colors';
import { usePlaylist } from '../hooks/usePlaylist';
import { usePlayerStore } from '../../../stores/playerStore';
import type { Song } from '../types/playlist';
import Config from 'react-native-config';

type Props = NativeStackScreenProps<RootStackParamList, 'Playlist'>;

const PlaylistItem = memo(({ song, onPress }: { song: Song; onPress: () => void }) => {
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const baseUrl = Config.MUSIC_API_BASE_URL;
    return `${baseUrl}${imagePath}`;
  };

  return (
    <TouchableOpacity style={styles.songItem} onPress={onPress}>
      <View style={styles.songLeftSection}>
        <View style={styles.songIndicatorLine} />
        <View style={styles.songCoverContainer}>
          <Image
            source={{ uri: getImageUrl(song.albumImagePath) }}
            style={styles.songCover}
            resizeMode="cover"
          />
          <View style={styles.songCoverOverlay} />
        </View>
      </View>

      <View style={styles.songInfo}>
        <View style={styles.songTextContainer}>
          <Text
            style={styles.songTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {song.title}
          </Text>
          <Text
            style={styles.songArtist}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            by {song.artist}
          </Text>
        </View>
      </View>

      <View style={styles.songMenu}>
        <View style={{ transform: [{ rotate: '270deg' }] }}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButton}>
              <Icon name="setting" width={3} height={13.5} color={TEXT_COLORS.CAPTION_1} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

function PlaylistScreen({ route, navigation }: Props) {
  const { playlistId } = route.params;
  const { data: playlist, isLoading, isError, refetch } = usePlaylist(playlistId);
  const playerStore = usePlayerStore();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePlaySong = async (song: Song) => {
    try {
      const imageUrl = song.albumImagePath.startsWith('http')
        ? song.albumImagePath
        : `${Config.MUSIC_API_BASE_URL}${song.albumImagePath}`;

      await playerStore.playIfDifferent(song.id, {
        title: song.title,
        artist: song.artist,
        artwork: imageUrl,
      });
    } catch (error) {
      console.error('Failed to play song:', error);
      Alert.alert('$X', 'LE ��� �(����.');
    }
  };

  const handlePlayAll = async () => {
    if (!playlist?.songs.length) return;

    try {
      // Play first song
      await handlePlaySong(playlist.songs[0]);

      // Set queue with all songs
      playerStore.setQueue(playlist.songs.map(song => song.id));
    } catch (error) {
      console.error('Failed to play playlist:', error);
      Alert.alert('$X', '플레이리스트 재생에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLORS.DEFAULT} />
          <Text style={styles.loadingText}>플레이리스트 로딩 중...</Text>
        </View>
      </SafeAreaView>
    ); 
  }

  if (isError || !playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            플레이리스트 로딩에 실패했습니다.{'\n'}
            다시 시도해주세요.
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
    // Default placeholder image
    return 'https://via.placeholder.com/300x300/1D1D26/E9E2E3?text=Playlist';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION_1} />
          </TouchableOpacity>

          <View style={styles.locationIndicator}>
            <Icon name="music" width={22.477} height={16.52} color={TEXT_COLORS.CAPTION_1} />
            <Text style={styles.locationText}>플레이리스트</Text>
          </View>

          <View style={{ width: 24 }} />
        </View>

        <View style={styles.playlistCoverContainer}>
          <View style={styles.playlistCoverBackground}>
          </View>
          <View style={styles.playlistCover}>
            <Image
              source={{ uri: getPlaylistCoverImage() }}
              style={styles.playlistCoverImage}
              resizeMode="cover"
            />
            <View style={styles.playlistCoverOverlay} />
          </View>
        </View>

        <View style={styles.playlistInfo}>
          <View style={styles.playlistHeader}>
            <View style={styles.playlistHeaderRow}>
              <Text style={styles.playlistTitle}>{playlist.name}</Text>
              <View style={styles.playlistActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="edit" width={12} height={12} color={TEXT_COLORS.DEFAULT} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="edit" width={12.75} height={12.75} color={TEXT_COLORS.DEFAULT} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton}>
                  <Icon name="heart" width={12} height={13.5} color={PRIMARY_COLORS.DEFAULT} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.userDot} />
              <Text style={styles.userName}>User_1</Text>
            </View>
          </View>

          <View style={styles.playControlsContainer}>
            <TouchableOpacity style={styles.playButtonContainer}>
              <View style={{ transform: [{ rotate: '180deg' }, { scaleY: -1 }] }}>
                <Icon name="play" width={13} height={15.6} color={TEXT_COLORS.DEFAULT} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mainPlayButton} onPress={handlePlayAll}>
              <Icon name="play" width={15} height={18} color={TEXT_COLORS.DEFAULT} />
              <Text style={styles.playButtonText}>PLAY</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButtonContainer}>
              <Icon name="play" width={13} height={15.6} color={TEXT_COLORS.DEFAULT} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.songsContainer}>
          <FlatList
            data={playlist.songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PlaylistItem
                song={item}
                onPress={() => handlePlaySong(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PlaylistScreen;