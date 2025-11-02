import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, withSpring, useDerivedValue } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicWheel';
import MusicNode from './MusicNode';
import { VisibleNode } from '../../types/musicList';
import { navigate } from '../../../../navigation';
import DropButton from './DropButton';
import { useQuery } from '@tanstack/react-query';
import { getSongInfo } from '../../../drop/api/dropApi';

const SWIPE_THRESHOLD = 80;
const INVERT_DIRECTION = false;
const sign = INVERT_DIRECTION ? -1 : 1;
const ANGLE_PER_ITEM = 45;
const TOTAL_NODES = 7;

interface MusicWheelProps {
  droppings: any[];
}

function MusicWheel({ droppings }: MusicWheelProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const totalSongs = droppings?.length || 0;
  const rotation = useSharedValue(0);
  const startRotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = 0;
  }, [rotation]);

  const song1Query = useQuery({
    queryKey: ['songInfo', droppings?.[0]?.songId],
    queryFn: () => getSongInfo(droppings[0].songId),
    enabled: !!(droppings?.[0]?.songId),
  });
  
  const song2Query = useQuery({
    queryKey: ['songInfo', droppings?.[1]?.songId],
    queryFn: () => getSongInfo(droppings[1].songId),
    enabled: !!(droppings?.[1]?.songId),
  });

  const song3Query = useQuery({
    queryKey: ['songInfo', droppings?.[2]?.songId],
    queryFn: () => getSongInfo(droppings[2].songId),
    enabled: !!(droppings?.[2]?.songId),
  });

  const song4Query = useQuery({
    queryKey: ['songInfo', droppings?.[3]?.songId],
    queryFn: () => getSongInfo(droppings[3].songId),
    enabled: !!(droppings?.[3]?.songId),
  });

  const song5Query = useQuery({
    queryKey: ['songInfo', droppings?.[4]?.songId],
    queryFn: () => getSongInfo(droppings[4].songId),
    enabled: !!(droppings?.[4]?.songId),
  });

  const song6Query = useQuery({
    queryKey: ['songInfo', droppings?.[5]?.songId],
    queryFn: () => getSongInfo(droppings[5].songId),
    enabled: !!(droppings?.[5]?.songId),
  });

  const song7Query = useQuery({
    queryKey: ['songInfo', droppings?.[6]?.songId],
    queryFn: () => getSongInfo(droppings[6].songId),
    enabled: !!(droppings?.[6]?.songId),
  });

  const songQueries = [song1Query, song2Query, song3Query, song4Query, song5Query, song6Query, song7Query];

  const handlerPressDrop = ()=>{
    navigate('Drop');
  }

  const mainNodeIndex = useDerivedValue(() => {
    'worklet';
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let nodeIndex = 0; nodeIndex < TOTAL_NODES; nodeIndex++) {
      const baseAngle = nodeIndex * ANGLE_PER_ITEM - 120;
      const currentAngle = baseAngle + rotation.value;
      const normalizedAngle = ((currentAngle + 180) % 360) - 180;
      const distanceFromMain = Math.abs(normalizedAngle - (-120));

      if (distanceFromMain < minDistance) {
        minDistance = distanceFromMain;
        closestIndex = nodeIndex;
      }
    }

    return closestIndex;
  });

  const getVisibleNodes = () => {
    const nodes: VisibleNode[] = [];
    if (!droppings || droppings.length === 0) {
      return nodes;
    }

    for (let nodeIndex = 0; nodeIndex < TOTAL_NODES; nodeIndex++) {
      // 현재 인덱스 기반으로 데이터 할당
      const dataIndex = (currentIndex + nodeIndex) % totalSongs;

      if (droppings[dataIndex]) {
        const dropping = droppings[dataIndex];

        // 해당 드랍핑의 실제 songInfo 조회
        let songInfo = null;
        if (songQueries[dataIndex]?.data) {
          songInfo = songQueries[dataIndex].data;
        }

        const baseAngle = nodeIndex * ANGLE_PER_ITEM - 120;

        const isMainNode = nodeIndex === 0;

        nodes.push({
          position: {
            angle: baseAngle,
            isMain: isMainNode,
            scale: 1,
            opacity: 1,
          },
          song: {
            dropping: dropping,
            songInfo: songInfo
          } as any,
          slotIndex: nodeIndex,
        });
      }
    }
    return nodes;
  };

  const updateIndex = (direction: string) => {
    if (direction === 'prev') {
      setCurrentIndex((prev: number) => (prev - 1 + totalSongs) % totalSongs);
    } else {
      setCurrentIndex((prev: number) => (prev + 1) % totalSongs);
    }
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
        'worklet';
        startRotation.value = rotation.value;
    })
    .onUpdate(event => {
        'worklet';
        // 드래그 거리에 비례하여 rotation 값 업데이트 (적당한 반응)
        const rawRotation = startRotation.value + sign * event.translationX * 0.8;

        // 가장 가까운 스냅 포인트와의 거리 계산
        const nearestStep = Math.round(rawRotation / ANGLE_PER_ITEM);
        const nearestRotation = nearestStep * ANGLE_PER_ITEM;
        const distanceToSnap = Math.abs(rawRotation - nearestRotation);

        // 스냅 포인트에 가까울수록 자기 정렬 효과 적용 (약하게)
        const snapInfluence = Math.max(0, 1 - (distanceToSnap / (ANGLE_PER_ITEM * 0.4)));
        const alignedRotation = rawRotation + (nearestRotation - rawRotation) * snapInfluence * 0.1;

        rotation.value = alignedRotation;
    })
    .onEnd(event => {
        'worklet';
        const drag = sign * event.translationX;
        const velocity = Math.abs(event.velocityX);

        // 더 확실한 스와이프 의도 감지: 거리와 속도 모두 고려
        const isDefiniteSwipe = Math.abs(drag) > SWIPE_THRESHOLD && velocity > 300;

        if (isDefiniteSwipe) {
            // 현재 rotation에서 가장 가까운 정확한 각도 위치 계산
            const currentStep = Math.round(rotation.value / ANGLE_PER_ITEM);
            const direction = drag > 0 ? 1 : -1;
            const targetStep = currentStep + direction;
            const targetRotation = targetStep * ANGLE_PER_ITEM;

            // 부드러운 스냅 애니메이션
            rotation.value = withSpring(targetRotation, {
                damping: 100,    // 더 부드러운 감쇠
                stiffness: 50, // 적당한 탄성
                mass: 1,        // 자연스러운 질량감
            });

            runOnJS(updateIndex)(drag > 0 ? 'next' : 'prev');
        } else {
            // 가장 가까운 정확한 각도로 부드럽게 스냅
            const nearestStep = Math.round(rotation.value / ANGLE_PER_ITEM);
            const nearestRotation = nearestStep * ANGLE_PER_ITEM;

            rotation.value = withSpring(nearestRotation, {
                damping: 150,    // 빠른 복귀용 감쇠
                stiffness: 200, // 적당한 탄성
                mass: 1,      // 가벼운 질량감
            });
        }
    });

  const visibleNodes = getVisibleNodes();

  if (totalSongs === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.dropButtonWrapper}>
          <DropButton onPress={handlerPressDrop} />
        </View>
      </View>
    );
  }

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={styles.container}>
        <View style={styles.nodeGroup}>
          {visibleNodes.map((node: VisibleNode, index) => (
            <MusicNode
              key={`${(node.song as any).dropping.droppingId}-${node.slotIndex}`}
              data={node.song as any}
              isMain={node.position.isMain}
              index={index}
              baseAngle={node.position.angle}
              rotation={rotation}
              mainNodeIndex={mainNodeIndex}
              nodeIndex={node.slotIndex}
            />
          ))}
        </View>
        <View style={styles.dropButtonWrapper}>
          <DropButton onPress={handlerPressDrop} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export default MusicWheel;
