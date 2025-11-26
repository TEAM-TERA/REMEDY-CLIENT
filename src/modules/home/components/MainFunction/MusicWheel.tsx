import React, { useEffect, useMemo, useState, useRef } from 'react';
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
import { usePlayerStore } from '../../../../stores/playerStore';
import useLocation from '../../../../hooks/useLocation';

let persistedRotation = 0;
let persistedIndex = 0;

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
  const { playIfDifferent, setCurrentId, currentId } = usePlayerStore();
  const { location, address } = useLocation();

  // 위치 정보를 기본값으로 설정 (서울시청)
  const currentLocation = location ?? { latitude: 37.5665, longitude: 126.9780 };
  // 테스트용 실제 주소 (실제 위치 서비스가 안 될 때)
  const currentAddress = address || "부산광역시 기장군 가락대로 123"; // 실제 주소 또는 기본 주소

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
  }, [musicDroppings, totalSongs]);

  useEffect(() => {
    rotationShared.value = rotationDeg;
    persistedRotation = rotationDeg;
  }, [rotationDeg, rotationShared]);

  const playByIndex = React.useCallback((index: number) => {
    // Get current musicDroppings to avoid dependency issue
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

    // Use the most current musicDroppings reference
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

  // visibleEntries와 songQueries는 displayData 이후로 이동됨

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
    .enabled(!showDropOptions) // 드랍 옵션 모드에서는 제스처 비활성화
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
        const dragDeg = drag * 0.8;

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

  const callbackEqual = prevProps.onDroppingChange === nextProps.onDroppingChange;

  return droppingsEqual && callbackEqual;
});

export default MusicWheel;
