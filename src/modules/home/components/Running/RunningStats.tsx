import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Icon from '../../../../components/icon/Icon';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { styles } from '../../styles/Running/RunningStats';
import Timer from './Timer';
import useRunningTracker from '../../hooks/useRunningTracker';

interface RunningStatsProps {
  distance?: number;
  time?: number;
  isRunning?: boolean;
  headerHeight?: number;
}

const RunningStats: React.FC<RunningStatsProps> = ({
  isRunning = false,
  headerHeight = 68
}) => {
  const { currentDistance, currentTime, timeComponents } = useRunningTracker(isRunning);

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
              {currentDistance.toFixed(2)}
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
          <Timer timeComponents={timeComponents} />
        </View>
      </View>
    </View>
  );
};


export default RunningStats;
