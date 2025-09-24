import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Icon from '../../../../components/icon/Icon';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { styles } from '../../styles/Running/RunningStats';
import Geolocation from 'react-native-geolocation-service';
import calculateDistance from '../../../../utils/calculateDistance';

interface RunningStatsProps {
  distance?: number;
  time?: number;
  isRunning?: boolean;
  headerHeight?: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

const RunningStats: React.FC<RunningStatsProps> = ({ 
  distance = 0, 
  time = 0, 
  isRunning = false,
  headerHeight = 68
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [timeComponents, setTimeComponents] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationWatchId = useRef<number | null>(null);
  const lastLocation = useRef<Location | null>(null);

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

  useEffect(() => {
    if (isRunning) {
      setCurrentTime(0);
      setCurrentDistance(0);
      lastLocation.current = null;

      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);

      locationWatchId.current = Geolocation.watchPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          if (lastLocation.current) {
            const distanceInMeters = calculateDistance(
              lastLocation.current.latitude,
              lastLocation.current.longitude,
              newLocation.latitude,
              newLocation.longitude
            );
            setCurrentDistance(prev => prev + (distanceInMeters / 1000));
          }

          lastLocation.current = newLocation;
        },
        (error) => {
          console.log('위치 추적 에러:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
          interval: 1000,
        }
      );
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (locationWatchId.current) {
        Geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
      }

      setCurrentTime(0);
      setCurrentDistance(0);
      lastLocation.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (locationWatchId.current) {
        Geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, [isRunning]);

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
