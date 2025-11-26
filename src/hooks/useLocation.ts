import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';

const useLocation = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [address, setAddress] = useState<string>("");

    console.log('useLocation state:', { location, address });

    const getAddressFromCoords = async (latitude: number, longitude: number) => {
        try {
            console.log('Reverse geocoding 시작:', { latitude, longitude });
            // Nominatim API를 사용한 reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=ko`
            );
            const data = await response.json();
            console.log('Reverse geocoding 응답:', data);

            if (data && data.address) {
                const { address: addr } = data;
                // 한국 주소 형식으로 조합 (더 상세하게)
                const parts = [
                    addr.state || addr.province,  // 도/시
                    addr.city || addr.town || addr.village || addr.county,  // 시/군/구
                    addr.borough || addr.city_district || addr.suburb || addr.neighbourhood,  // 구/동
                    addr.road || addr.pedestrian || addr.street,  // 도로명
                    addr.house_number  // 번지
                ].filter(Boolean);

                const formattedAddress = parts.join(' ');
                console.log('Reverse geocoding result:', {
                    original: data.display_name,
                    formatted: formattedAddress,
                    addressParts: addr
                });
                setAddress(formattedAddress || data.display_name);
            }
        } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            setAddress("위치 정보를 가져올 수 없습니다");
        }
    };
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
                console.warn('위치 권한이 거부되었습니다. 기본 주소를 사용합니다.');
                setAddress("서울특별시 중구 세종대로 110");
                Linking.openSettings();
                return;
              }
              enableHighAccuracy = fineGranted;
            } else {
              const auth = await Geolocation.requestAuthorization('whenInUse');
              if (auth !== 'granted') {
                console.warn('iOS 위치 권한이 거부되었습니다. 기본 주소를 사용합니다.');
                setAddress("서울특별시 중구 세종대로 110");
                return;
              }
            }

            Geolocation.getCurrentPosition(
              (pos) => {
                const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                setLocation(coords);
                getAddressFromCoords(coords.latitude, coords.longitude);
                console.log('GPS 위치 가져오기 성공:', pos.coords.latitude, pos.coords.longitude);
              },
              (error) => {
                console.warn('GPS 위치 가져오기 실패:', error);
                console.warn('기본 위치(서울시청)를 사용합니다.');
                setLocation(null);
                // 기본 주소로 설정
                setAddress("서울특별시 중구 세종대로 110");
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
                const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                setLocation(coords);
                getAddressFromCoords(coords.latitude, coords.longitude);
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
    return { location, address, setLocation };
}

export default useLocation;