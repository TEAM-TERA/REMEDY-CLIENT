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
const ANGLE_PER_ITEM = 45;
const TOTAL_NODES = 8;

interface MusicWheelProps {
  droppings: any[];
  onDroppingChange?: (droppingId: string | undefined, songId: string | undefined) => void;
}

const MusicWheel = React.memo(function MusicWheel({ droppings, onDroppingChange }: MusicWheelProps) {
  const safeDroppings = React.useMemo(() => {
    return Array.isArray(droppings) ? droppings : [];
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

    return extended;
  }, [safeDroppings]);

  const totalSongs = safeDroppings.length;
  const rotation = useSharedValue(0);
  const baseRotation = useSharedValue(0);
  const startRotation = useSharedValue(0);

  const [_isSwiping, setIsSwiping] = useState<boolean>(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (safeDroppings.length > 0 && !hasInitialized.current) {
      hasInitialized.current = true;

      if (extendedDroppings && extendedDroppings.length > 0 && extendedDroppings[0]) {
        const firstDropping = extendedDroppings[0];

        if (onDroppingChange && firstDropping.songId) {
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
        if (onDroppingChange) {
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

    const ids = [];
    for (let i = 0; i < TOTAL_NODES; i++) {
      const dataIndex = i % TOTAL_NODES;

      if (dataIndex < extendedDroppings.length) {
        const dropping = extendedDroppings[dataIndex];
        if (dropping?.songId && typeof dropping.songId === 'string') {
          ids.push(dropping.songId);
        }
      }
    }

    return ids;
  }, [extendedDroppings]);

  const songQueries = useQueries({
    queries: visibleSongIds.filter(songId => songId && typeof songId === 'string').map((songId) => ({
      queryKey: ['songInfo', songId],
      queryFn: () => getSongInfo(songId),
      enabled: !!songId && typeof songId === 'string',
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  const handlerPressDrop = React.useCallback(() => {
    navigate('Drop');
  }, []);

  const visibleNodes = React.useMemo(() => {
    const nodes: VisibleNode[] = [];

    if (!extendedDroppings || !Array.isArray(extendedDroppings) || extendedDroppings.length === 0) {
      return nodes;
    }

    for (let nodeIndex = 0; nodeIndex < TOTAL_NODES; nodeIndex++) {
      const dataIndex = nodeIndex % TOTAL_NODES;

      if (dataIndex >= extendedDroppings.length) continue;

      const dropping = extendedDroppings[dataIndex];

      if (dropping && dropping.droppingId && dropping.songId) {
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
  }, [extendedDroppings, visibleSongIds, songQueries]);

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
