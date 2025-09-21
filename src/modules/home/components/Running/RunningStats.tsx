import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Icon from '../../../../components/icon/Icon';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { styles } from '../../styles/Running/RunningStats';

interface RunningStatsProps {
  distance?: number;
  time?: number;
  isRunning?: boolean;
  headerHeight?: number;
}

const RunningStats: React.FC<RunningStatsProps> = ({ 
  distance = 0, 
  time = 0, 
  isRunning = false,
  headerHeight = 68
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [formattedDistance, setFormattedDistance] = useState(distance);
  const [timeComponents, setTimeComponents] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 시간 포맷팅 함수
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  // isRunning이 변경될 때마다 타이머 시작/정지 및 초기화
  useEffect(() => {
    if (isRunning) {
      // 타이머 시작
      setCurrentTime(0); // 초기화
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else {
      // 타이머 정지 및 초기화
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentTime(0);
    }

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // currentTime이 변경될 때마다 timeComponents 업데이트
  useEffect(() => {
    setTimeComponents(formatTime(currentTime));
  }, [currentTime]);

  const dynamicStyles = {
    ...styles.container,
    top: headerHeight + 8,
  };

  return (
    <View style={dynamicStyles}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <Icon name="turnRunning" />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.statText, TYPOGRAPHY.BODY_1]}>
              {formattedDistance}
            </Text>
            <Text style={[styles.statTextGray, TYPOGRAPHY.BODY_1]}>
              Km
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <Icon name="clock" />
          </View>
          <View style={styles.textContainer}>
            <Text style={[
              parseInt(timeComponents.hours) > 0 ? styles.statText : styles.statTextGray, 
              TYPOGRAPHY.BODY_1
            ]}>
              {timeComponents.hours}
            </Text>
            <Text style={[styles.statTextGray, TYPOGRAPHY.BODY_1]}>
              :
            </Text>
            <Text style={[
              parseInt(timeComponents.minutes) > 0 ? styles.statText : styles.statTextGray, 
              TYPOGRAPHY.BODY_1
            ]}>
              {timeComponents.minutes}
            </Text>
            <Text style={[styles.statTextGray, TYPOGRAPHY.BODY_1]}>
              :
            </Text>
            <Text style={[
              parseInt(timeComponents.seconds) > 0 ? styles.statText : styles.statTextGray, 
              TYPOGRAPHY.BODY_1
            ]}>
              {timeComponents.seconds}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};


export default RunningStats;
