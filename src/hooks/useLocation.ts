import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';
import Config from 'react-native-config';

const useLocation = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [address, setAddress] = useState<string>("");

    console.log('useLocation state:', { location, address });

    const getAddressFromCoords = async (latitude: number, longitude: number) => {
        try {
            console.log('Google Reverse geocoding 시작:', { latitude, longitude });

            const googleApiKey = Config.GOOGLE_MAPS_API_KEY;
            if (!googleApiKey) {
                console.warn('Google API Key가 없습니다.');
                setAddress("위치 정보를 가져올 수 없습니다");
                return;
            }

            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}&language=ko&region=kr`
            );
            const data = await response.json();
            console.log('Google Geocoding 응답:', data);

            if (data.status === 'OK' && data.results && data.results.length > 0) {
                // 첫 번째 결과에서 formatted_address 사용
                const result = data.results[0];
                const formattedAddress = result.formatted_address;

                // 한국 주소에서 불필요한 부분 제거 (우편번호, 대한민국 등)
                const cleanAddress = formattedAddress
                    .replace(/대한민국\s*/g, '')
                    .replace(/\d{5}\s*/g, '') // 우편번호 제거
                    .trim();

                console.log('Google 주소 결과:', {
                    original: formattedAddress,
                    cleaned: cleanAddress,
                    allResults: data.results
                });

                setAddress(cleanAddress || "위치 정보를 가져올 수 없습니다");
            } else {
                console.warn('Google Geocoding 실패:', data.status, data.error_message);

                // Google API 실패 시 fallback으로 OpenStreetMap 사용
                console.log('Fallback to OpenStreetMap...');
                const osmResponse = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=ko&zoom=18`
                );
                const osmData = await osmResponse.json();

                if (osmData && osmData.display_name) {
                    const osmAddress = osmData.display_name
                        .split(',')
                        .slice(0, 4) // 상위 4개 요소만 사용
                        .reverse()
                        .join(' ')
                        .trim();
                    setAddress(osmAddress || "위치 정보를 가져올 수 없습니다");
                } else {
                    setAddress("위치 정보를 가져올 수 없습니다");
                }
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

            if (Platform.OS === 'android') {
              const res = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
              ]);
              const fineGranted   = res[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
              const coarseGranted = res[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
              if (!fineGranted && !coarseGranted) {
                console.warn('위치 권한이 거부되었습니다. 위치를 가져올 수 없습니다.');
                setAddress("위치 권한이 필요합니다");
                Linking.openSettings();
                return;
              }
            } else {
              const auth = await Geolocation.requestAuthorization('whenInUse');
              if (auth !== 'granted') {
                console.warn('iOS 위치 권한이 거부되었습니다. 위치를 가져올 수 없습니다.');
                setAddress("위치 권한이 필요합니다");
                return;
              }
            }

            Geolocation.getCurrentPosition(
              (pos) => {
                const coords = {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude
                };
                setLocation(coords);
                getAddressFromCoords(coords.latitude, coords.longitude);
                console.log('GPS 위치 가져오기 성공:', {
                  coords,
                  accuracy: pos.coords.accuracy,
                  timestamp: new Date(pos.timestamp).toLocaleString()
                });
              },
              (error) => {
                console.warn('GPS 위치 가져오기 실패:', error);
                console.warn('위치 정보를 가져올 수 없습니다.');
                setLocation(null);
                setAddress("위치 정보를 가져올 수 없습니다");
              },
              {
                enableHighAccuracy: true, // 항상 고정밀 모드
                timeout: 15000, // 더 충분한 시간으로 변경
                maximumAge: 30000, // 30초로 단축하여 더 최신 위치 사용
                distanceFilter: 0, // 모든 위치 변화 감지
              }
            );

            watchId = Geolocation.watchPosition(
              (pos) => {
                const coords = {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude
                };
                setLocation(coords);
                getAddressFromCoords(coords.latitude, coords.longitude);
                console.log('Watch 위치 업데이트:', {
                  coords,
                  accuracy: pos.coords.accuracy,
                  timestamp: new Date(pos.timestamp).toLocaleString()
                });
              },
              (err) => console.warn('Watch position error:', err),
              {
                enableHighAccuracy: true,
                distanceFilter: 1, // 1미터 이상 이동시에만 업데이트 (더 정밀)
                interval: 5000, // 5초마다 체크
                fastestInterval: 2000, // 최소 2초 간격
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