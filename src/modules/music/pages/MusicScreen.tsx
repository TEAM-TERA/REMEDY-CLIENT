import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '../styles/MusicScreen';
import Icon from '../../../components/icon/Icon';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../constants/colors';
import CdPlayer from '../../../components/cdPlayer/CdPlayer';
import PlayBar from '../../../components/playBar/PlayBar';
import { useMusicComments } from '../hooks/useMusicComments';
import { useCreateMusicComment } from '../hooks/useCreateMusicComment';
import { useDropLikeCount } from '../hooks/useLike';
import { useToggleLike } from '../hooks/useLike';
import { useMyLikes } from '../../profile/hooks/useMyLike';
import { useHLSPlayer } from '../../../hooks/music/useHLSPlayer';
import { useBackgroundAudioPermission } from '../../../hooks/useBackgroundAudioPermission';
import { useQuery } from '@tanstack/react-query';
import { getSongInfo, getDroppingById } from '../../drop/api/dropApi';
import type { Comment } from '../types/comment';
import MarqueeText from '../../../components/marquee/MarqueeText';

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
  const { droppingId, songId, title, artist, message, location, likeCount } = route.params;
  
  const musicLikeCount = useDropLikeCount(droppingId);
  const toggleLike = useToggleLike(droppingId);
  const myLikes = useMyLikes();
  const isLiked = !!myLikes.data?.some((like) => like.droppingId === droppingId);
  const [comment, setComment] = useState('');
  const scrollViewRef = useRef<any>(null);
  const commentInputRef = useRef<TextInput>(null);
  const musicPlayer = useHLSPlayer(songId);
  
  
  
  const { requestBackgroundAudioPermission } = useBackgroundAudioPermission();

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

  const { data: comments, isLoading, isError, refetch, isFetching } =
    useMusicComments(droppingId);

  const createComment = useCreateMusicComment(droppingId);

  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  useEffect(() => {
    if (songId && !hasRequestedPermission) {
      setHasRequestedPermission(true);
      requestBackgroundAudioPermission();
    }
  }, [songId, hasRequestedPermission, requestBackgroundAudioPermission]);

  const handlePost = React.useCallback(() => {
    const text = comment.trim();
    if (!text) return;
    createComment.mutate(text, {
      onSuccess: () => setComment(''),
    });
  }, [comment, createComment]);

  const handleTogglePlay = React.useCallback(() => {
    musicPlayer.togglePlay();
  }, [musicPlayer]);

  const handleSeek = React.useCallback((time: number) => {
    musicPlayer.seekTo(time);
  }, [musicPlayer]);

  const commentCount = comments?.length ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 80 : 200}
        extraHeight={Platform.OS === 'ios' ? 250 : 350}
        showsVerticalScrollIndicator={true}
        bounces={true}
        enableResetScrollToCoords={false}
      >
        <View style={styles.innerContainer}>
          <CdPlayer imageUrl={songInfo?.albumImagePath} isPlaying={musicPlayer.isPlaying} />

          <View style={styles.content}>
            <View style={styles.infoRow}>
              <View style={styles.infoTextWrapper}>
                <MarqueeText
                  text={songInfo?.title || title || '드랍핑 음악'}
                  textStyle={styles.title}
                  thresholdChars={18}
                  spacing={100}
                  speed={0.35}
                />
                <Text style={styles.artist}>
                  by {songInfo?.artist || artist || '알 수 없는 아티스트'}
                </Text>
              </View>

              <View style={styles.likeCommentRow}>
                <TouchableOpacity 
                  style={styles.smallLikeCommentRow}
                  onPress={() => toggleLike.mutate()}
                  disabled={toggleLike.isPending}
                >
                  {isLiked ? (
                    <Icon name="heart" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
                  ) : (
                    <Icon name="like" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
                  )}
                  <Text style={styles.likeCommentText}>{musicLikeCount.data?.likeCount ?? 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.smallLikeCommentRow}>
                  <Icon name="chat" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
                  <Text style={styles.likeCommentText}>{commentCount}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {musicPlayer.error && (
              <View style={{ padding: 12, backgroundColor: '#FFE5E5', borderRadius: 8, marginBottom: 8 }}>
                <Text style={{ color: '#D32F2F', fontSize: 12 }}>
                  {musicPlayer.error}
                </Text>
              </View>
            )}

            <PlayBar
              currentTime={musicPlayer.currentTime}
              musicTime={musicPlayer.duration || 0}
              onSeek={handleSeek}
              onTogglePlay={handleTogglePlay}
              isPlaying={musicPlayer.isPlaying}
            />
          </View>

          {((message || droppingInfo?.content) || location || droppingInfo?.username) && (
            <View style={styles.inner}>
              <View style={styles.messageBox}>
                {droppingInfo?.username && (
                  <View style={styles.commentItemInfo}>
                    <View style={[styles.userDot, { backgroundColor: '#7C4DFF' }]} />
                    <Text style={styles.userName}>{droppingInfo.username}</Text>
                  </View>
                )}
                {(message || droppingInfo?.content) ? (
                  <Text style={styles.messageText}>{message || droppingInfo?.content}</Text>
                ) : null}
                {location ? (
                  <View style={styles.messageLocationRow}>
                    <Icon name="location" width={14} height={14} color={PRIMARY_COLORS.DEFAULT} />
                    <Text style={styles.messageLocation}>{location}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}

          <View style={styles.commentSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={styles.commentTitle}>댓글</Text>
              <TouchableOpacity
                onPress={() => { void refetch(); }}
                disabled={isFetching}
                style={{ paddingHorizontal: 12, paddingVertical: 4 }}
              >
                <Text style={{ color: isFetching ? TEXT_COLORS.CAPTION_RED : PRIMARY_COLORS.DEFAULT, fontSize: 14 }}>
                  {isFetching ? '새로고침 중...' : '새로고침'}
                </Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8, color: TEXT_COLORS.CAPTION_RED }}>
                  댓글 불러오는 중…
                </Text>
              </View>
            ) : isError ? (
              <TouchableOpacity
                onPress={() => { void refetch(); }}
                style={{ paddingVertical: 12 }}
              >
                <Text style={{ color: TEXT_COLORS.DEFAULT }}>
                  불러오기에 실패했어요. 탭해서 재시도
                </Text>
              </TouchableOpacity>
            ) : null}

            <View style={styles.commentInputRow}>
              <TextInput
                ref={commentInputRef}
                style={styles.commentInput}
                placeholder="댓글 작성"
                placeholderTextColor={TEXT_COLORS.CAPTION_RED}
                value={comment}
                onChangeText={setComment}
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd?.({ animated: true });
                  }, 100);
                }}
              />
              <TouchableOpacity
                style={styles.commentButton}
                onPress={handlePost}
                disabled={createComment.isPending || comment.trim().length === 0}
              >
                <Text style={styles.commentButtonText}>
                  {createComment.isPending ? '등록중…' : '게시'}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList<Comment>
              data={comments || []}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <View style={styles.commentItemWrapper}>
                  <View style={styles.commentItemInfo}>
                    <View style={[styles.userDot, { backgroundColor: '#7C4DFF' }]} />
                    <Text style={styles.userName}>{item.username || '익명'}</Text>
                  </View>
                  <Text style={styles.commentItemText}>{item.content}</Text>
                </View>
              )}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default MusicScreen;
