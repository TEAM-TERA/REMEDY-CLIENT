import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { styles } from '../../styles/MainFunction/MusicNode';
import { Dropping } from '../../types/musicList';

interface MusicNodeProps {
  data: Dropping;
  isMain: boolean;
  index: number;
}

function MusicNode({ data, isMain, index }: MusicNodeProps) {
  // 각 노드별로 다른 반지름 설정
  const getRadius = () => {
    switch (index) {
      case 0: // 메인 노드
        return 70; // 중심에 가까이
      case 1: // 두번째 노드
        return 80; // 중간 거리
      case 2: // 세번째 노드
        return 100; // 약간 바깥쪽
      default:
        return 50;
    }
  };

  const radius = getRadius(); // 노드별 반지름

  // 각도를 미리 계산해서 상수로 저장
  const getAngle = () => {
    switch (index) {
      case 0:
        return -90; // 정확히 위쪽 (12시)
      case 1:
        return -150; // 왼쪽 위 (10시)
      case 2:
        return 180; // 9시 방향 (왼쪽)
      default:
        return 0;
    }
  };

  const angle = getAngle(); // worklet 밖에서 미리 계산

  // 원형 좌표 계산
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const angleInRadians = (angle * Math.PI) / 180;

    return {
      transform: [
        {
          translateX: Math.cos(angleInRadians) * radius,
        },
        {
          translateY: Math.sin(angleInRadians) * radius,
        },
        {
          scale: isMain ? 1.5 : 1.0,
        },
      ],
      opacity: isMain ? 1.0 : 0.8,
      zIndex: isMain ? 10 : 1,
    };
  });

  return (
    <Animated.View style={[styles.nodeContainer, animatedStyle]}>
      <TouchableOpacity style={isMain ? styles.container : styles.subContainer}>
        <Image
          source={{
            uri: 'https://water-icon-dc4.notion.site/image/attachment%3Ab9bf731d-818d-401f-ad45-93d3b397b092%3Aimage.png?table=block&id=22e2845a-0c9f-80d8-b078-e961135b029a&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=2000&userId=&cache=v2',
          }}
          style={isMain ? styles.musicImg : styles.subMusicImg}
        />
        <Text
          style={[
            TYPOGRAPHY.BODY_1,
            isMain ? styles.musicTitle : styles.subMusicTitle,
          ]}
        >
          {data.title}
        </Text>
        <Text
          style={[
            TYPOGRAPHY.CAPTION_2,
            isMain ? styles.singerText : styles.subSingerText,
          ]}
        >
          아이유
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default MusicNode;
