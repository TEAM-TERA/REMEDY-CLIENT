import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
// import { musicList } from '../../datas/index';
import { styles } from '../../styles/MainFunction/MusicWheel';
import MusicNode from './MusicNode';
import { VisibleNode } from '../../types/musicList';
import { navigate } from '../../../../navigation';
import DropButton from './DropButton';
import { useQuery } from '@tanstack/react-query';
import { getSongInfo } from '../../../drop/api/dropApi';
import { Dropping } from '../../types/musicList';

const SWIPE_THRESHOLD = 30;
const INVERT_DIRECTION = false;
const sign = INVERT_DIRECTION ? -1 : 1;

interface MusicWheelProps {
  droppings: any[];
}

function MusicWheel({ droppings }: MusicWheelProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const totalSongs = droppings?.length || 0;
  const rotation = useSharedValue(0);

  const song1Query = useQuery({
    queryKey: ['songInfo', droppings?.[0]?.songId],
    queryFn: () => getSongInfo(droppings[0].songId),
    enabled: !!(droppings?.[0]?.songId),
  });
  
  const song2Query = useQuery({
    queryKey: ['songInfo', droppings?.[1]?.songId],
    queryFn: () => getSongInfo(droppings[1].songId),
    enabled: !!(droppings?.[1]?.songId),
  });
  
  const song3Query = useQuery({
    queryKey: ['songInfo', droppings?.[2]?.songId],
    queryFn: () => getSongInfo(droppings[2].songId),
    enabled: !!(droppings?.[2]?.songId),
  });
  
  const songQueries = [song1Query, song2Query, song3Query];
  const startRotation = useSharedValue(0);

  const handlerPressDrop = ()=>{
    navigate('Drop');
  }

  const getVisibleNodes = () => {
    const nodes: VisibleNode[] = [];
    if (!droppings || droppings.length === 0) {
      return nodes;
    }
    
    for (let slotIndex = 0; slotIndex < 3; slotIndex++) {
      const songIndex = (currentIndex + slotIndex) % totalSongs;
      if (droppings[songIndex]) {
        const songInfo = songQueries[songIndex]?.data;
        
        nodes.push({
          position: {
            angle: 0,
            isMain: slotIndex === 0,
            scale: 1,
            opacity: 1,
          },
          song: {
            dropping: droppings[songIndex],
            songInfo: songInfo
          } as any,
          slotIndex: slotIndex,
        });
      }
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
        startRotation.value = rotation.value;
    })
    .onUpdate(event => {
        'worklet';
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
