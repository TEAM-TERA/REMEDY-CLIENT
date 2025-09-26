import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';

const useLocation = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    useEffect(() => {
        async function requestLocation() {
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
                timeout: 15000,
                maximumAge: 10000,
                forceRequestLocation: true,     
                showLocationDialog: true,     
              }
            );
          } catch (e) {
            console.error('Permission error', e);
          }
        }
        requestLocation();
    }, []);
    return { location, setLocation };
}

export default useLocation;