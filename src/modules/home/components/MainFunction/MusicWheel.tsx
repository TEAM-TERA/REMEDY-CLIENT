import React, { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, withDecay } from 'react-native-reanimated';
import { musicList } from '../../datas/index';
import { styles } from '../../styles/MainFunction/MusicWheel';
import MusicNode from './MusicNode';
import { VisibleNode } from '../../types/musicList';
import DropButton from './DropButton';
const SWIPE_THRESHOLD = 30;

function MusicWheel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const totalSongs = musicList.droppings.length;
  const rotation = useSharedValue(0);

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
    .onUpdate((event) => {
      'worklet';
      const deltaX = event.translationX;
      rotation.value += deltaX * 0.1;

      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) {
          runOnJS(updateIndex)('prev');
        } else {
          runOnJS(updateIndex)('next');
        }
      }
    })
    .onEnd((event) => {
      rotation.value = withDecay({
        velocity: event.velocityX * 0.1,
        clamp: [0, 100],
      });
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
          <DropButton onPress={() => console.log('Drop 눌림!')} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export default MusicWheel;
