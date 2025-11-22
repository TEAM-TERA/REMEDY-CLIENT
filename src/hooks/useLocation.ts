import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';

const useLocation = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    useEffect(() => {
        let watchId: number | null = null;
        async function start() {
          try {
            let enableHighAccuracy = true;

            if (Platform.OS === 'android') {
              const res = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
              ]);
              const fineGranted   = res[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
              const coarseGranted = res[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
              if (!fineGranted && !coarseGranted) {
                Linking.openSettings();
                return;
              }
              enableHighAccuracy = fineGranted;
            } else {
              const auth = await Geolocation.requestAuthorization('whenInUse');
              if (auth !== 'granted') return;
            }

            Geolocation.getCurrentPosition(
              (pos) => {
                setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                console.log(pos.coords.latitude, pos.coords.longitude);
              },
              (error) => {
                console.warn('Location error', error);
                setLocation(null);
              },
              {
                enableHighAccuracy,
                timeout: 8000, // 15초에서 8초로 단축
                maximumAge: 60000, // 1분간 캐시된 위치 허용
                forceRequestLocation: false, // 캐시된 위치 사용 허용
                showLocationDialog: true,
              }
            );

            watchId = Geolocation.watchPosition(
              (pos) => {
                setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
              },
              (err) => console.warn('Watch error', err),
              {
                enableHighAccuracy,
                distanceFilter: 3,
                interval: 2000,
                fastestInterval: 1000,
                showLocationDialog: true,
                useSignificantChanges: false,
              }
            );
          } catch (e) {
            console.error('Permission error', e);
          }
        }

        start();
        return () => {
          if (watchId != null) Geolocation.clearWatch(watchId);
          Geolocation.stopObserving();
        };
    }, []);
    return { location, setLocation };
}

export default useLocation;