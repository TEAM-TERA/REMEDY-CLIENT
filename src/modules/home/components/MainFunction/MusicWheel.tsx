import React, { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
import { musicList } from '../../datas/index';
import { styles } from '../../styles/MainFunction/MusicWheel';
import MusicNode from './MusicNode';
import { VisibleNode } from '../../types/musicList';
import { navigate } from '../../../../navigation';
import DropButton from './DropButton';

const SWIPE_THRESHOLD = 30;
const INVERT_DIRECTION = false;
const sign = INVERT_DIRECTION ? -1 : 1;

function MusicWheel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const totalSongs = musicList.droppings.length;
  const rotation = useSharedValue(0);
  const startRotation = useSharedValue(0);

  const handlerPressDrop = ()=>{
    navigate('Drop');
  }

  const getVisibleNodes = () => {
    const nodes: VisibleNode[] = [];
    for (let slotIndex = 0; slotIndex < 3; slotIndex++) {
      const songIndex = (currentIndex + slotIndex) % totalSongs;
      nodes.push({
        position: {
          angle: 0,
          isMain: slotIndex === 0,
          scale: 1,
          opacity: 1,
        },
        song: musicList.droppings[songIndex],
        slotIndex: slotIndex,
      });
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
        // 제스처 시작 시 현재 rotation 저장
        startRotation.value = rotation.value;
    })
    .onUpdate(event => {
        'worklet';
        // 시작할 때 rotation + 이동 거리
        rotation.value =
        startRotation.value + sign * event.translationX * 0.25;
    })
    .onEnd(event => {
        const drag = sign * event.translationX;
        if (Math.abs(drag) > SWIPE_THRESHOLD) {
            runOnJS(updateIndex)(drag > 0 ? 'next' : 'prev');
        }
    });

  const visibleNodes = getVisibleNodes();

  if (totalSongs === 0) {
    return <View style={styles.container} />;
  }

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={styles.container}>
        <View style={styles.nodeGroup}>
          {visibleNodes.map((node: VisibleNode, index) => (
            <MusicNode
              key={`${node.song.droppingId}-${node.slotIndex}`}
              data={node.song}
              isMain={index === 0}
              index={index}
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
