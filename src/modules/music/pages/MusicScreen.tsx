import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/MusicScreen.ts';
import Icon from '../../../components/icon/Icon.tsx';
import { PRIMARY_COLORS, TEXT_COLORS } from '../../../constants/colors';
import CdPlayer from '../../../components/cdPlayer/CdPlayer';
import PlayBar from '../../../components/playBar/PlayBar.tsx';

import { useMusicComments } from '../hooks/useMusiceComments.ts';
import { useCreateMusicComment } from '../hooks/useCreateMusicComment.ts';
import type { Comment } from '../types/comment';

type Props = { route: { params: { droppingId: string } } };

function MusicScreen({ route }: Props) {
  const { droppingId } = route.params;

  const [comment, setComment] = useState('');

  const {
    data: comments,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMusicComments(droppingId);

  const createComment = useCreateMusicComment(droppingId);

  const handlePost = () => {
    const text = comment.trim();
    if (!text) return;
    createComment.mutate(text, {
      onSuccess: () => setComment(''),
    });
  };

  const commentCount = comments?.length ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />
        }
      >
        <View style={styles.innerContainer}>
          <CdPlayer />
          <View style={styles.content}>
            <View style={styles.infoRow}>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.title}>LILAC</Text>
                <Text style={styles.artist}>by IU</Text>
              </View>

              <View style={styles.likeCommentRow}>
                <TouchableOpacity style={styles.smallLikeCommentRow}>
                  <Icon name="like" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
                  <Text style={styles.likeCommentText}>21</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.smallLikeCommentRow}>
                  <Icon name="chat" width={16} height={16} color={TEXT_COLORS.DEFAULT} />
                  <Text style={styles.likeCommentText}>{commentCount}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <PlayBar
              currentTime={0}
              musicTime={192}
              onSeek={(value) => console.log('Seek to:', value)}
            />
          </View>

          <View style={styles.inner}>
            <View style={styles.userRow}>
              <View style={styles.userDot} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>User_1</Text>
                <View style={styles.userBadge}>
                  <Text style={styles.userBadgeText}>모험가</Text>
                </View>
              </View>
            </View>

            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                이 길을 지날때마다 이 노래가 생각 나더군요. 여러분도 노래 듣고 힘내시길
              </Text>
              <View style={styles.messageLocationRow}>
                <Icon name="location" width={14} height={14} color={PRIMARY_COLORS.DEFAULT} />
                <Text style={styles.messageLocation}>부산광역시 강서구 가락대로 1393</Text>
              </View>
            </View>
          </View>

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
              <TouchableOpacity onPress={() => { void refetch(); }} style={{ paddingVertical: 12 }}>
                <Text style={{ color: TEXT_COLORS.DEFAULT }}>불러오기에 실패했어요. 탭해서 재시도</Text>
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
                    <Text style={[styles.userName]}>익명</Text>
                  </View>
                  <Text style={styles.commentItemText}>{item.content}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MusicScreen;