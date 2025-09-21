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

  useEffect(() => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    setFormattedTime(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
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
            <Text style={styles.icon}><Icon name="running" /></Text>
          </View>
          <Text style={[styles.statText, TYPOGRAPHY.BODY_1]}>
            {formattedDistance}
          </Text>
          <Text style={[styles.statText, TYPOGRAPHY.BODY_1]}>
            Km
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}><Icon name="running" /></Text>
          </View>
          <Text style={[styles.statText, TYPOGRAPHY.BODY_1]}>
            {formattedTime}
          </Text>
        </View>
      </View>
    </View>
  );
};


export default RunningStats;
