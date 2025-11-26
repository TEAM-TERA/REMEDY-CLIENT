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

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=ko&zoom=18&extratags=1`
            );
            const data = await response.json();
            console.log('Reverse geocoding 상세 응답:', data);

            if (data && data.address) {
                const { address: addr } = data;
                console.log('주소 파싱 상세:', addr);

                const addressParts = [];
                let dongInfo = '';

                // 1. 도/시/도 (시/도)
                if (addr.state || addr.province) {
                    addressParts.push(addr.state || addr.province);
                }

                // 2. 시/군/구
                if (addr.city || addr.county) {
                    addressParts.push(addr.city || addr.county);
                }

                // 3. 구/군 (더 세부적인)
                if (addr.city_district || addr.borough || addr.suburb) {
                    addressParts.push(addr.city_district || addr.borough || addr.suburb);
                }

                // 4. 동/면/읍 정보 저장 (나중에 괄호로 추가)
                if (addr.quarter || addr.neighbourhood || addr.village || addr.town || addr.hamlet) {
                    dongInfo = addr.quarter || addr.neighbourhood || addr.village || addr.town || addr.hamlet;
                }

                // 5. 도로명/길
                if (addr.road || addr.pedestrian || addr.street || addr.path) {
                    addressParts.push(addr.road || addr.pedestrian || addr.street || addr.path);
                }

                // 6. 건물번호/번지
                if (addr.house_number) {
                    addressParts.push(addr.house_number);
                }

                // 7. 동 정보를 괄호로 추가
                if (dongInfo) {
                    addressParts.push(`(${dongInfo})`);
                }

                // 8. 건물명이나 상호명 (있다면, 동 정보와 다를 경우에만)
                if (addr.amenity || addr.shop || addr.building) {
                    const buildingInfo = addr.amenity || addr.shop || addr.building;
                    if (typeof buildingInfo === 'string' && buildingInfo.length > 0 && buildingInfo !== dongInfo) {
                        addressParts.push(`[${buildingInfo}]`);
                    }
                }

                const formattedAddress = addressParts.filter(Boolean).join(' ');

                console.log('주소 조합 결과:', {
                    original: data.display_name,
                    formatted: formattedAddress,
                    parts: addressParts,
                    allAddressData: addr
                });

                // 더 상세한 주소가 있으면 사용, 없으면 원본 display_name 사용
                const finalAddress = formattedAddress || data.display_name || "위치 정보를 가져올 수 없습니다";
                setAddress(finalAddress);
            } else {
                console.warn('주소 데이터 없음');
                setAddress("위치 정보를 가져올 수 없습니다");
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