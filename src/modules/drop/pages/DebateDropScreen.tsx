import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  BACKGROUND_COLORS,
  TEXT_COLORS,
  TERTIARY_COLORS,
  UI_COLORS,
  FORM_COLORS,
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import Icon from '../../../components/icon/Icon';
import Button from '../../../components/button/Button';
import useLocation from '../../../hooks/useLocation';
import { GOOGLE_MAPS_API_KEY } from '../../../constants/map';
import { RootStackParamList } from '../../../types/navigation';
import { createVoteDropping } from '../api/dropApi';

interface SelectedMusic {
  id: string;
  title: string;
  artist: string;
  imageUrl?: string;
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'DebateDrop'>;
type RouteProps = RouteProp<RootStackParamList, 'DebateDrop'>;

export default function DebateDropScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();

  const [musics, setMusics] = useState<Array<SelectedMusic | null>>([null, null]);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { location } = useLocation();
  const [currentAddress, setCurrentAddress] = useState('대한민국');
  const [addressLoading, setAddressLoading] = useState(false);

  const defaultLocation = useMemo(() => ({ latitude: 37.5665, longitude: 126.978 }), []);

  const finalLocation = useMemo(() => location || defaultLocation, [location, defaultLocation]);

  const finalAddress = useMemo(() => {
    if (
      addressLoading ||
      !currentAddress ||
      currentAddress.trim() === '' ||
      currentAddress.includes('가져오는 중') ||
      currentAddress.includes('로딩') ||
      currentAddress.includes('...')
    ) {
      return '대한민국';
    }
    return currentAddress;
  }, [addressLoading, currentAddress]);

  const locationTags = useMemo(
    () => finalAddress.split(' ').filter(Boolean).slice(0, 4),
    [finalAddress]
  );

  useEffect(() => {
    if (route.params?.selectedSong && route.params.slotIndex !== undefined) {
      setMusics(prev => {
        const next = [...prev];
        const idx = route.params?.slotIndex ?? 0;
        while (next.length <= idx) {
          next.push(null);
        }
        next[idx] = route.params?.selectedSong || null;
        return next;
      });
    }
  }, [route.params]);

  const fetchAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
    setAddressLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${GOOGLE_MAPS_API_KEY}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        setCurrentAddress(data.results[0].formatted_address);
      } else {
        setCurrentAddress('대한민국');
      }
    } catch (error) {
      console.log('주소 변환 실패, 기본값 사용:', error);
      setCurrentAddress('대한민국');
    } finally {
      setAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchAddressFromCoordinates(location.latitude, location.longitude);
    }
  }, [fetchAddressFromCoordinates, location]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMusicChange = useCallback(
    (index: number) => {
      navigation.navigate('DebateMusicSearch', { slotIndex: index, parentKey: route.key });
    },
    [navigation, route.key]
  );

  const handleAddMusic = useCallback(() => {
    setMusics(prev => [...prev, null]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!topic.trim()) {
      Alert.alert('알림', '주제를 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('알림', '토론 내용을 입력해주세요.');
      return;
    }

    const filledMusics = musics.filter((m): m is SelectedMusic => !!m);
    if (filledMusics.length < 2) {
      Alert.alert('알림', '최소 2개의 음악을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createVoteDropping({
        topic: topic.trim(),
        content: content.trim(),
        options: filledMusics.map(music => music.id),
        latitude: finalLocation.latitude,
        longitude: finalLocation.longitude,
        address: finalAddress,
      });
      Alert.alert('성공', '투표 드랍이 성공적으로 생성되었습니다!', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('투표 드랍 생성 실패:', error);
      Alert.alert('오류', '투표 드랍 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [content, finalAddress, finalLocation.latitude, finalLocation.longitude, isSubmitting, musics, navigation, topic]);

  const renderMusicItem = useCallback(
    (index: number, music: SelectedMusic | null) => (
      <View key={index} style={styles.musicSection}>
        <View style={styles.musicHeader}>
          <Icon name="music" width={16} height={19} color={TEXT_COLORS.CAPTION} />
          <Text style={styles.musicLabel}>{`Music ${index + 1}`}</Text>
        </View>

        <View style={styles.musicItemContainer}>
          <View style={styles.musicInfo}>
            <View style={styles.albumCover}>
              {music?.imageUrl ? (
                <Image source={{ uri: music.imageUrl }} style={styles.albumImage} />
              ) : (
                <View style={styles.defaultAlbum} />
              )}
            </View>

            <View style={styles.musicTexts}>
              <Text style={styles.musicTitle}>{music?.title || '음악을 선택하세요'}</Text>
              <Text style={styles.musicArtist}>{music?.artist || ''}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.changeButton} onPress={() => handleMusicChange(index)}>
            <Icon name="edit" width={18} height={18} color={TEXT_COLORS.DEFAULT} />
            <Text style={styles.changeButtonText}>변경</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleMusicChange]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Icon name="target" width={18} height={18} color={TEXT_COLORS.CAPTION} />
          <Text style={styles.headerTitle}>투표 드랍</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <View style={styles.musicContainer}>
            {musics.map((music, idx) => renderMusicItem(idx, music))}

            <TouchableOpacity style={styles.addButton} onPress={handleAddMusic}>
              <Icon name="plus" width={16} height={16} color={TEXT_COLORS.CAPTION} />
            </TouchableOpacity>
          </View>

          <View style={[styles.section, styles.inputContainer]}>
            <TextInput
              style={styles.input}
              placeholder="주제"
              placeholderTextColor={TEXT_COLORS.CAPTION}
              value={topic}
              onChangeText={setTopic}
            />
          </View>

          <View style={[styles.section, styles.contentContainer]}>
            <TextInput
              style={styles.contentInput}
              placeholder="토론 내용"
              placeholderTextColor={TEXT_COLORS.CAPTION}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{content.length}/200</Text>
          </View>

          <View style={[styles.section, styles.locationContainer]}>
            <Icon name="location" width={16} height={18} color={TERTIARY_COLORS.DEFAULT} />
            <View style={styles.locationTags}>
              {locationTags.map((tag, index) => (
                <View key={index} style={styles.locationTag}>
                  <Text style={styles.locationTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, styles.submitContainer]}>
            <Button
              title="드랍"
              onPress={handleSubmit}
              style={styles.submitButton}
              textStyle={styles.submitButtonText}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(20),
  },
  mainContainer: {
    backgroundColor: UI_COLORS.BACKGROUND,
    margin: scale(16),
    borderRadius: scale(20),
    padding: scale(12),
    gap: scale(24),
  },
  section: {
    paddingHorizontal: scale(12),
  },
  musicContainer: {
    gap: scale(20),
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
  },
  musicSection: {
    gap: scale(8),
  },
  musicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  musicLabel: {
    ...TYPOGRAPHY.BODY_1,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
  },
  musicItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(8),
  },
  albumCover: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(8),
    backgroundColor: TEXT_COLORS.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  albumImage: {
    width: scale(50),
    height: scale(50),
  },
  defaultAlbum: {
    width: scale(25),
    height: scale(25),
    backgroundColor: FORM_COLORS.STROKE,
    borderRadius: scale(4),
  },
  musicTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  musicTitle: {
    ...TYPOGRAPHY.SUBTITLE,
    color: TERTIARY_COLORS.DEFAULT,
    fontSize: scale(18),
  },
  musicArtist: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(12),
  },
  changeButton: {
    backgroundColor: TERTIARY_COLORS.DEFAULT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    gap: scale(6),
    height: scale(32),
  },
  changeButtonText: {
    ...TYPOGRAPHY.BUTTON_TEXT,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
  },
  addButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: FORM_COLORS.INPUT_1,
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: FORM_COLORS.INPUT_1,
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    borderRadius: scale(8),
    padding: scale(12),
    height: scale(46),
    ...TYPOGRAPHY.INPUT_TEXT,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
  },
  contentContainer: {
    position: 'relative',
  },
  contentInput: {
    backgroundColor: FORM_COLORS.INPUT_1,
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    borderRadius: scale(8),
    padding: scale(12),
    height: scale(138),
    ...TYPOGRAPHY.INPUT_TEXT,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
  },
  characterCount: {
    position: 'absolute',
    bottom: scale(12),
    right: scale(12),
    ...TYPOGRAPHY.CAPTION_2,
    color: TEXT_COLORS.CAPTION_2,
    fontSize: scale(14),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(4),
  },
  locationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(4),
  },
  locationTag: {
    backgroundColor: FORM_COLORS.BACKGROUND_1,
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(24),
  },
  locationTagText: {
    ...TYPOGRAPHY.CAPTION_2,
    color: '#8140f2',
    fontSize: scale(14),
  },
  submitContainer: {
    paddingVertical: scale(12),
  },
  submitButton: {
    backgroundColor: TERTIARY_COLORS.DEFAULT,
    height: scale(46),
    borderRadius: scale(8),
  },
  submitButtonText: {
    ...TYPOGRAPHY.BUTTON_TEXT,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
  },
});
