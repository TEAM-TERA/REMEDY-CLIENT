import React, { useEffect, useMemo, useState } from 'react';
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
import { usePlayerStore } from '../../../../stores/playerStore';

let persistedRotation = 0;
let persistedIndex = 0;

const SWIPE_THRESHOLD = 60;
const INVERT_DIRECTION = false;
const sign = INVERT_DIRECTION ? -1 : 1;
const ANGLE_PER_ITEM = 45;
const TOTAL_NODES = 8;

interface MusicWheelProps {
  droppings: any[];
}

const MusicWheel = React.memo(function MusicWheel({ droppings }: MusicWheelProps) {
  const safeDroppings = Array.isArray(droppings) ? droppings : [];
  const totalSongs = safeDroppings.length;
  const gestureOffset = useSharedValue(0);
  const [rotationDeg, setRotationDeg] = useState(persistedRotation);
  const rotationShared = useSharedValue(persistedRotation);
  const [currentIndex, setCurrentIndex] = useState<number>(persistedIndex);
  const [selectedDroppingId, setSelectedDroppingId] = useState<string | undefined>(safeDroppings[0]?.droppingId);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const { playIfDifferent, setCurrentId, currentId } = usePlayerStore();

  useEffect(() => {
    setCurrentIndex(prev => {
      if (totalSongs === 0) return 0;
      const normalized = ((prev % totalSongs) + totalSongs) % totalSongs;
      persistedIndex = normalized;
      return normalized;
    });
  }, [totalSongs]);

  useEffect(() => {
    if (totalSongs === 0) {
      setSelectedDroppingId(undefined);
      setCurrentIndex(0);
      persistedIndex = 0;
      return;
    }

    if (selectedDroppingId) {
      const foundIdx = safeDroppings.findIndex(d => String(d.droppingId) === String(selectedDroppingId));
      if (foundIdx !== -1 && foundIdx !== currentIndex) {
        setCurrentIndex(foundIdx);
        persistedIndex = foundIdx;
      } else if (foundIdx === -1) {
        setSelectedDroppingId(safeDroppings[0]?.droppingId);
        setCurrentIndex(0);
        persistedIndex = 0;
      }
    } else {
      setSelectedDroppingId(safeDroppings[0]?.droppingId);
      setCurrentIndex(0);
      persistedIndex = 0;
    }
  }, [safeDroppings, totalSongs, selectedDroppingId, currentIndex]);

  useEffect(() => {
    rotationShared.value = rotationDeg;
    persistedRotation = rotationDeg;
  }, [rotationDeg, rotationShared]);

  const playByIndex = React.useCallback((index: number) => {
    if (!safeDroppings[index]) return;
    const dropping = safeDroppings[index];
    const newSongId = dropping.songId;
    if (!newSongId) return;

    playIfDifferent(newSongId, {
      title: dropping.title || '음악',
      artist: dropping.singer || '알 수 없음',
      artwork: undefined,
    });
    setCurrentId(newSongId);
  }, [safeDroppings, playIfDifferent, setCurrentId]);

  const commitRotationStep = React.useCallback((targetIndex: number) => {
    if (totalSongs === 0) return;

    const newIndex = ((targetIndex % totalSongs) + totalSongs) % totalSongs;
    setCurrentIndex(newIndex);
    persistedIndex = newIndex;
    setSelectedDroppingId(safeDroppings[newIndex]?.droppingId);
    playByIndex(newIndex);
  }, [totalSongs, playByIndex, safeDroppings]);

  useEffect(() => {
    if (__DEV__) {
      console.log('Droppings changed, count:', safeDroppings.length);
      console.log('Current index:', currentIndex);
      console.log('Is swiping:', isSwiping);
    }
  }, [safeDroppings, currentIndex, isSwiping]);

  const visibleEntries = React.useMemo(() => {
    if (totalSongs === 0) return [];
    const entries: { songId: string; droppingId: string; dataIndex: number; slotIndex: number }[] = [];
    const maxNodes = Math.min(TOTAL_NODES, totalSongs);
    for (let slotIndex = 0; slotIndex < maxNodes; slotIndex++) {
      const dataIndex = (currentIndex + slotIndex) % totalSongs;
      const drop = safeDroppings[dataIndex];
      if (drop?.songId) {
        entries.push({
          songId: drop.songId,
          droppingId: String(drop.droppingId ?? dataIndex),
          dataIndex,
          slotIndex,
        });
      }
    }
    return entries;
  }, [safeDroppings, totalSongs, currentIndex]);

  const songQueries = useQueries({
    queries: visibleEntries.map(entry => ({
      queryKey: ['songInfo', entry.songId, entry.droppingId, entry.slotIndex],
      queryFn: () => getSongInfo(entry.songId),
      enabled: !!entry.songId,
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
      const totalRotation = rotationShared.value + gestureOffset.value;
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

  const visibleNodes = React.useMemo(() => {
    const nodes: VisibleNode[] = [];
    if (totalSongs === 0) {
      return nodes;
    }

    for (let idx = 0; idx < visibleEntries.length; idx++) {
      const entry = visibleEntries[idx];
      const dropping = safeDroppings[entry.dataIndex];
      if (!dropping) continue;

      let songInfo = null;
      if (songQueries[idx]?.data) {
        songInfo = songQueries[idx].data;
      }

      const baseAngle = entry.slotIndex * ANGLE_PER_ITEM - 90;

      nodes.push({
        position: {
          angle: baseAngle,
          isMain: entry.slotIndex === 0,
          scale: 1,
          opacity: 1,
        },
        song: {
          dropping: dropping,
          songInfo: songInfo
        } as any,
        slotIndex: entry.slotIndex,
      });
    }

    return nodes;
  }, [safeDroppings, totalSongs, visibleEntries, songQueries]);

  const handleSwipeBegin = React.useCallback(() => {
    setIsSwiping(true);
  }, []);

  const handleSwipeEnd = React.useCallback(() => {
    setIsSwiping(false);
  }, []);

  const pan = Gesture.Pan()
    .enabled(true)
    .manualActivation(true) // 기본 탭은 통과, 스와이프만 수동 활성
    .onBegin((event) => {
        'worklet';
        const { x, y } = event;
        const screenWidth = 375;
        const screenHeight = 667;

        const cdLeft = screenWidth * 0.1;
        const cdRight = screenWidth * 0.9;
        const cdTop = screenHeight * 0.1;
        const cdBottom = screenHeight * 0.5;
  
        if (x >= cdLeft && x <= cdRight && y >= cdTop && y <= cdBottom) {
          return;
        }

        runOnJS(handleSwipeBegin)();
    })
    .onTouchesMove((event, state) => {
        'worklet';
        const dragX = event.translationX;
        // 일정 거리 이상 움직였을 때만 제스처 활성화
        if (Math.abs(dragX) > 12) {
          state.activate();
        }
    })
    .onUpdate(event => {
        'worklet';
        const dragDeg = sign * event.translationX * 0.8;
        gestureOffset.value = dragDeg;
    })
    .onEnd(event => {
        'worklet';
        const drag = sign * event.translationX;
        const dragDeg = drag * 0.8;

        const isDefiniteSwipe = Math.abs(drag) > SWIPE_THRESHOLD;

        const stepDelta = isDefiniteSwipe ? (drag > 0 ? 1 : -1) : Math.round(dragDeg / ANGLE_PER_ITEM);

        if (stepDelta !== 0) {
          const nextRotation = rotationShared.value + stepDelta * ANGLE_PER_ITEM;
          rotationShared.value = nextRotation;
          runOnJS(setRotationDeg)(nextRotation);
        }

        gestureOffset.value = withSpring(0, {
          damping: isDefiniteSwipe ? 20 : 25,
          stiffness: isDefiniteSwipe ? 150 : 200,
          mass: isDefiniteSwipe ? 1.2 : 1.0,
        });

        if (stepDelta !== 0) {
          const nextIndex = ((currentIndex + stepDelta) % totalSongs + totalSongs) % totalSongs;
          runOnJS(commitRotationStep)(nextIndex);
        }
        runOnJS(handleSwipeEnd)();
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
    <Animated.View style={[styles.container, { pointerEvents: 'auto' }]}>
      <GestureDetector gesture={pan}>
        <View style={styles.nodeGroup}>
          {visibleNodes.map((node: VisibleNode, index) => (
            <MusicNode
              key={`${(node.song as any).dropping.droppingId}-${node.slotIndex}-${currentIndex}`}
              data={node.song as any}
              isMain={node.position.isMain}
              index={index}
              baseAngle={node.position.angle}
              rotation={gestureOffset}
              baseRotation={rotationShared}
              mainNodeIndex={mainNodeIndex}
              nodeIndex={node.slotIndex}
            />
          ))}
        </View>
      </GestureDetector>
      <View style={styles.dropButtonWrapper}>
        <DropButton onPress={handlerPressDrop} />
      </View>
    </Animated.View>
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
