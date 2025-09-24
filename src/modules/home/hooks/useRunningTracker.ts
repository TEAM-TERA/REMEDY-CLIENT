import { useState, useEffect, useRef } from "react";
import Geolocation from 'react-native-geolocation-service';
import calculateDistance from '../../../utils/calculateDistance';
import formatTime from '../../../utils/formatTime';
import { saveRunningRecord } from "../api/runningApi";

interface Location {
    latitude: number;
    longitude: number;
}

interface UseRunningTrackerReturn {
    currentTime: number;
    currentDistance: number;
    timeComponents: { hours: string; minutes: string; seconds: string };
}



const useRunningTracker = (isRunning: boolean): UseRunningTrackerReturn => {
    const [currentTime, setCurrentTime] = useState(0);
    const [currentDistance, setCurrentDistance] = useState(0);
    const [timeComponents, setTimeComponents] = useState({ hours: '00', minutes: '00', seconds: '00' });
    const [startTime, setStartTime] = useState<Date | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const locationWatchId = useRef<number | null>(null);
    const lastLocation = useRef<Location | null>(null);

    const saveRecord = async () => {
        if (!startTime) return;
        try {
          await saveRunningRecord({
            distanceKm: currentDistance,
            durationSec: currentTime,
            songId: ['test', 'test2'],
            startedAt: startTime.toISOString(),
            endedAt: new Date().toISOString()
          });
          console.log('러닝 기록 저장 완료');
        } catch (error) {
          console.error('저장 실패:', error);
        }
    };

    useEffect(() => {
        if (!isRunning && startTime) {
            saveRecord();
        }

        if (isRunning) {
            setStartTime(new Date());
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

    return {
        currentTime,
        currentDistance,
        timeComponents,
    };
}

export default useRunningTracker;