import React, { useState, useEffect } from 'react';
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
  const [formattedTime, setFormattedTime] = useState('00:00:00');
  const [formattedDistance, setFormattedDistance] = useState(distance);
  const [timeComponents, setTimeComponents] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    setFormattedTime(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
    
    setTimeComponents({
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    });
  }, [time]);

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
