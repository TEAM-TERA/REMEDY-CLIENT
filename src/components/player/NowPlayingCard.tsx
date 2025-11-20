import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { scale, verticalScale } from '../../utils/scalers';
import { TEXT_COLORS, BACKGROUND_COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import Icon from '../icon/Icon';

interface NowPlayingCardProps {
  visible: boolean;
  droppingData?: {
    title?: string;
    artist?: string;
    albumImagePath?: string;
    content?: string;
    address?: string;
    likeCount?: number;
    commentCount?: number;
  };
  onClose: () => void;
}

const NowPlayingCard: React.FC<NowPlayingCardProps> = ({
  visible,
  droppingData,
  onClose
}) => {
  if (!visible || !droppingData) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* 왼쪽: 앨범 이미지 */}
        <View style={styles.albumContainer}>
          {droppingData.albumImagePath ? (
            <Image
              source={{ uri: droppingData.albumImagePath }}
              style={styles.albumImage}
            />
          ) : (
            <View style={styles.defaultAlbumImage}>
              <Icon name="music" width={20} height={20} color={TEXT_COLORS.CAPTION} />
            </View>
          )}
        </View>

        {/* 가운데: 곡 정보 */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {droppingData.title || '제목 없음'}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            by {droppingData.artist || '알 수 없는 아티스트'}
          </Text>
        </View>

        {/* 오른쪽: 통계 정보 */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="heart" width={14} height={14} color="#FF4444" />
            <Text style={styles.statText}>{droppingData.likeCount || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="chat" width={14} height={14} color={TEXT_COLORS.CAPTION} />
            <Text style={styles.statText}>{droppingData.commentCount || 0}</Text>
          </View>
        </View>

        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: verticalScale(120), // 헤더 아래 위치
    left: scale(20),
    right: scale(20),
    zIndex: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  albumContainer: {
    marginRight: scale(12),
  },
  albumImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(8),
  },
  defaultAlbumImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  songInfo: {
    flex: 1,
    marginRight: scale(12),
  },
  songTitle: {
    ...TYPOGRAPHY.HEADLINE_3,
    color: TEXT_COLORS.DEFAULT,
    fontWeight: 'bold',
    marginBottom: verticalScale(2),
  },
  artistName: {
    ...TYPOGRAPHY.BODY_3,
    color: TEXT_COLORS.CAPTION,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginRight: scale(8),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  statText: {
    ...TYPOGRAPHY.CAPTION,
    color: TEXT_COLORS.CAPTION,
  },
  closeButton: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: TEXT_COLORS.DEFAULT,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NowPlayingCard;