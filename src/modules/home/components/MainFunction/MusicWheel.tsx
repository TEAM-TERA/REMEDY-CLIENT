import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, withSpring, useDerivedValue, useAnimatedReaction } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicWheel';
import MusicNode from './MusicNode';
import { VisibleNode } from '../../types/musicList';
import { navigate } from '../../../../navigation';
import DropButton from './DropButton';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getSongInfo } from '../../../drop/api/dropApi';
import { useHLSPlayer } from '../../../../hooks/music/useHLSPlayer';

const SWIPE_THRESHOLD = 30;
const INVERT_DIRECTION = false;
const sign = INVERT_DIRECTION ? -1 : 1;
const ANGLE_PER_ITEM = 45;
const TOTAL_NODES = 8;

interface MusicWheelProps {
  droppings: any[];
}

function MusicWheel({ droppings }: MusicWheelProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const totalSongs = droppings?.length || 0;
  const rotation = useSharedValue(0);
  const startRotation = useSharedValue(0);

  const [visualMainIndex, setVisualMainIndex] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const actualMainDataIndex = isSwiping ? currentIndex : ((currentIndex + visualMainIndex) % totalSongs);
  const currentSongId = droppings?.[actualMainDataIndex]?.songId;
  const musicPlayer = useHLSPlayer(currentSongId);

  useEffect(() => {
    if (__DEV__) {
      console.log('🎡 MusicWheel mounted, droppings count:', droppings?.length);
    }
    rotation.value = 0;
  }, [rotation]);

  useEffect(() => {
    if (__DEV__) {
      console.log('📊 Droppings changed, count:', droppings?.length);
      console.log('📊 Current index:', currentIndex);
      console.log('👁️ Visual main index:', visualMainIndex);
      console.log('✋ Is swiping:', isSwiping);
      console.log('🎯 Actual main data index:', actualMainDataIndex);
      console.log('🎵 Current song ID:', currentSongId);
    }
  }, [droppings, currentIndex, visualMainIndex, isSwiping, actualMainDataIndex, currentSongId]);

  const visibleSongIds = React.useMemo(() => {
    if (!droppings || droppings.length === 0) return [];
    const ids = [];
    for (let i = 0; i < Math.min(TOTAL_NODES, totalSongs); i++) {
      const dataIndex = (currentIndex + i) % totalSongs;
      if (droppings[dataIndex]?.songId) {
        ids.push(droppings[dataIndex].songId);
      }
    }
    return ids;
  }, [droppings, currentIndex, totalSongs]);

  const songQueries = useQueries({
    queries: visibleSongIds.map(songId => ({
      queryKey: ['songInfo', songId],
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
      const baseAngle = nodeIndex * ANGLE_PER_ITEM - 60;
      const currentAngle = baseAngle + rotation.value;
      const normalizedAngle = ((currentAngle + 180) % 360) - 180;
      const distanceFromMain = Math.abs(normalizedAngle - (-60));

      if (distanceFromMain < minDistance) {
        minDistance = distanceFromMain;
        closestIndex = nodeIndex;
      }
    }

    return closestIndex;
  });

  // setInterval 대신 useAnimatedReaction 사용 (성능 최적화)
  useAnimatedReaction(
    () => mainNodeIndex.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(setVisualMainIndex)(currentValue);
      }
    },
    []
  );

  const visibleNodes = React.useMemo(() => {
    const nodes: VisibleNode[] = [];
    if (!droppings || droppings.length === 0) {
      return nodes;
    }

    for (let nodeIndex = 0; nodeIndex < TOTAL_NODES; nodeIndex++) {
      const dataIndex = (currentIndex + nodeIndex) % totalSongs;

      if (droppings[dataIndex]) {
        const dropping = droppings[dataIndex];
        const isMainNode = nodeIndex === 0;

        let songInfo = null;
        const queryIndex = visibleSongIds.indexOf(dropping.songId);
        if (queryIndex !== -1 && songQueries[queryIndex]?.data) {
          songInfo = songQueries[queryIndex].data;
        }

        const baseAngle = nodeIndex * ANGLE_PER_ITEM - 100;

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
  }, [droppings, currentIndex, totalSongs, visibleSongIds, songQueries]);

  const updateIndex = React.useCallback((direction: string) => {
    if (__DEV__) {
      console.log('🔄 updateIndex called, direction:', direction, 'visualMainIndex:', visualMainIndex);
    }

    setCurrentIndex((prev: number) => {
      const newIndex = (prev + visualMainIndex + totalSongs) % totalSongs;
      if (__DEV__) {
        console.log('📍 Setting currentIndex from', prev, 'to', newIndex);
      }
      return newIndex;
    });

    setVisualMainIndex(0);
  }, [visualMainIndex, totalSongs]);


  const pan = Gesture.Pan()
    .onBegin(() => {
        'worklet';
        startRotation.value = rotation.value;
        runOnJS(setIsSwiping)(true);
    })
    .onUpdate(event => {
        'worklet';
        const rawRotation = startRotation.value + sign * event.translationX * 0.8;

        const nearestStep = Math.round(rawRotation / ANGLE_PER_ITEM);
        const nearestRotation = nearestStep * ANGLE_PER_ITEM;
        const distanceToSnap = Math.abs(rawRotation - nearestRotation);

        const snapInfluence = Math.max(0, 1 - (distanceToSnap / (ANGLE_PER_ITEM * 0.4)));
        const alignedRotation = rawRotation + (nearestRotation - rawRotation) * snapInfluence * 0.1;

        rotation.value = alignedRotation;
    })
    .onEnd(event => {
        'worklet';
        const drag = sign * event.translationX;

        const isDefiniteSwipe = Math.abs(drag) > SWIPE_THRESHOLD;

        if (isDefiniteSwipe) {
            const direction = drag > 0 ? 1 : -1;

            rotation.value = withSpring(0, {
                damping: 100,
                stiffness: 50,
                mass: 1,
            }, () => {
                'worklet';
                runOnJS(setIsSwiping)(false);
            });

            runOnJS(updateIndex)(drag > 0 ? 'next' : 'prev');
        } else {
            rotation.value = withSpring(0, {
                damping: 150,
                stiffness: 200,
                mass: 1,
            }, () => {
                'worklet';
                runOnJS(setIsSwiping)(false);
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
