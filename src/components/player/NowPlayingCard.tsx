import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { scale, verticalScale } from '../../utils/scalers';
import { TEXT_COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import Icon from '../icon/Icon';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// CD 모양 앨범 이미지 컴포넌트
const CDAlbumImage: React.FC<{ imageUri?: string; size?: number }> = ({ imageUri, size = 60 }) => {
  const cdSize = size;
  const albumSize = size * 0.85; // 앨범 이미지는 CD 크기의 85%
  const centerHoleSize = size * 0.15; // 중앙 홀은 CD 크기의 15%

  return (
    <View style={[styles.cdContainer, { width: cdSize, height: cdSize }]}>
      {/* CD 외부 배경 */}
      <View style={[styles.cdBackground, {
        width: cdSize,
        height: cdSize,
        borderRadius: cdSize * 0.18, // 둥근 모서리
      }]}>
        {/* 앨범 이미지 영역 */}
        <View style={[styles.albumImageContainer, {
          width: albumSize,
          height: albumSize,
          borderRadius: albumSize / 2,
        }]}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.albumImageInner}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.defaultAlbumImageInner}>
              <Icon name="music" width={16} height={16} color={TEXT_COLORS.CAPTION} />
            </View>
          )}

          {/* CD 효과 오버레이 */}
          <View style={styles.cdOverlay} />

          {/* 중앙 홀 */}
          <View style={[styles.centerHole, {
            width: centerHoleSize,
            height: centerHoleSize,
            borderRadius: centerHoleSize / 2,
          }]} />
        </View>
      </View>
    </View>
  );
};

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
  dropLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  onClose: () => void;
}

const NowPlayingCard: React.FC<NowPlayingCardProps> = React.memo(({
  visible,
  droppingData,
  dropLocation,
  currentLocation,
  onClose
}) => {
  // 핀 위치에 따른 카드 위치 계산
  const cardPosition = useMemo(() => {
    if (!dropLocation) {
      // 기본 위치 (헤더 아래)
      return {
        top: verticalScale(120),
        left: scale(20),
        right: scale(20),
      };
    }

    // 위도/경도 차이를 화면 좌표로 변환하는 간단한 계산
    const latDiff = dropLocation.latitude - currentLocation.latitude;
    const lngDiff = dropLocation.longitude - currentLocation.longitude;

    // 화면 중앙을 기준으로 계산
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    // 위도/경도 차이를 픽셀로 변환 (임의의 스케일 팩터)
    const scaleFactor = 100000; // 이 값을 조정해서 민감도 조절
    const offsetX = lngDiff * scaleFactor;
    const offsetY = -latDiff * scaleFactor; // 위도는 반전 (북쪽이 위쪽)

    let cardX = centerX + offsetX - scale(150); // 카드 너비의 절반만큼 왼쪽으로
    let cardY = centerY + offsetY - verticalScale(140); // 카드를 핀보다 훨씬 위쪽에 배치

    // 화면 경계 내에 카드가 위치하도록 제한
    const cardWidth = screenWidth - scale(40); // 좌우 여백
    const cardHeight = verticalScale(80);

    cardX = Math.max(scale(20), Math.min(cardX, screenWidth - cardWidth - scale(20)));
    cardY = Math.max(verticalScale(100), Math.min(cardY, screenHeight - cardHeight - verticalScale(100)));

    return {
      top: cardY,
      left: cardX,
      right: undefined, // absolute positioning을 위해 right 제거
      width: cardWidth,
    };
  }, [dropLocation, currentLocation]);

  if (!visible || !droppingData) return null;

  return (
    <View style={[styles.container, cardPosition]}>
      <View style={styles.card}>
        <View style={styles.mainContent}>
          {/* 왼쪽: CD 모양 앨범 이미지 */}
          <View style={styles.albumContainer}>
            <CDAlbumImage
              imageUri={droppingData.albumImagePath}
              size={scale(60)}
            />
          </View>

          {/* 가운데: 곡 정보 + 아이콘들 */}
          <View style={styles.contentColumn}>
            {/* 곡 제목 */}
            <Text style={styles.songTitle} numberOfLines={1}>
              {droppingData.title || '제목 없음'}
            </Text>

            {/* 가수명 */}
            <Text style={styles.artistName} numberOfLines={1}>
              by {droppingData.artist || '알 수 없는 아티스트'}
            </Text>

            {/* 아이콘들 (가로 배치) */}
            <View style={styles.iconsRow}>
              {/* 좋아요 */}
              <TouchableOpacity style={styles.likeContainer}>
                <Icon name="heart" width={16} height={16} color="#FF4444" />
                <Text style={styles.likeCount}>{droppingData.likeCount || 21}</Text>
              </TouchableOpacity>

              {/* 다운로드 */}
              <TouchableOpacity style={styles.downloadButton}>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Path
                    d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2"
                    stroke="#EF9210"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 닫기 버튼 (우상단) */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 15,
  },
  card: {
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
    position: 'relative',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(12),
  },
  contentColumn: {
    flex: 1,
    minWidth: 0,
  },
  cdContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cdBackground: {
    backgroundColor: '#212131',
    alignItems: 'center',
    justifyContent: 'center',
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
  albumImageContainer: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumImageInner: {
    width: '100%',
    height: '100%',
  },
  defaultAlbumImageInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cdOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(19, 3, 9, 0.2)',
    borderRadius: 50,
  },
  centerHole: {
    position: 'absolute',
    backgroundColor: '#212131',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -7.5 }, { translateY: -7.5 }], // centerHoleSize/2
  },
  songTitle: {
    ...TYPOGRAPHY.HEADLINE_2,
    color: '#FF4444',
    marginBottom: verticalScale(4),
    fontSize: 24,
  },
  artistName: {
    ...TYPOGRAPHY.CAPTION_2,
    color: TEXT_COLORS.CAPTION,
    marginBottom: verticalScale(8),
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  likeCount: {
    fontSize: 16,
    color: '#FF4444',
    fontWeight: 'bold',
  },
  downloadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(4),
  },
  closeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
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