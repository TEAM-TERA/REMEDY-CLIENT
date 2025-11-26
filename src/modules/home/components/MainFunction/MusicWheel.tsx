import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, withSpring, useDerivedValue } from 'react-native-reanimated';
import { styles } from '../../styles/MainFunction/MusicWheel';
import MusicNode from './MusicNode';
import { VisibleNode } from '../../types/musicList';
import DropButton from './DropButton';
import { useQueries } from '@tanstack/react-query';
import { getSongInfo } from '../../../drop/api/dropApi';
import { usePlayerStore } from '../../../../stores/playerStore';
import useLocation from '../../../../hooks/useLocation';

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

  // MUSIC 타입만 필터링 (VOTE 타입 제외)
  const musicDroppings = React.useMemo(() => {
    return safeDroppings.filter(dropping => {
      const dropType = String(dropping.type || 'MUSIC').toUpperCase();
      return dropType === 'MUSIC';
    });
  }, [safeDroppings]);

  const totalSongs = musicDroppings.length;
  const gestureOffset = useSharedValue(0);
  const [rotationDeg, setRotationDeg] = useState(persistedRotation);
  const rotationShared = useSharedValue(persistedRotation);
  const [currentIndex, setCurrentIndex] = useState<number>(persistedIndex);
  const [selectedDroppingId, setSelectedDroppingId] = useState<string | undefined>(musicDroppings[0]?.droppingId);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [showDropOptions, setShowDropOptions] = useState<boolean>(false);
  const { playIfDifferent, setCurrentId } = usePlayerStore();
  const { location, address } = useLocation();

  // 위치 정보를 기본값으로 설정 (서울시청)
  const currentLocation = location ?? { latitude: 37.5665, longitude: 126.9780 };
  // 테스트용 실제 주소 (실제 위치 서비스가 안 될 때)
  const currentAddress = address || "부산광역시 기장군 가락대로 123";

  // 디버깅을 위한 로그
  console.log('MusicWheel location data:', { location, address, currentLocation, currentAddress });

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

    // Only update if we don't have a valid selectedDroppingId or it doesn't exist in current data
    if (!selectedDroppingId || !musicDroppings.find(d => String(d.droppingId) === String(selectedDroppingId))) {
      setSelectedDroppingId(musicDroppings[0]?.droppingId);
      setCurrentIndex(0);
      persistedIndex = 0;
    }
  }, [musicDroppings, totalSongs, selectedDroppingId]);

  useEffect(() => {
    rotationShared.value = rotationDeg;
    persistedRotation = rotationDeg;
  }, [rotationDeg, rotationShared]);

  const playByIndex = React.useCallback((index: number) => {
    const currentMusicDroppings = safeDroppings.filter(dropping => {
      const dropType = String(dropping.type || 'MUSIC').toUpperCase();
      return dropType === 'MUSIC';
    });

    if (!currentMusicDroppings[index]) return;
    const dropping = currentMusicDroppings[index];
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

    const currentMusicDroppings = safeDroppings.filter(dropping => {
      const dropType = String(dropping.type || 'MUSIC').toUpperCase();
      return dropType === 'MUSIC';
    });

    setSelectedDroppingId(currentMusicDroppings[newIndex]?.droppingId);
    playByIndex(newIndex);
  }, [totalSongs, playByIndex, safeDroppings]);

  useEffect(() => {
    if (__DEV__) {
      console.log('Music Droppings changed, count:', musicDroppings.length);
      console.log('Total droppings (including VOTE):', safeDroppings.length);
      console.log('Current index:', currentIndex);
      console.log('Is swiping:', isSwiping);
    }
  }, [musicDroppings, safeDroppings, currentIndex, isSwiping]);

  // 드랍 옵션 데이터
  const dropOptions = React.useMemo(() => [
    {
      droppingId: 'drop-option-music',
      songId: 'music',
      type: 'music',
      title: 'Music',
      address: '',
      content: '',
    },
    {
      droppingId: 'drop-option-playlist',
      songId: 'playlist',
      type: 'playlist',
      title: 'Playlist',
      address: '',
      content: '',
    },
    {
      droppingId: 'drop-option-debate',
      songId: 'debate',
      type: 'debate',
      title: 'Debate',
      address: '',
      content: '',
    },
  ], []);

  const displayData = React.useMemo(() => {
    return showDropOptions ? dropOptions : musicDroppings;
  }, [showDropOptions, dropOptions, musicDroppings]);

  const displayTotalSongs = displayData.length;

  // 메인 노드 인덱스 계산
  const mainNodeIndex = useDerivedValue(() => {
    'worklet';
    return 0; // 첫 번째 노드(슬롯 인덱스 0)가 항상 메인 노드
  }, []);

  const visibleEntries = React.useMemo(() => {
    if (displayTotalSongs === 0) return [];
    const entries: { songId: string; droppingId: string; dataIndex: number; slotIndex: number }[] = [];
    const maxNodes = Math.min(TOTAL_NODES, displayTotalSongs);

    for (let slotIndex = 0; slotIndex < maxNodes; slotIndex++) {
      const dataIndex = (showDropOptions ? slotIndex : (currentIndex + slotIndex)) % displayTotalSongs;
      const drop = displayData[dataIndex];

      if (drop) {
        entries.push({
          songId: drop.songId || drop.type || String(dataIndex),
          droppingId: String(drop.droppingId ?? dataIndex),
          dataIndex,
          slotIndex,
        });
      }
    }
    return entries;
  }, [displayData, displayTotalSongs, currentIndex, showDropOptions]);

  const songQueries = useQueries({
    queries: visibleEntries.map(entry => ({
      queryKey: ['songInfo', entry.songId, entry.droppingId, entry.slotIndex],
      queryFn: () => getSongInfo(entry.songId),
      enabled: !showDropOptions &&
        !!entry.songId &&
        !String(entry.droppingId).startsWith('drop-option-'),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const handlerPressDrop = React.useCallback(() => {
    if (showDropOptions) {
      setShowDropOptions(false);
    } else {
      setShowDropOptions(true);
    }
  }, [showDropOptions]);

  const visibleNodes = React.useMemo(() => {
    const nodes: VisibleNode[] = [];
    if (displayTotalSongs === 0) {
      return nodes;
    }

    for (let idx = 0; idx < visibleEntries.length; idx++) {
      const entry = visibleEntries[idx];
      const dropping = displayData[entry.dataIndex];
      if (!dropping) continue;

      let songInfo = null;
      if (!showDropOptions && songQueries[idx]?.data) {
        songInfo = songQueries[idx].data;
      }

      let baseAngle;
      if (showDropOptions) {
        switch (entry.slotIndex) {
          case 0: baseAngle = -98; break;
          case 1: baseAngle = -138; break;
          case 2: baseAngle = -185; break;
          default: baseAngle = -90; break;
        }
      } else {
        baseAngle = entry.slotIndex * ANGLE_PER_ITEM - 90;
      }

      nodes.push({
        position: {
          angle: baseAngle,
          isMain: entry.slotIndex === 0,
          scale: 1,
          opacity: 1,
        },
        song: {
          dropping: dropping,
          songInfo: songInfo,
          isDropOption: showDropOptions
        } as any,
        slotIndex: entry.slotIndex,
      });
    }
    return nodes;
  }, [displayData, displayTotalSongs, visibleEntries, songQueries, showDropOptions]);

  const handleSwipeBegin = React.useCallback(() => {
    setIsSwiping(true);
  }, []);

  const handleSwipeEnd = React.useCallback(() => {
    setIsSwiping(false);
  }, []);

  let startX = 0;

  const pan = Gesture.Pan()
    .enabled(!showDropOptions)
    .manualActivation(true)
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
        const currentX = event.changedTouches[0]?.x || 0;
        const dragX = currentX - startX;
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

        const isDefiniteSwipe = Math.abs(drag) > SWIPE_THRESHOLD;
        if (isDefiniteSwipe) {
            const direction = drag > 0 ? 1 : -1;
            const currentStep = Math.round(rotationShared.value / ANGLE_PER_ITEM);
            const targetStep = currentStep + direction;
            const targetRotation = targetStep * ANGLE_PER_ITEM;

            rotationShared.value = withSpring(targetRotation, {
                damping: 20,
                stiffness: 150,
                mass: 1.2,
            }, () => {
                'worklet';
                runOnJS(setRotationDeg)(targetRotation);
                runOnJS(commitRotationStep)(targetStep);
            });
        }

        gestureOffset.value = withSpring(0);
        runOnJS(handleSwipeEnd)();
    });

  if (displayTotalSongs === 0 && !showDropOptions) {
    return (
      <View style={styles.container}>
        <View style={styles.dropButtonWrapper}>
          <DropButton onPress={handlerPressDrop} isCancel={showDropOptions} />
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { pointerEvents: 'auto' }]}>
      <GestureDetector gesture={pan}>
        <View style={styles.nodeGroup}>
          {(() => {
            if (__DEV__ && showDropOptions) {
              console.log(`=== 렌더링 시작: ${visibleNodes.length}개 노드 ===`);
              visibleNodes.forEach((node, idx) => {
                console.log(`렌더링 노드 ${idx}: ${(node.song as any).dropping.type}, 각도: ${node.position.angle}°`);
              });
            }
            return visibleNodes.map((node: VisibleNode, index) => (
              <MusicNode
                key={`${(node.song as any).dropping.droppingId}-${node.slotIndex}-${showDropOptions ? 'drop' : currentIndex}`}
                data={node.song as any}
                isMain={node.position.isMain}
                index={index}
                baseAngle={node.position.angle}
                rotation={gestureOffset}
                baseRotation={rotationShared}
                mainNodeIndex={mainNodeIndex}
                nodeIndex={node.slotIndex}
                currentLocation={currentLocation}
                currentAddress={currentAddress}
              />
            ));
          })()}
        </View>
      </GestureDetector>
      <View style={styles.dropButtonWrapper}>
        <DropButton onPress={handlerPressDrop} isCancel={showDropOptions} />
      </View>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  const prevDroppings = Array.isArray(prevProps.droppings) ? prevProps.droppings : [];
  const nextDroppings = Array.isArray(nextProps.droppings) ? nextProps.droppings : [];

  const droppingsEqual = prevDroppings.length === nextDroppings.length &&
    prevDroppings.every((prev, index) => {
      const next = nextDroppings[index];
      return next && prev.droppingId === next.droppingId && prev.songId === next.songId;
    });

  return droppingsEqual;
});

export default MusicWheel;