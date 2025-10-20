import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Icon from '../../../../components/icon/Icon';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { styles } from '../../styles/Running/RunningStats';
import Timer from './Timer';

interface RunningStatsProps {
  isRunning?: boolean;
  headerHeight?: number;
  currentDistance: number;
  timeComponents: { hours: string; minutes: string; seconds: string };
}

const RunningStats: React.FC<RunningStatsProps> = ({
  isRunning = false,
  headerHeight = 68,
  currentDistance,
  timeComponents,
}) => {

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
            <Text style={[styles.statText, TYPOGRAPHY.BODY_1]}>{currentDistance.toFixed(2)}</Text>
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
