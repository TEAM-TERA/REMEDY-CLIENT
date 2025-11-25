import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BACKGROUND_COLORS, TEXT_COLORS, UI_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/input/Input';
import Music from '../components/Music/Music';
import { useSongSearch, SongSearchItem } from '../hooks/useSongSearch';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'DebateMusicSearch'>;
type RouteProps = RouteProp<RootStackParamList, 'DebateMusicSearch'>;

const MusicItem = React.memo(
  ({ item, onPress }: { item: SongSearchItem; onPress: () => void }) => (
    <Music
      musicTitle={item.title}
      singer={item.artist}
      imgUrl={item.albumImagePath}
      onPress={onPress}
    />
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.title === nextProps.item.title &&
      prevProps.item.artist === nextProps.item.artist &&
      prevProps.item.albumImagePath === nextProps.item.albumImagePath
    );
  }
);

export default function DebateMusicSearchScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const { slotIndex, parentKey } = route.params;

  const [searchingText, setSearchingText] = useState('');

  const { data: searchResult = [], isLoading, error } = useSongSearch(searchingText);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMusicSelect = useCallback(
    (item: SongSearchItem) => {
      const params = {
        selectedSong: {
          id: item.id,
          title: item.title,
          artist: item.artist,
          imageUrl: item.albumImagePath,
        },
        slotIndex,
      };

      if (parentKey) {
        navigation.dispatch({
          ...CommonActions.setParams(params),
          source: parentKey,
        });
        navigation.goBack();
        return;
      }

      navigation.navigate('DebateDrop', params);
    },
    [navigation, parentKey, slotIndex]
  );

  const renderItem = useCallback(
    ({ item }: { item: SongSearchItem }) => (
      <MusicItem item={item} onPress={() => handleMusicSelect(item)} />
    ),
    [handleMusicSelect]
  );

  const keyExtractor = useCallback((item: SongSearchItem) => item.id, []);

  const renderEmptyState = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>검색 중...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>검색 중 오류가 발생했습니다.</Text>
        </View>
      );
    }

    if (!searchingText.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="music" width={48} height={48} color={TEXT_COLORS.CAPTION} />
          <Text style={styles.emptyText}>음악을 검색해보세요</Text>
        </View>
      );
    }

    if (searchResult.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>"{searchingText}"에 대한 결과가 없습니다</Text>
        </View>
      );
    }

    return null;
  }, [error, isLoading, searchingText, searchResult.length]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Icon name="music" width={18} height={18} color={TEXT_COLORS.CAPTION} />
          <Text style={styles.headerTitle}>음악 선택</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchContainer}>
        <Input
          value={searchingText}
          onChangeText={setSearchingText}
          placeholder="음악, 아티스트를 검색해보세요"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={searchResult}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          contentContainerStyle={styles.listContent}
        />
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
    ...TYPOGRAPHY.BODY_1,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
  },
  headerRight: {
    width: scale(24),
    height: scale(24),
  },
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(12),
  },
  searchInput: {
    backgroundColor: UI_COLORS.BACKGROUND,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  listContent: {
    paddingBottom: scale(20),
    gap: scale(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
    paddingTop: scale(80),
  },
  emptyText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    textAlign: 'center',
  },
});
