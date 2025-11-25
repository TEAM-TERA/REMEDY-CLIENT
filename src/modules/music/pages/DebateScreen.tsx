import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from '../../../components/icon/Icon';
import { BACKGROUND_COLORS, TEXT_COLORS, TERTIARY_COLORS, UI_COLORS, FORM_COLORS, PRIMARY_COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { getDroppingById, voteOnDropping, deleteVoteOnDropping, addComment, getComments } from '../../drop/api/dropApi';
import { RootStackParamList } from '../../../types/navigation';
import { usePlayerStore } from '../../../stores/playerStore';
import { getErrorMessage } from '../../../utils/errorHandler';

type DebateOption = {
  id: string;
  title: string;
  artist: string;
  imageUrl?: string;
  votes: number;
};

type Comment = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
};

export default function DebateScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'DebateScreen'>>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [options, setOptions] = useState<DebateOption[]>([]);
  const [topic, setTopic] = useState<string>('토론');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const droppingId = route.params?.droppingId;
  const { playIfDifferent, setCurrentId } = usePlayerStore();

  const totalVotes = useMemo(() => options.reduce((sum, o) => sum + o.votes, 0), [options]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const fetchComments = useCallback(async () => {
    if (!droppingId) return;
    try {
      const commentsData = await getComments(droppingId);
      setComments(commentsData || []);
    } catch (error) {
      console.error('댓글 로드 실패:', error);
      // 댓글 로드 실패는 전체 UI를 막지 않음
    }
  }, [droppingId]);

  useEffect(() => {
    let mounted = true;
    async function fetchDropping() {
      if (!droppingId) {
        setError('드랍핑 정보를 찾을 수 없습니다.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDroppingById(droppingId);
        if (!mounted) return;

        setTopic(data.topic || '토론');
        setContent(data.content || '');
        setSelectedId(data.userVotedOption ? String(data.userVotedOption) : null);
        setOptions(
          (data.options || []).map((opt: any, idx: number) => ({
            id: String(opt.songId ?? idx),
            title: opt.title ?? '제목 없음',
            artist: opt.artist ?? '아티스트 정보 없음',
            imageUrl: opt.albumImagePath,
            votes: Number(opt.voteCount) || 0,
          }))
        );

        // 댓글도 함께 로드
        await fetchComments();
      } catch (e) {
        console.error('DebateScreen 데이터 로드 실패:', e);
        if (mounted) {
          setError('토론 데이터를 불러오지 못했습니다.');
        }
      } finally {
        mounted && setIsLoading(false);
      }
    }

    fetchDropping();
    return () => {
      mounted = false;
    };
  }, [droppingId, fetchComments]);

  const handleSelect = useCallback(async (id: string) => {
    if (selectedId === id || !droppingId) return;

    const selectedOption = options.find(opt => opt.id === id);
    if (!selectedOption) return;

    try {
      // 이미 투표한 경우 투표 삭제
      if (selectedId) {
        console.log('기존 투표 삭제:', { droppingId });
        await deleteVoteOnDropping(droppingId);

        // 기존 투표에서 1 감소
        setOptions(prev =>
          prev.map(opt =>
            opt.id === selectedId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt
          )
        );
      }

      // 새로운 투표
      console.log('투표 시도:', { droppingId, songId: selectedOption.id });
      await voteOnDropping(droppingId, selectedOption.id);

      setSelectedId(id);
      setOptions(prev =>
        prev.map(opt =>
          opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
        )
      );

      console.log('투표 성공');
    } catch (error) {
      console.error('투표 실패:', error);
      Alert.alert('오류', getErrorMessage(error));
    }
  }, [selectedId, droppingId, options]);

  const handlePlay = useCallback((option: DebateOption) => {
    if (!option.id) return;

    playIfDifferent(option.id, {
      title: option.title,
      artist: option.artist,
      artwork: option.imageUrl,
    });
    setCurrentId(option.id);
  }, [playIfDifferent, setCurrentId]);

  const handleSubmitComment = useCallback(async () => {
    if (!commentText.trim() || !droppingId) return;

    try {
      console.log('댓글 추가 시도:', { droppingId, content: commentText.trim() });
      await addComment(droppingId, commentText.trim());
      setCommentText('');

      // 댓글 목록 새로고침
      await fetchComments();
      console.log('댓글 추가 성공');
    } catch (error) {
      console.error('댓글 추가 실패:', error);
      Alert.alert('오류', getErrorMessage(error));
    }
  }, [commentText, droppingId, fetchComments]);

  const renderMusicOption = (option: DebateOption, index: number) => {
    const isSelected = selectedId === option.id;
    const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

    return (
      <View key={option.id} style={[styles.musicCard, isSelected && styles.musicCardSelected]}>
        <View style={styles.musicHeader}>
          <View style={styles.musicLabelRow}>
            <View style={styles.musicLabel}>
              <Icon name="music" width={16} height={19.2} color={TEXT_COLORS.CAPTION} />
              <Text style={styles.musicLabelText}>Music {index + 1}</Text>
            </View>
            {isSelected && (
              <View style={styles.checkIcon}>
                <Icon name="like" width={20} height={20} color={TERTIARY_COLORS.DEFAULT} />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.musicRow, isSelected && styles.musicRowSelected]}
            onPress={() => handleSelect(option.id)}
            activeOpacity={0.8}
          >
            <View style={styles.albumCover}>
              {option.imageUrl ? (
                <Image source={{ uri: option.imageUrl }} style={styles.albumImage} />
              ) : (
                <View style={styles.defaultAlbum} />
              )}
            </View>
            <View style={styles.musicTexts}>
              <Text style={styles.musicTitle}>{option.title}</Text>
              <Text style={styles.musicArtist}>{option.artist}</Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(option)}>
              <Icon name="play" width={10.667} height={12} color={TEXT_COLORS.BUTTON} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.voteCount}>{option.votes}</Text>
            <Icon name="user" width={14} height={16} color={TEXT_COLORS.CAPTION} />
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressBar, { width: `${percent}%` }]}
            />
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={TERTIARY_COLORS.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLORS.BACKGROUND} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="left" width={10} height={18} color={TEXT_COLORS.CAPTION} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Icon name="debate" width={18} height={18} color={TEXT_COLORS.CAPTION} />
          <Text style={styles.headerTitle}>투표</Text>
        </View>

        <TouchableOpacity style={styles.optionButton}>
          <Icon name="list" width={18} height={18} color={TERTIARY_COLORS.DEFAULT} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          {/* Topic Section */}
          <View style={styles.topicSection}>
            <Text style={styles.topicTitle}>{topic}</Text>
            <Text style={styles.topicDescription}>{content}</Text>
          </View>

          {/* Total Votes */}
          <View style={styles.totalVotesRow}>
            <View style={styles.totalVotesContainer}>
              <Icon name="user" width={14} height={16} color={TERTIARY_COLORS.DEFAULT} />
              <Text style={styles.totalVotesText}>{totalVotes}</Text>
            </View>
          </View>

          {/* Music Options */}
          <View style={styles.optionsContainer}>
            {options.map((option, index) => renderMusicOption(option, index))}
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <View style={styles.commentInput}>
              <TextInput
                style={styles.commentTextInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="토론하기"
                placeholderTextColor={TEXT_COLORS.CAPTION}
                multiline={false}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitComment}
              >
                <Text style={styles.submitButtonText}>게시</Text>
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            {comments.map((comment, index) => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: index % 2 === 0 ? '#EF9210' : TERTIARY_COLORS.DEFAULT }
                    ]}
                  />
                  <Text style={styles.userName}>{comment.userName}</Text>
                </View>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            ))}
          </View>
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
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
  },
  optionButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(24),
  },
  mainContent: {
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    gap: scale(36),
  },
  topicSection: {
    gap: scale(12),
  },
  topicTitle: {
    ...TYPOGRAPHY.HEADLINE_3,
    color: TERTIARY_COLORS.DEFAULT,
    fontSize: scale(20),
    lineHeight: scale(26),
  },
  topicDescription: {
    ...TYPOGRAPHY.CAPTION_1,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(14),
    lineHeight: scale(20),
  },
  totalVotesRow: {
    paddingHorizontal: scale(8),
  },
  totalVotesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  totalVotesText: {
    ...TYPOGRAPHY.BODY_2,
    color: TERTIARY_COLORS.DEFAULT,
    fontSize: scale(16),
  },
  optionsContainer: {
    gap: scale(36),
  },
  musicCard: {
    backgroundColor: UI_COLORS.BACKGROUND,
    borderRadius: scale(12),
    padding: scale(12),
    gap: scale(12),
  },
  musicCardSelected: {
    backgroundColor: FORM_COLORS.INPUT_2,
    borderWidth: 1,
    borderColor: TERTIARY_COLORS.DEFAULT,
  },
  musicHeader: {
    gap: scale(8),
  },
  musicLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  musicLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  musicLabelText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
  },
  checkIcon: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    gap: scale(8),
  },
  musicRowSelected: {
    backgroundColor: FORM_COLORS.INPUT_2,
    borderColor: TERTIARY_COLORS.DEFAULT,
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
    lineHeight: scale(24),
  },
  musicArtist: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(12),
    lineHeight: scale(16),
  },
  playButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: TERTIARY_COLORS.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    gap: scale(12),
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  voteCount: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.CAPTION,
    fontSize: scale(16),
  },
  progressTrack: {
    width: '100%',
    height: scale(4),
    backgroundColor: FORM_COLORS.BACKGROUND_2,
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: TERTIARY_COLORS.DEFAULT,
    borderRadius: scale(4),
  },
  commentsSection: {
    gap: scale(12),
  },
  commentInput: {
    flexDirection: 'row',
    gap: scale(12),
  },
  commentTextInput: {
    flex: 1,
    height: scale(46),
    backgroundColor: FORM_COLORS.INPUT_1,
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    paddingHorizontal: scale(12),
    ...TYPOGRAPHY.INPUT_TEXT,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
  },
  submitButton: {
    height: scale(46),
    backgroundColor: TERTIARY_COLORS.DEFAULT,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: scale(80),
  },
  submitButtonText: {
    ...TYPOGRAPHY.BUTTON_TEXT,
    color: TEXT_COLORS.BUTTON,
    fontSize: scale(16),
  },
  commentCard: {
    backgroundColor: UI_COLORS.BACKGROUND,
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    padding: scale(24),
    gap: scale(4),
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingVertical: scale(4),
  },
  avatar: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
  },
  userName: {
    ...TYPOGRAPHY.CAPTION_3,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(12),
    lineHeight: scale(16),
  },
  commentText: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
    lineHeight: scale(22),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.BODY_2,
    color: PRIMARY_COLORS.DEFAULT,
    fontSize: scale(14),
  },
});