import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/MusicScreen';
import Icon from '../../../components/icon/Icon';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../constants/colors';
import CdPlayer from '../../../components/cdPlayer/CdPlayer';
import PlayBar from '../../../components/playBar/PlayBar';
import { useMusicComments } from '../hooks/useMusicComments';
import { useCreateMusicComment } from '../hooks/useCreateMusicComment';
import { useDropLikeCount } from '../hooks/useLike';
import { useToggleLike } from '../hooks/useLike';
import { useHLSPlayer } from '../../../hooks/music/useHLSPlayer';
import { useBackgroundAudioPermission } from '../../../hooks/useBackgroundAudioPermission';
import { useQuery } from '@tanstack/react-query';
import { getSongInfo } from '../../drop/api/dropApi';
import type { Comment } from '../types/comment';

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
  const [comment, setComment] = useState('');

  const serverImageUrl = 'https://file.notion.so/f/f/f74ce79a-507a-45d0-8a14-248ea481b327/be9dcd92-96bb-4f75-b49b-80ff8b8758f5/image.png?table=block&id=2792845a-0c9f-80e5-9005-fa71e1c2f479&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&expirationTimestamp=1758844800000&signature=6xTJRZIFgl9yfwuj_TMjTuEBqz8wfkQM7QpcQ5Wk72w&downloadName=image.png';
  
  const musicPlayer = useHLSPlayer(songId);
  const { hasPermission, requestBackgroundAudioPermission } = useBackgroundAudioPermission();

  const { data: songInfo } = useQuery({
    queryKey: ['songInfo', songId],
    queryFn: () => getSongInfo(songId || ''),
    enabled: !!songId,
  });

  const { data: comments, isLoading, isError, refetch, isFetching } =
    useMusicComments(droppingId);

  const createComment = useCreateMusicComment(droppingId);

  useEffect(() => {
    if (songId) {
      musicPlayer.loadMusic(songId);
    }
  }, [songId]);

  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  useEffect(() => {
    if (songId && !hasRequestedPermission) {
      setHasRequestedPermission(true);
      requestBackgroundAudioPermission();
    }
  }, [songId, hasRequestedPermission, requestBackgroundAudioPermission]);

  useEffect(() => {
    if (musicPlayer?.error) {
      Alert.alert('음악 재생 오류', musicPlayer.error);
    }
  }, [musicPlayer?.error]);

  const handlePost = () => {
    const text = comment.trim();
    if (!text) return;
    createComment.mutate(text, {
      onSuccess: () => setComment(''),
    });
  };

  const handleTogglePlay = () => {
    musicPlayer.togglePlay();
  };

  const handleSeek = (time: number) => {
    musicPlayer.seekTo(time);
  };

  const commentCount = comments?.length ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => { void refetch(); }}
          />
        }
      >
        <View style={styles.innerContainer}>
          <CdPlayer imageUrl={songInfo?.imageUrl || serverImageUrl} />

          <View style={styles.content}>
            <View style={styles.infoRow}>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.title}>
                  {songInfo?.title || title || '드랍핑 음악'}
                </Text>
                <Text style={styles.artist}>
                  by {songInfo?.artist || artist || '알 수 없는 아티스트'}
                </Text>
              </View>

              <View style={styles.likeCommentRow}>
                {typeof likeCount === 'number' ? (
                  <TouchableOpacity 
                    style={styles.smallLikeCommentRow}
                    onPress={() => toggleLike.mutate()}
                    disabled={toggleLike.isPending}
                  >
                    <Icon name="like" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
                    <Text style={styles.likeCommentText}>{musicLikeCount.data?.likeCount}</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.smallLikeCommentRow}>
                  <Icon name="chat" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
                  <Text style={styles.likeCommentText}>{commentCount}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <PlayBar
              currentTime={musicPlayer.currentTime}
              musicTime={musicPlayer.duration || 0}
              onSeek={handleSeek}
              onTogglePlay={handleTogglePlay}
              isPlaying={musicPlayer.isPlaying}
            />
          </View>

          {(message || location) && (
            <View style={styles.inner}>
              <View style={styles.messageBox}>
                {message ? <Text style={styles.messageText}>{message}</Text> : null}
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
            <Text style={styles.commentTitle}>댓글</Text>

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
                style={styles.commentInput}
                placeholder="댓글 작성"
                placeholderTextColor={TEXT_COLORS.CAPTION_RED}
                value={comment}
                onChangeText={setComment}
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
                    <Text style={styles.userName}>익명</Text>
                  </View>
                  <Text style={styles.commentItemText}>{item.content}</Text>
                </View>
              )}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MusicScreen;
