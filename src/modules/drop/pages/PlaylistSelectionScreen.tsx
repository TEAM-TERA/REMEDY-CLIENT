import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Icon from '../../../components/icon/Icon';
import { BACKGROUND_COLORS, TEXT_COLORS, FORM_COLORS, SECONDARY_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { useMyPlaylists } from '../../profile/hooks/useMyPlaylists';
import type { Playlist } from '../../profile/types/Playlist';
import Config from 'react-native-config';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaylistSelection'>;

function PlaylistSelectionScreen({ navigation, route }: Props) {
  const { latitude, longitude, address } = route.params;
  const { data: playlistsResponse } = useMyPlaylists();
  const playlists = playlistsResponse?.playlists || [];

  const getImageUrl = (albumImageUrl?: string) => {
    if (!albumImageUrl) {
      return require('../../../assets/images/profileImage.png');
    }
    if (albumImageUrl.startsWith('http')) {
      return { uri: albumImageUrl };
    }
    const baseUrl = Config.MUSIC_API_BASE_URL || 'http://localhost:3000';
    return { uri: `${baseUrl}${albumImageUrl}` };
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    navigation.navigate('PlaylistDropModal', {
      playlist,
      latitude,
      longitude,
      address,
    });
  };

  const renderPlaylistItem = ({ item, index }: { item: Playlist; index: number }) => (
    <TouchableOpacity
      style={[styles.playlistItem, index % 2 === 1 ? styles.playlistItemRight : null]}
      onPress={() => handlePlaylistSelect(item)}
      activeOpacity={0.8}
    >
      <View style={styles.playlistContainer}>
        <View style={styles.playlistHeaderBar} />
        <View style={styles.playlistImageContainer}>
          <Image
            source={getImageUrl(item.albumImageUrl)}
            style={styles.playlistThumbnail}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={styles.playlistBottomInfo}>
        <Text style={styles.playlistTitle} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyPlaylist = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>플레이리스트가 없습니다</Text>
      <Text style={styles.emptySubText}>먼저 플레이리스트를 생성해주세요</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="left" width={10} height={18} fill={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>

        <View style={styles.locationIndicator}>
          <Icon name="location" width={16} height={16} fill={TEXT_COLORS.CAPTION} />
          <Text style={styles.locationText}>내 플레이리스트</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {playlists.length > 0 ? (
          <FlatList
            data={playlists}
            renderItem={renderPlaylistItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          renderEmptyPlaylist()
        )}
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
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FORM_COLORS.BACKGROUND_3,
    paddingHorizontal: scale(16),
    paddingVertical: scale(4),
    borderRadius: scale(16),
    gap: scale(8),
  },
  locationText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
    lineHeight: scale(22),
  },
  placeholder: {
    width: scale(24),
    height: scale(24),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
  },
  listContainer: {
    paddingVertical: scale(12),
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
  },
  separator: {
    height: scale(24),
  },
  playlistItem: {
    width: '45%',
    marginBottom: scale(12),
  },
  playlistItemRight: {
    marginLeft: scale(20),
  },
  playlistContainer: {
    backgroundColor: FORM_COLORS.BACKGROUND_2,
    borderRadius: scale(8),
    overflow: 'hidden',
    marginBottom: scale(12),
  },
  playlistHeaderBar: {
    height: scale(8),
    backgroundColor: FORM_COLORS.BACKGROUND_2,
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    borderBottomWidth: 0,
  },
  playlistImageContainer: {
    height: scale(72),
    overflow: 'hidden',
    borderRadius: scale(8),
    position: 'relative',
  },
  playlistThumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  playlistBottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(4),
  },
  playlistTitle: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(16),
    lineHeight: scale(22),
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(80),
  },
  emptyText: {
    ...TYPOGRAPHY.HEADLINE_2,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(18),
    lineHeight: scale(24),
    marginBottom: scale(8),
  },
  emptySubText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(14),
    lineHeight: scale(20),
  },
});

export default PlaylistSelectionScreen;