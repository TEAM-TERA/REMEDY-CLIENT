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
  onDroppingChange?: (droppingId: string | undefined) => void;
}

const MusicWheel = React.memo(function MusicWheel({ droppings, onDroppingChange }: MusicWheelProps) {
  const safeDroppings = Array.isArray(droppings) ? droppings : [];

  // MUSIC 타입만 필터링 (VOTE 타입 제외)
  const musicDroppings = React.useMemo(() => {
    return safeDroppings.filter(dropping => {
      if (!dropping.type) {
        console.warn('⚠️ MusicWheel: Missing type field for dropping:', dropping.droppingId);
        return false;
      }
      const dropType = String(dropping.type).toUpperCase();
      return dropType === 'MUSIC';
    });
  }, [safeDroppings]);

  const totalSongs = musicDroppings.length;
  const gestureOffset = useSharedValue(0);
  const [rotationDeg, setRotationDeg] = useState(persistedRotation);
  const rotationShared = useSharedValue(persistedRotation);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [showDropOptions, setShowDropOptions] = useState<boolean>(false);
  const { playIfDifferent, setCurrentId } = usePlayerStore();
  const { location, address } = useLocation();

  const currentLocation = location ?? { latitude: 37.5665, longitude: 126.9780 };
  const currentAddress = address || "부산광역시 강서구 가락대로 73";

  // 현재 선택된 인덱스를 rotation 기반으로 계산
  const currentMusicIndex = useMemo(() => {
    if (totalSongs === 0) return 0;
    const rotationSteps = Math.round(rotationDeg / ANGLE_PER_ITEM);
    // 음수 회전값도 올바르게 처리하도록 수정
    return (((-rotationSteps) % totalSongs) + totalSongs) % totalSongs;
  }, [rotationDeg, totalSongs]);

  // 현재 선택된 드랍핑 정보
  const currentDropping = musicDroppings[currentMusicIndex];
  const currentDroppingId = currentDropping?.droppingId;

  // rotation 값 동기화
  useEffect(() => {
    rotationShared.value = rotationDeg;
    persistedRotation = rotationDeg;
  }, [rotationDeg, rotationShared]);

  // 전역 인덱스 업데이트
  useEffect(() => {
    persistedIndex = currentMusicIndex;
  }, [currentMusicIndex]);

  // 선택된 드랍핑 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onDroppingChange?.(currentDroppingId);
  }, [currentDroppingId, onDroppingChange]);

  // 앱 진입 시 첫 번째 음악 자동 재생
  useEffect(() => {
    if (totalSongs > 0 && musicDroppings.length > 0) {
      const firstDropping = musicDroppings[0];
      // 현재 재생중이 아니고 rotation이 0일 때 (초기 상태)
      if (firstDropping?.songId && rotationDeg === 0) {
        console.log('🎵 앱 진입: 첫 번째 음악 자동 재생', firstDropping.title);
        playIfDifferent(firstDropping.songId, {
          title: firstDropping.title || '음악',
          artist: firstDropping.singer || '알 수 없음',
          artwork: undefined,
        });
        setCurrentId(firstDropping.songId);
      }
    }
  }, [totalSongs, musicDroppings, rotationDeg, playIfDifferent, setCurrentId]);

  const commitRotationStep = React.useCallback((targetStep: number) => {
    if (totalSongs === 0) return;

    const targetRotation = targetStep * ANGLE_PER_ITEM;
    setRotationDeg(targetRotation);

    // 새로운 로테이션 값으로 선택된 음악이 바뀌면 재생
    const newMusicIndex = (((-targetStep) % totalSongs) + totalSongs) % totalSongs;
    const targetDropping = musicDroppings[newMusicIndex];

    if (targetDropping?.songId) {
      playIfDifferent(targetDropping.songId, {
        title: targetDropping.title || '음악',
        artist: targetDropping.singer || '알 수 없음',
        artwork: undefined,
      });
      setCurrentId(targetDropping.songId);
    }
  }, [totalSongs, musicDroppings, playIfDifferent, setCurrentId]);

  useEffect(() => {
    if (__DEV__) {
      console.log('🎵 MusicWheel State:', {
        musicCount: musicDroppings.length,
        totalDroppings: safeDroppings.length,
        currentMusicIndex,
        currentDroppingId,
        rotationDeg,
        isSwiping,
        currentMusic: currentDropping ? {
          title: currentDropping.title,
          artist: currentDropping.singer
        } : null
      });
    }
  }, [musicDroppings, safeDroppings, currentMusicIndex, currentDroppingId, rotationDeg, isSwiping, currentDropping]);

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

  // 메인 노드 인덱스 계산 - 실제 회전 기반으로 계산
  const mainNodeIndex = useDerivedValue(() => {
    'worklet';
    if (totalSongs === 0) return 0;

    // 현재 rotation에서 메인 위치(-90도, 위쪽 중앙)에 있는 노드를 찾기
    const baseRotationValue = rotationShared.value || 0;
    const rotationValue = gestureOffset.value || 0;
    const totalRotation = baseRotationValue + rotationValue;

    // 어떤 슬롯이 메인 위치(-90도)에 가장 가까운지 계산
    const steps = Math.round(totalRotation / ANGLE_PER_ITEM);
    const mainSlot = ((-steps % TOTAL_NODES) + TOTAL_NODES) % TOTAL_NODES;

    return mainSlot;
  }, [totalSongs]);

  const visibleEntries = React.useMemo(() => {
    const entries: { songId: string; droppingId: string; dataIndex: number; slotIndex: number }[] = [];

    if (showDropOptions) {
      // 드랍 옵션 모드
      const maxNodes = Math.min(TOTAL_NODES, displayTotalSongs);
      for (let slotIndex = 0; slotIndex < maxNodes; slotIndex++) {
        const drop = displayData[slotIndex];
        if (drop) {
          entries.push({
            songId: drop.songId || drop.type || String(slotIndex),
            droppingId: String(drop.droppingId ?? slotIndex),
            dataIndex: slotIndex,
            slotIndex,
          });
        }
      }
    } else {
      // 일반 음악 모드 - 모든 8개 슬롯에 대해 순차 반복으로 엔트리 생성
      for (let slotIndex = 0; slotIndex < TOTAL_NODES; slotIndex++) {
        if (totalSongs > 0) {
          const dataIndex = slotIndex % totalSongs; // 순차 반복
          const drop = musicDroppings[dataIndex];

          if (drop) {
            entries.push({
              songId: drop.songId || String(dataIndex),
              droppingId: String(drop.droppingId ?? dataIndex),
              dataIndex,
              slotIndex,
            });
          }
        }
      }
    }

    return entries;
  }, [displayData, displayTotalSongs, showDropOptions, totalSongs, musicDroppings]);

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

  // 빈 노드 클릭 시 첫 번째로 돌아가는 함수
  const handleEmptyNodeClick = React.useCallback(() => {
    if (totalSongs === 0) return;

    console.log('🎵 빈 노드 클릭: 첫 번째 음악으로 이동');
    const targetRotation = 0; // 첫 번째 위치
    setRotationDeg(targetRotation);
    rotationShared.value = withSpring(targetRotation, {
      damping: 20,
      stiffness: 150,
      mass: 1.2,
    });

    // 첫 번째 음악 재생
    const firstDropping = musicDroppings[0];
    if (firstDropping?.songId) {
      playIfDifferent(firstDropping.songId, {
        title: firstDropping.title || '음악',
        artist: firstDropping.singer || '알 수 없음',
        artwork: undefined,
      });
      setCurrentId(firstDropping.songId);
    }
  }, [totalSongs, musicDroppings, playIfDifferent, setCurrentId, rotationShared]);

  const visibleNodes = React.useMemo(() => {
    const nodes: VisibleNode[] = [];

    // 드랍 옵션 모드일 때
    if (showDropOptions) {
      for (let idx = 0; idx < visibleEntries.length; idx++) {
        const entry = visibleEntries[idx];
        const dropping = displayData[entry.dataIndex];
        if (!dropping) continue;

        let baseAngle;
        switch (entry.slotIndex) {
          case 0: baseAngle = -98; break;
          case 1: baseAngle = -142; break;
          case 2: baseAngle = -194; break;
          default: baseAngle = -90; break;
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
            songInfo: null,
            isDropOption: true
          } as any,
          slotIndex: entry.slotIndex,
        });
      }
    } else {
      // 일반 음악 모드일 때 - 모든 TOTAL_NODES 슬롯을 음악으로 채움
      for (let slotIndex = 0; slotIndex < TOTAL_NODES; slotIndex++) {
        const baseAngle = slotIndex * ANGLE_PER_ITEM - 90;

        // 음악이 있으면 순차적으로 반복해서 슬롯 채우기
        let dropping = null;
        let actualMusicIndex = 0;

        if (totalSongs > 0) {
          actualMusicIndex = slotIndex % totalSongs; // 1~4가 있으면 1,2,3,4,1,2,3,4로 반복
          dropping = musicDroppings[actualMusicIndex];
        }

        let songInfo = null;
        if (dropping) {
          const entryIdx = visibleEntries.findIndex(e => e.slotIndex === slotIndex);
          if (entryIdx >= 0 && songQueries[entryIdx]?.data) {
            songInfo = songQueries[entryIdx].data;
          }
        }

        // 메인 노드는 메인 슬롯 위치에 있는 노드 (회전과 무관하게 슬롯 기준)
        const isMainNode = slotIndex === 0; // 첫 번째 슬롯이 항상 메인 (회전으로 위치가 변경됨)

        // 음악이 없는 경우에만 빈 슬롯 처리
        if (totalSongs === 0) {
          nodes.push({
            position: {
              angle: baseAngle,
              isMain: false,
              scale: 1,
              opacity: 0.3,
            },
            song: {
              dropping: null,
              songInfo: null,
              isDropOption: false,
              isEmpty: true,
              onEmptyClick: handleEmptyNodeClick
            } as any,
            slotIndex: slotIndex,
          });
        } else {
          // 음악이 있으면 순차 반복으로 채움
          nodes.push({
            position: {
              angle: baseAngle,
              isMain: !!isMainNode,
              scale: 1,
              opacity: 1,
            },
            song: {
              dropping: dropping,
              songInfo: songInfo,
              isDropOption: false,
              isEmpty: false
            } as any,
            slotIndex: slotIndex,
          });
        }
      }
    }

    return nodes;
  }, [displayData, visibleEntries, songQueries, showDropOptions, currentMusicIndex, totalSongs, musicDroppings, handleEmptyNodeClick]);

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
                key={`${(node.song as any).dropping.droppingId}-${node.slotIndex}-${showDropOptions ? 'drop' : currentMusicIndex}`}
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