import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, withSpring, useDerivedValue, useAnimatedReaction } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicWheel';
import MusicNode from './MusicNode';
import { VisibleNode } from '../../types/musicList';
import { navigate } from '../../../../navigation';
import DropButton from './DropButton';
import { useQueries } from '@tanstack/react-query';
import { getSongInfo } from '../../../drop/api/dropApi';

const SWIPE_THRESHOLD = 60;
const INVERT_DIRECTION = false;
const sign = INVERT_DIRECTION ? -1 : 1;
const ANGLE_PER_ITEM = 45;  // 45도 → 25도 (더 촉촉하게)
const TOTAL_NODES = 8;
const MAIN_NODE_ANGLE = -100;  // 메인 노드는 왼쪽

interface MusicWheelProps {
  droppings: any[];
  onDroppingChange?: (droppingId: string | undefined, songId: string | undefined) => void;
}

const MusicWheel = React.memo(function MusicWheel({ droppings, onDroppingChange }: MusicWheelProps) {
  const safeDroppings = React.useMemo(() => {
    if (!Array.isArray(droppings)) return [];
    
    // MUSIC 타입만 필터링 (VOTE 타입 제외)
    const musicDroppings = droppings.filter(d => 
      d && 
      d.type === 'MUSIC' && 
      d.songId && 
      d.droppingId
    );
    
    console.log(`safeDroppings 필터링: 전체 ${droppings.length}개 → MUSIC ${musicDroppings.length}개`);
    return musicDroppings;
  }, [droppings]);

  const extendedDroppings = React.useMemo(() => {
    if (safeDroppings.length === 0) return [];

    const extended = [];
    for (let i = 0; i < TOTAL_NODES; i++) {
      const sourceIndex = i % safeDroppings.length;
      extended.push({
        ...safeDroppings[sourceIndex],
        _originalIndex: sourceIndex,
        _extendedIndex: i
      });
    }

    console.log(`extendedDroppings: ${extended.length}개 생성`);
    extended.forEach((d, i) => console.log(`  [${i}] type:${d.type} songId:${d.songId?.substring(0,8)}`));
    return extended;
  }, [safeDroppings]);

  const totalSongs = safeDroppings.length;
  const rotation = useSharedValue(0);
  const baseRotation = useSharedValue(0);
  const startRotation = useSharedValue(0);

  const [_isSwiping, setIsSwiping] = useState<boolean>(false);
  const hasInitialized = useRef(false);
  const lastReportedSongId = useRef<string | undefined>(undefined);
  const previousDroppingsRef = useRef<any[]>([]);

  // droppings 배열이 변경되면 회전 상태 초기화
  useEffect(() => {
    if (safeDroppings.length > 0) {
      // droppings의 실제 내용이 바뀌었는지 확인
      const droppingsChanged = 
        previousDroppingsRef.current.length !== safeDroppings.length ||
        previousDroppingsRef.current.some((prev, idx) => 
          prev?.droppingId !== safeDroppings[idx]?.droppingId
        );

      if (droppingsChanged) {
        console.log('droppings 변경 감지 - 회전 상태 초기화');
        baseRotation.value = 0;
        rotation.value = 0;
        hasInitialized.current = false;
        lastReportedSongId.current = undefined;
        previousDroppingsRef.current = [...safeDroppings];
      }
    }
  }, [safeDroppings, baseRotation, rotation]);

  useEffect(() => {
    if (safeDroppings.length > 0 && !hasInitialized.current) {
      hasInitialized.current = true;

      if (extendedDroppings && extendedDroppings.length > 0 && extendedDroppings[0]) {
        const firstDropping = extendedDroppings[0];

        if (onDroppingChange && firstDropping.songId) {
          lastReportedSongId.current = firstDropping.songId;
          onDroppingChange(firstDropping.droppingId, firstDropping.songId);
        }
      }
    }
  }, [safeDroppings.length, safeDroppings, extendedDroppings, onDroppingChange]);

  const mainNodeIndex = useDerivedValue(() => {
    'worklet';
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let nodeIndex = 0; nodeIndex < TOTAL_NODES; nodeIndex++) {
      const baseAngle = nodeIndex * ANGLE_PER_ITEM + MAIN_NODE_ANGLE;
      const totalRotation = baseRotation.value + rotation.value;
      const currentAngle = baseAngle + totalRotation;
      const normalizedAngle = ((currentAngle + 180) % 360) - 180;
      const distanceFromMain = Math.abs(normalizedAngle - MAIN_NODE_ANGLE);

      if (distanceFromMain < minDistance) {
        minDistance = distanceFromMain;
        closestIndex = nodeIndex;
      }
    }

    return closestIndex;
  });

  const handleMainNodeChange = React.useCallback((newIndex: number) => {
    if (
      extendedDroppings &&
      Array.isArray(extendedDroppings) &&
      extendedDroppings.length > 0 &&
      newIndex >= 0 &&
      newIndex < extendedDroppings.length
    ) {
      const currentDropping = extendedDroppings[newIndex];
      if (currentDropping && currentDropping.droppingId && currentDropping.songId) {
        // 이미 보고된 곡이면 중복 호출 방지
        if (lastReportedSongId.current === currentDropping.songId) {
          return;
        }
        
        lastReportedSongId.current = currentDropping.songId;
        if (onDroppingChange) {
          console.log('메인 노드 변경:', currentDropping.songId);
          onDroppingChange(currentDropping.droppingId, currentDropping.songId);
        }
      }
    }
  }, [extendedDroppings, onDroppingChange]);

  useAnimatedReaction(
    () => mainNodeIndex.value,
    (currentIndex, previousIndex) => {
      'worklet';
      if (currentIndex !== previousIndex && currentIndex >= 0) {
        runOnJS(handleMainNodeChange)(currentIndex);
      }
    },
    [handleMainNodeChange]
  );

  const visibleSongIds = React.useMemo(() => {
    if (!extendedDroppings || !Array.isArray(extendedDroppings) || extendedDroppings.length === 0) {
      return [];
    }

    // 중복 제거: Set 사용
    const uniqueIds = new Set<string>();
    for (let i = 0; i < TOTAL_NODES; i++) {
      const dataIndex = i % TOTAL_NODES;

      if (dataIndex < extendedDroppings.length) {
        const dropping = extendedDroppings[dataIndex];
        if (dropping?.songId && typeof dropping.songId === 'string') {
          uniqueIds.add(dropping.songId);
        }
      }
    }

    return Array.from(uniqueIds);
  }, [extendedDroppings]);

  const songQueries = useQueries({
    queries: visibleSongIds.map((songId) => ({
      queryKey: ['songInfo', songId],
      queryFn: () => getSongInfo(songId),
      enabled: true,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  const handlerPressDrop = React.useCallback(() => {
    navigate('Drop');
  }, []);

  // songQueries의 data를 songId를 키로 하는 Map으로 변환
  const songInfoMap = React.useMemo(() => {
    const map = new Map<string, any>();
    visibleSongIds.forEach((songId, index) => {
      if (songQueries[index]?.data) {
        map.set(songId, songQueries[index].data);
        console.log(`songInfoMap 설정: ${songId}`, songQueries[index].data);
      }
    });
    console.log('songInfoMap 전체:', Array.from(map.keys()));
    return map;
  }, [visibleSongIds, songQueries]);

  const visibleNodes = React.useMemo(() => {
    const nodes: VisibleNode[] = [];

    if (!extendedDroppings || !Array.isArray(extendedDroppings) || extendedDroppings.length === 0) {
      return nodes;
    }

    console.log('=== visibleNodes 생성 시작 ===');
    for (let nodeIndex = 0; nodeIndex < TOTAL_NODES; nodeIndex++) {
      if (nodeIndex >= extendedDroppings.length) {
        console.log(`[${nodeIndex}] ❌ 범위 초과 (extendedDroppings.length: ${extendedDroppings.length})`);
        continue;
      }

      const dropping = extendedDroppings[nodeIndex];
      const hasSongId = !!dropping?.songId;
      const hasDroppingId = !!dropping?.droppingId;
      
      console.log(`[${nodeIndex}] type:${dropping?.type} songId:${hasSongId} droppingId:${hasDroppingId}`);

      if (dropping && dropping.droppingId && dropping.songId) {
        const isMainNode = nodeIndex === 0;
        const songInfo = songInfoMap.get(dropping.songId) || null;
        const baseAngle = nodeIndex * ANGLE_PER_ITEM + MAIN_NODE_ANGLE;

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
        console.log(`[${nodeIndex}] ✅ 노드 추가됨`);
      } else {
        console.log(`[${nodeIndex}] ❌ 조건 미충족`);
      }
    }

    console.log(`=== visibleNodes 완료: ${nodes.length}개 ===`);
    return nodes;
  }, [extendedDroppings, songInfoMap]);

  const pan = Gesture.Pan()
    .onBegin(() => {
        'worklet';
        startRotation.value = baseRotation.value;
        runOnJS(setIsSwiping)(true);
    })
    .onUpdate(event => {
        'worklet';
        const currentRotation = startRotation.value + sign * event.translationX * 0.8;
        rotation.value = currentRotation - baseRotation.value;
    })
    .onEnd(event => {
        'worklet';
        const drag = sign * event.translationX;
        const totalRotation = startRotation.value + drag * 0.8;

        const isDefiniteSwipe = Math.abs(drag) > SWIPE_THRESHOLD;

        if (isDefiniteSwipe) {
            const direction = drag > 0 ? 1 : -1;
            const currentStep = Math.round(baseRotation.value / ANGLE_PER_ITEM);
            const targetStep = currentStep + direction;
            const targetRotation = targetStep * ANGLE_PER_ITEM;

            const animationTarget = targetRotation - baseRotation.value;
            rotation.value = withSpring(animationTarget, {
                damping: 20,
                stiffness: 150,
                mass: 1.2,
            }, (finished) => {
                'worklet';
                if (finished) {
                    baseRotation.value = targetRotation;
                    rotation.value = 0;
                    runOnJS(setIsSwiping)(false);
                }
            });
        } else {
            const nearestStep = Math.round(totalRotation / ANGLE_PER_ITEM);
            const targetRotation = nearestStep * ANGLE_PER_ITEM;
            const animationTarget = targetRotation - baseRotation.value;

            rotation.value = withSpring(animationTarget, {
                damping: 25,
                stiffness: 200,
                mass: 1.0,
            }, (finished) => {
                'worklet';
                if (finished) {
                    baseRotation.value = targetRotation;
                    rotation.value = 0;
                    runOnJS(setIsSwiping)(false);
                }
            });
        }
    });

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
              baseRotation={baseRotation}
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
}, (prevProps, nextProps) => {
  const prevDroppings = Array.isArray(prevProps.droppings) ? prevProps.droppings : [];
  const nextDroppings = Array.isArray(nextProps.droppings) ? nextProps.droppings : [];

  const droppingsEqual = prevDroppings.length === nextDroppings.length &&
    prevDroppings.every((prev, index) => {
      const next = nextDroppings[index];
      return next && prev.droppingId === next.droppingId && prev.songId === next.songId;
    });

  const callbackEqual = prevProps.onDroppingChange === nextProps.onDroppingChange;

  return droppingsEqual && callbackEqual;
});

export default MusicWheel;
