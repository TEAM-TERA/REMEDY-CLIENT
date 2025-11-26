import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BACKGROUND_COLORS, TEXT_COLORS, UI_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/input/Input';
import { useSongSearch, SongSearchItem } from '../../drop/hooks/useSongSearch';
import Music from '../../drop/components/Music/Music';
import { RootStackParamList } from '../../../types/navigation';
import { useAddSongToPlaylist } from '../hooks/usePlaylist';

type Props = NativeStackNavigationProp<RootStackParamList, 'PlaylistMusicSearch'>;
type RouteProps = RouteProp<RootStackParamList, 'PlaylistMusicSearch'>;

const MusicItem = React.memo(({
  item,
  onPress,
  disabled
}: {
  item: SongSearchItem;
  onPress: () => void;
  disabled?: boolean
}) => (
  <Music
    musicTitle={item.title}
    singer={item.artist}
    imgUrl={item.albumImagePath}
    onPress={onPress}
    disabled={disabled}
  />
), (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.item.title === nextProps.item.title &&
    prevProps.item.artist === nextProps.item.artist &&
    prevProps.item.albumImagePath === nextProps.item.albumImagePath
  );
});

export default function PlaylistMusicSearchScreen() {
  const navigation = useNavigation<Props>();
  const route = useRoute<RouteProps>();
  const { playlistId, playlistName } = route.params;

  const [searchingText, setSearchingText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { data: searchResults = [], isLoading, refetch } = useSongSearch(searchingText);
  const addSongMutation = useAddSongToPlaylist();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearch = useCallback((text: string) => {
    setSearchingText(text);
    if (text.trim()) {
      refetch();
      // Add to search history if not already present
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item !== text.trim());
        return [text.trim(), ...filtered].slice(0, 5); // Keep only 5 recent searches
      });
    }
  }, [refetch]);

  const handleMusicSelect = useCallback(async (music: SongSearchItem) => {
    try {
      await addSongMutation.mutateAsync({
        playlistId,
        songId: music.id,
      });

      Alert.alert(
        '성공',
        `"${music.title}"이(가) 플레이리스트에 추가되었습니다.`,
        [
          {
            text: '계속 추가',
            style: 'cancel',
          },
          {
            text: '플레이리스트로 돌아가기',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      Alert.alert('오류', '음악 추가에 실패했습니다. 다시 시도해주세요.');
    }
  }, [playlistId, addSongMutation, navigation]);

  const renderMusicItem = useCallback(
    ({ item }: { item: SongSearchItem }) => (
      <MusicItem
        item={item}
        onPress={() => handleMusicSelect(item)}
        disabled={addSongMutation.isPending}
      />
    ),
    [handleMusicSelect, addSongMutation.isPending]
  );

  const renderSearchHistory = useCallback(() => {
    if (searchHistory.length === 0 || searchingText.trim()) return null;

    return (
      <View style={styles.searchHistoryContainer}>
        <Text style={styles.searchHistoryTitle}>최근 검색어</Text>
        {searchHistory.map((term, index) => (
          <TouchableOpacity
            key={index}
            style={styles.searchHistoryItem}
            onPress={() => handleSearch(term)}
          >
            <Icon name="clock" width={16} height={16} color={TEXT_COLORS.CAPTION} />
            <Text style={styles.searchHistoryText}>{term}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [searchHistory, searchingText, handleSearch]);

  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>검색 중...</Text>
        </View>
      );
    }

    if (!searchingText.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="music" width={48} height={48} color={TEXT_COLORS.CAPTION} />
          <Text style={styles.emptyText}>
            플레이리스트에 추가할{'\n'}음악을 검색해보세요
          </Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            "{searchingText}"에 대한{'\n'}검색 결과가 없습니다
          </Text>
        </View>
      );
    }

    return null;
  }, [isLoading, searchingText, searchResults.length]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION_1} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Icon name="music" width={22} height={17} color={TEXT_COLORS.CAPTION_1} />
          <Text style={styles.headerTitle}>{playlistName || '플레이리스트'}</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Input
          value={searchingText}
          onChangeText={handleSearch}
          placeholder="음악, 아티스트를 검색해보세요"
          style={styles.searchInput}
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {searchingText.trim() ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderMusicItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <>
            {renderSearchHistory()}
            {renderEmptyState()}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    height: scale(48),
  },
  backButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  titleContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: UI_COLORS.BACKGROUND,
    paddingHorizontal: scale(16),
    paddingVertical: scale(4),
    borderRadius: scale(16),
    gap: scale(8),
  },
  headerTitle: {
    ...TYPOGRAPHY.BODY_1,
    color: TEXT_COLORS.CAPTION_1,
    fontSize: scale(16),
  },
  headerRight: {
    width: scale(24),
    height: scale(24),
  },
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
  },
  searchInput: {
    marginBottom: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  listContainer: {
    paddingBottom: scale(20),
  },
  searchHistoryContainer: {
    marginBottom: scale(24),
  },
  searchHistoryTitle: {
    ...TYPOGRAPHY.BODY_1,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
    marginBottom: scale(12),
  },
  searchHistoryItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: scale(8),
    gap: scale(8),
  },
  searchHistoryText: {
    ...TYPOGRAPHY.BODY_1,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: scale(16),
  },
  emptyText: {
    ...TYPOGRAPHY.BODY_1,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
    textAlign: 'center' as const,
    lineHeight: scale(24),
  },
};