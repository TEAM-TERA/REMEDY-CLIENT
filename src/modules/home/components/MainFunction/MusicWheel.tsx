import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, withSpring, useDerivedValue } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicWheel';
import MusicNode from './MusicNode';
import { VisibleNode } from '../../types/musicList';
import { navigate } from '../../../../navigation';
import DropButton from './DropButton';
import { useQueries } from '@tanstack/react-query';
import { getSongInfo } from '../../../drop/api/dropApi';
import { useHLSPlayer } from '../../../../hooks/music/useHLSPlayer';
import { usePlayerStore } from '../../../../stores/playerStore';

const SWIPE_THRESHOLD = 60;
const INVERT_DIRECTION = false;
const sign = INVERT_DIRECTION ? -1 : 1;
const ANGLE_PER_ITEM = 45;
const TOTAL_NODES = 8;

interface MusicWheelProps {
  droppings: any[];
}

const MusicWheel = React.memo(function MusicWheel({ droppings }: MusicWheelProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const safeDroppings = Array.isArray(droppings) ? droppings : [];
  const totalSongs = safeDroppings.length;
  const rotation = useSharedValue(0);
  const baseRotation = useSharedValue(0);
  const startRotation = useSharedValue(0);

  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [currentSongId, setCurrentSongId] = useState<string | undefined>(undefined);
  const musicPlayer = useHLSPlayer(currentSongId);
  const { setCurrentId } = usePlayerStore();
  const didInitRef = useRef(false);

  const updateIndexAndSong = React.useCallback((newIndex: number) => {
    if (totalSongs === 0) return;
    const normalized = ((newIndex % totalSongs) + totalSongs) % totalSongs;
    setCurrentIndex(normalized);
    const nextSongId = safeDroppings[normalized]?.songId;
    setCurrentSongId(nextSongId);
    if (nextSongId) {
      setCurrentId(nextSongId);
    }
  }, [safeDroppings, totalSongs, setCurrentId]);

  // 초기 마운트 시 이전 회전/인덱스 복원
  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      baseRotation.value = 0;
      rotation.value = 0;
    }
    if (__DEV__) {
      console.log('🎡 MusicWheel mounted, droppings count:', safeDroppings.length);
    }
  }, [rotation, baseRotation, safeDroppings.length]);

  useEffect(() => {
    if (__DEV__) {
      console.log('Droppings changed, count:', safeDroppings.length);
      console.log('Current index:', currentIndex);
      console.log('Is swiping:', isSwiping);
      console.log('Current song ID:', currentSongId);
    }
  }, [safeDroppings, currentIndex, isSwiping, currentSongId]);

  const visibleSongIds = React.useMemo(() => {
    if (totalSongs === 0) return [];
    const ids = [];
    for (let i = 0; i < Math.min(TOTAL_NODES, totalSongs); i++) {
      const dataIndex = (currentIndex + i) % totalSongs;
      if (safeDroppings[dataIndex]?.songId) {
        ids.push(safeDroppings[dataIndex].songId);
      }
    }
    return ids;
  }, [safeDroppings, currentIndex, totalSongs]);

  const songQueries = useQueries({
    queries: visibleSongIds.map((songId, idx) => ({
      queryKey: ['songInfo', songId, safeDroppings[(currentIndex + idx) % totalSongs]?.droppingId || idx],
      queryFn: () => getSongInfo(songId),
      enabled: !!songId,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const handlerPressDrop = React.useCallback(() => {
    navigate('Drop');
  }, []);

  const mainNodeIndex = useDerivedValue(() => {
    'worklet';
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let nodeIndex = 0; nodeIndex < TOTAL_NODES; nodeIndex++) {
      const baseAngle = nodeIndex * ANGLE_PER_ITEM - 90;
      const totalRotation = baseRotation.value + rotation.value;
      const currentAngle = baseAngle + totalRotation;
      const normalizedAngle = ((currentAngle + 180) % 360) - 180;
      const distanceFromMain = Math.abs(normalizedAngle - (-90));

      if (distanceFromMain < minDistance) {
        minDistance = distanceFromMain;
        closestIndex = nodeIndex;
      }
    }

    return closestIndex;
  });

  const actualMainDataIndex = useMemo(() => {
    if (totalSongs === 0) return 0;
    return currentIndex % totalSongs;
  }, [currentIndex, totalSongs]);

  useEffect(() => {
    if (safeDroppings && safeDroppings[actualMainDataIndex]) {
      const nextId = safeDroppings[actualMainDataIndex].songId;
      setCurrentSongId(nextId);
    } else {
      setCurrentSongId(undefined);
    }
  }, [actualMainDataIndex, safeDroppings]);

  const visibleNodes = React.useMemo(() => {
    const nodes: VisibleNode[] = [];
    if (totalSongs === 0) {
      return nodes;
    }

    for (let nodeIndex = 0; nodeIndex < TOTAL_NODES; nodeIndex++) {
      const dataIndex = (currentIndex + nodeIndex) % totalSongs;

      if (safeDroppings[dataIndex]) {
        const dropping = safeDroppings[dataIndex];
        const isMainNode = nodeIndex === 0;

        let songInfo = null;
        const queryIndex = visibleSongIds.indexOf(dropping.songId);
        if (queryIndex !== -1 && songQueries[queryIndex]?.data) {
          songInfo = songQueries[queryIndex].data;
        }

        const baseAngle = nodeIndex * ANGLE_PER_ITEM - 90;

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
  }, [safeDroppings, currentIndex, totalSongs, visibleSongIds, songQueries]);

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
                    runOnJS(updateIndexAndSong)(targetStep % totalSongs);
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
                    runOnJS(updateIndexAndSong)(nearestStep % totalSongs);
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
  if (prevProps.droppings.length !== nextProps.droppings.length) {
    return false;
  }

  return prevProps.droppings.every((prev, index) => {
    const next = nextProps.droppings[index];
    return next && prev.droppingId === next.droppingId && prev.songId === next.songId;
  });
});

export default MusicWheel;
