import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLORS } from '../../constants/colors';
import { MAP_RADIUS, MAP_ZOOM, MAP_STYLE, MARKER_STYLES, GOOGLE_MAPS_API_KEY } from '../../constants/map';
import { Dropping } from '../../modules/home/types/musicList';


interface GoogleMapViewProps {
  droppings: Dropping[];
  currentLocation: { latitude: number, longitude: number };
}

function GoogleMapView({ droppings, currentLocation }: GoogleMapViewProps) {
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const [isMapReady, setIsMapReady] = useState(false);
  const previousLocation = useRef<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    if (isMapReady && webviewRef.current && droppings && droppings.length > 0) {
      const message = JSON.stringify({ type: 'droppings', payload: droppings });
      webviewRef.current.postMessage(message);
    }
  }, [droppings, isMapReady]);

  // 지도 초기화 시 현재 위치로 이동
  useEffect(() => {
    if (isMapReady && webviewRef.current && currentLocation) {
      const message = JSON.stringify({
        type: 'initLocation',
        payload: { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
      });
      webviewRef.current.postMessage(message);
    }
  }, [isMapReady, currentLocation]);

  useEffect(() => {
    if (!isMapReady || !webviewRef.current || !currentLocation) return;

    const prev = previousLocation.current;
    if (prev &&
        Math.abs(prev.latitude - currentLocation.latitude) < 0.000001 &&
        Math.abs(prev.longitude - currentLocation.longitude) < 0.000001) {
      return;
    }

    previousLocation.current = { ...currentLocation };

    const message = JSON.stringify({
      type: 'updateLocation',
      payload: { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
    });
    webviewRef.current.postMessage(message);
  }, [currentLocation, isMapReady]);

  const handleMessage = useCallback((event: any) => {
    const message = event.nativeEvent.data;

    if (message.startsWith('{') && message.endsWith('}')) {
      try {
        const data = JSON.parse(message);

        if (data.type === 'mapReady') {
          setIsMapReady(true);
          return;
        }

        if (data.type === 'markerClick') {
          if (data.action === 'navigateToMusic') {
            (navigation as any).navigate('Music', {
              droppingId: data.payload.droppingId || data.payload.id,
              songId: data.payload.songId || data.payload.song_id,
              title: data.payload.title || '드랍핑 음악',
              artist: data.payload.artist || '알 수 없는 아티스트',
              message: data.payload.content || '',
              location: data.payload.address || data.payload.location || '위치 정보 없음'
            });
          } else if (data.action === 'showDetails') {
            Alert.alert(
              "알림",
              "확인할 수 없는 드랍입니다",
              [{ text: "확인", style: "default" }]
            );
          }
        }
      } catch (e) {
      }
    }
  }, [navigation]);

  const html = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="format-detection" content="telephone=no">
        <meta http-equiv="Permissions-Policy" content="geolocation=*">
        <style>
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry"></script>
        <script>
          var map;
          var mapReady = false;
          var existingMarkers = [];
          var messageQueue = [];
          var lastCenter = null;
          var myLocationMarker;
          
          function initMap() {
            const center = { lat: 37.5665, lng: 126.9780 };

            map = new google.maps.Map(document.getElementById('map'), {
              center,
              zoom: ${MAP_ZOOM},
              minZoom: 6,  // 대한민국 전체 수준 (6~7 정도가 적당)
              maxZoom: 20, // 최대 확대 레벨
              restriction: {
                latLngBounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(33.0, 124.5),  // 남서쪽 (제주도 남서쪽)
                    new google.maps.LatLng(38.7, 131.5)   // 북동쪽 (독도 북동쪽)
                  ),
                  strictBounds: true
                },
              styles: ${JSON.stringify(MAP_STYLE)},
              disableDefaultUI: false,
              mapTypeControl: false,
              streetViewControl: false,
              rotateControl: false,
              scaleControl: false,
              fullscreenControl: false,
              zoomControl: true,
              myLocationEnabled: true,
              gestureHandling: 'greedy'
            });

            // Google Maps 기본 내 위치 기능만 사용

            google.maps.event.addListenerOnce(map, 'idle', function() {
              mapReady = true;
              window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'mapReady' }));
              processQueue();
            });
          }

          function clearDroppings() {
            existingMarkers.forEach(marker => marker.setMap(null));
            existingMarkers = [];
          }

          function createMyLocationMarker(lat, lng) {
            if (myLocationMarker) {
              myLocationMarker.setMap(null);
            }

            myLocationMarker = new google.maps.Marker({
              position: { lat: lat, lng: lng },
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#F3124E',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 1
              },
              zIndex: 1000,
              title: '내 위치'
            });

            console.log('📍 내 위치 마커 생성:', lat, lng);
          }

          function addDroppings(drops) {
            if (!mapReady || !map) return;
            
            clearDroppings();
            
            drops.forEach(function(drop) {
              const dropPosition = new google.maps.LatLng(drop.latitude, drop.longitude);
              const centerPositionDynamic = map.getCenter();
              const distance = google.maps.geometry.spherical.computeDistanceBetween(centerPositionDynamic, dropPosition);
              const radius = ${MAP_RADIUS};

              const iconUrl = distance <= radius 
                ? "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
                  '<svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<g filter="url(#filter0_d_660_1355)">' +
                  '<circle cx="36.8" cy="36.8003" r="17.5" fill="black"/>' +
                  '</g>' +
                  '<g filter="url(#filter1_d_660_1355)">' +
                  '<path d="M43 28.2C43 27.8405 42.8657 27.4999 42.634 27.272C42.4023 27.0441 42.0977 26.9528 41.8039 27.0233L31.8039 29.4233C31.3365 29.5355 31 30.028 31 30.6V41.5366C30.6872 41.4481 30.3506 41.4 30 41.4C28.3431 41.4 27 42.4745 27 43.8C27 45.1255 28.3431 46.2 30 46.2C31.6568 46.2 33 45.1255 33 43.8V33.9838L41 32.0638V39.1366C40.6872 39.0481 40.3506 39 40 39C38.3431 39 37 40.0745 37 41.4C37 42.7255 38.3431 43.8 40 43.8C41.6569 43.8 43 42.7255 43 41.4V28.2Z" fill="#F3124E"/>' +
                  '</g>' +
                  '<defs>' +
                  '<filter id="filter0_d_660_1355" x="-0.699951" y="-0.699707" width="75" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
                  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
                  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>' +
                  '<feOffset/>' +
                  '<feGaussianBlur stdDeviation="10"/>' +
                  '<feComposite in2="hardAlpha" operator="out"/>' +
                  '<feColorMatrix type="matrix" values="0 0 0 0 0.937255 0 0 0 0 0.0627451 0 0 0 0 0.298039 0 0 0 1 0"/>' +
                  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_660_1355"/>' +
                  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_660_1355" result="shape"/>' +
                  '</filter>' +
                  '<filter id="filter1_d_660_1355" x="7" y="7" width="56" height="59.2002" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
                  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
                  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>' +
                  '<feOffset/>' +
                  '<feGaussianBlur stdDeviation="10"/>' +
                  '<feComposite in2="hardAlpha" operator="out"/>' +
                  '<feColorMatrix type="matrix" values="0 0 0 0 0.937255 0 0 0 0 0.0627451 0 0 0 0 0.298039 0 0 0 1 0"/>' +
                  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_660_1355"/>' +
                  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_660_1355" result="shape"/>' +
                  '</filter>' +
                  '</defs>' +
                  '</svg>'
                )
                : "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
                  '<svg width="75" height="75" viewBox="0 0 76 75" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<g filter="url(#filter0_d_660_1369)">' +
                  '<circle cx="37.8" cy="36.8003" r="17.5" fill="#14151C"/>' +
                  '</g>' +
                  '<path d="M44 28.2C44 27.8405 43.8657 27.4999 43.634 27.272C43.4023 27.0441 43.0977 26.9528 42.8039 27.0233L32.8039 29.4233C32.3365 29.5355 32 30.028 32 30.6V41.5366C31.6872 41.4481 31.3506 41.4 31 41.4C29.3431 41.4 28 42.4745 28 43.8C28 45.1255 29.3431 46.2 31 46.2C32.6568 46.2 34 45.1255 34 43.8V33.9838L42 32.0638V39.1366C41.6872 39.0481 41.3506 39 41 39C39.3431 39 38 40.0745 38 41.4C38 42.7255 39.3431 43.8 41 43.8C42.6569 43.8 44 42.7255 44 41.4V28.2Z" fill="#656581"/>' +
                  '<defs>' +
                  '<filter id="filter0_d_660_1369" x="0.300049" y="-0.699707" width="75" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
                  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
                  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>' +
                  '<feOffset/>' +
                  '<feGaussianBlur stdDeviation="10"/>' +
                  '<feComposite in2="hardAlpha" operator="out"/>' +
                  '<feColorMatrix type="matrix" values="0 0 0 0 0.396078 0 0 0 0 0.396078 0 0 0 0 0.505882 0 0 0 1 0"/>' +
                  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_660_1369"/>' +
                  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_660_1369" result="shape"/>' +
                  '</filter>' +
                  '</defs>' +
                  '</svg>'
                );

              const marker = new google.maps.Marker({
                position: { lat: drop.latitude, lng: drop.longitude },
                map: map,
                title: drop.content,
                icon: {
                  url: iconUrl,
                  scaledSize: new google.maps.Size(60, 60)
                },
                zIndex: 10
              });
              
              existingMarkers.push(marker);
              
              marker.addListener('click', function() {
                const isInCircle = distance <= radius;
                if (isInCircle) {
                  window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'markerClick',
                    action: 'navigateToMusic',
                    payload: {
                      droppingId: drop.droppingId,
                      songId: drop.songId,
                      content: drop.content,
                      latitude: drop.latitude,
                      longitude: drop.longitude,
                      address: drop.address,
                    }
                  }));
                } else {
                  window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'markerClick',
                    action: 'showDetails',
                    payload: {
                      droppingId: drop.droppingId,
                      songId: drop.songId,
                      content: drop.content,
                      latitude: drop.latitude,
                      longitude: drop.longitude,
                      address: drop.address,
                    }
                  }));
                }
              });
            });
          }

          function updateLocation(lat, lng) {
            if (!mapReady || !map) return;

            const newPosition = new google.maps.LatLng(lat, lng);

            if (lastCenter &&
                Math.abs(lastCenter.lat - lat) < 0.00001 &&
                Math.abs(lastCenter.lng - lng) < 0.00001) {
              return;
            }

            lastCenter = { lat, lng };

            // 지도 중심을 부드럽게 이동 (Google Maps 기본 기능에 맡기고 중심만 업데이트)
            map.panTo(newPosition);

            existingMarkers.forEach(function(marker) {
              const markerPos = marker.getPosition();
              const distance = google.maps.geometry.spherical.computeDistanceBetween(newPosition, markerPos);
              const radius = ${MAP_RADIUS};
              
              const iconUrl = distance <= radius 
                ? "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
                  '<svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<g filter="url(#filter0_d_660_1355)">' +
                  '<circle cx="36.8" cy="36.8003" r="17.5" fill="black"/>' +
                  '</g>' +
                  '<g filter="url(#filter1_d_660_1355)">' +
                  '<path d="M43 28.2C43 27.8405 42.8657 27.4999 42.634 27.272C42.4023 27.0441 42.0977 26.9528 41.8039 27.0233L31.8039 29.4233C31.3365 29.5355 31 30.028 31 30.6V41.5366C30.6872 41.4481 30.3506 41.4 30 41.4C28.3431 41.4 27 42.4745 27 43.8C27 45.1255 28.3431 46.2 30 46.2C31.6568 46.2 33 45.1255 33 43.8V33.9838L41 32.0638V39.1366C40.6872 39.0481 40.3506 39 40 39C38.3431 39 37 40.0745 37 41.4C37 42.7255 38.3431 43.8 40 43.8C41.6569 43.8 43 42.7255 43 41.4V28.2Z" fill="#F3124E"/>' +
                  '</g>' +
                  '<defs>' +
                  '<filter id="filter0_d_660_1355" x="-0.699951" y="-0.699707" width="75" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
                  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
                  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>' +
                  '<feOffset/>' +
                  '<feGaussianBlur stdDeviation="10"/>' +
                  '<feComposite in2="hardAlpha" operator="out"/>' +
                  '<feColorMatrix type="matrix" values="0 0 0 0 0.937255 0 0 0 0 0.0627451 0 0 0 0 0.298039 0 0 0 1 0"/>' +
                  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_660_1355"/>' +
                  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_660_1355" result="shape"/>' +
                  '</filter>' +
                  '<filter id="filter1_d_660_1355" x="7" y="7" width="56" height="59.2002" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
                  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
                  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>' +
                  '<feOffset/>' +
                  '<feGaussianBlur stdDeviation="10"/>' +
                  '<feComposite in2="hardAlpha" operator="out"/>' +
                  '<feColorMatrix type="matrix" values="0 0 0 0 0.937255 0 0 0 0 0.0627451 0 0 0 0 0.298039 0 0 0 1 0"/>' +
                  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_660_1355"/>' +
                  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_660_1355" result="shape"/>' +
                  '</filter>' +
                  '</defs>' +
                  '</svg>'
                )
                : "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
                  '<svg width="75" height="75" viewBox="0 0 76 75" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<g filter="url(#filter0_d_660_1369)">' +
                  '<circle cx="37.8" cy="36.8003" r="17.5" fill="#14151C"/>' +
                  '</g>' +
                  '<path d="M44 28.2C44 27.8405 43.8657 27.4999 43.634 27.272C43.4023 27.0441 43.0977 26.9528 42.8039 27.0233L32.8039 29.4233C32.3365 29.5355 32 30.028 32 30.6V41.5366C31.6872 41.4481 31.3506 41.4 31 41.4C29.3431 41.4 28 42.4745 28 43.8C28 45.1255 29.3431 46.2 31 46.2C32.6568 46.2 34 45.1255 34 43.8V33.9838L42 32.0638V39.1366C41.6872 39.0481 41.3506 39 41 39C39.3431 39 38 40.0745 38 41.4C38 42.7255 39.3431 43.8 41 43.8C42.6569 43.8 44 42.7255 44 41.4V28.2Z" fill="#656581"/>' +
                  '<defs>' +
                  '<filter id="filter0_d_660_1369" x="0.300049" y="-0.699707" width="75" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
                  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
                  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>' +
                  '<feOffset/>' +
                  '<feGaussianBlur stdDeviation="10"/>' +
                  '<feComposite in2="hardAlpha" operator="out"/>' +
                  '<feColorMatrix type="matrix" values="0 0 0 0 0.396078 0 0 0 0 0.396078 0 0 0 0 0.505882 0 0 0 1 0"/>' +
                  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_660_1369"/>' +
                  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_660_1369" result="shape"/>' +
                  '</filter>' +
                  '</defs>' +
                  '</svg>'
                );
              
              marker.setIcon({
                url: iconUrl,
                scaledSize: new google.maps.Size(60, 60)
              });
            });
          }

          function processMessage(data) {
            if (data.type === 'droppings') {
              if (mapReady && map && data.payload && data.payload.length > 0) {
                addDroppings(data.payload);
              }
            } else if (data.type === 'initLocation') {
              const lat = Number(data.payload?.latitude);
              const lng = Number(data.payload?.longitude);

              if (!isNaN(lat) && !isNaN(lng) && mapReady && map) {
                console.log('🗺️ 지도 초기 위치 설정:', lat, lng);
                const newPosition = new google.maps.LatLng(lat, lng);
                map.setCenter(newPosition);
                map.setZoom(${MAP_ZOOM});
                createMyLocationMarker(lat, lng);
              }
            } else if (data.type === 'updateLocation') {
              const lat = Number(data.payload?.latitude);
              const lng = Number(data.payload?.longitude);

              if (!isNaN(lat) && !isNaN(lng)) {
                updateLocation(lat, lng);
                // 내 위치 마커도 업데이트
                if (myLocationMarker) {
                  myLocationMarker.setPosition(new google.maps.LatLng(lat, lng));
                  console.log('📍 내 위치 마커 업데이트:', lat, lng);
                }
              }
            }
          }

          function processQueue() {
            while (messageQueue.length > 0) {
              const data = messageQueue.shift();
              processMessage(data);
            }
          }

          document.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              
              if (!mapReady) {
                messageQueue.push(data);
              } else {
                processMessage(data);
              }
            } catch (e) {
            }
          });

          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              
              if (!mapReady) {
                messageQueue.push(data);
              } else {
                processMessage(data);
              }
            } catch (e) {
            }
          });

          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `, [GOOGLE_MAPS_API_KEY, MAP_ZOOM, MAP_STYLE, MARKER_STYLES.MY_LOCATION, PRIMARY_COLORS.DEFAULT, MAP_RADIUS]);

  return (
    <WebView
      style={{ flex: 1 }}
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html, baseUrl: 'https://remedy.test' }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      mixedContentMode="always"
      geolocationEnabled={true}
      scrollEnabled={false}
      onMessage={handleMessage}
      startInLoadingState={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      bounces={false}
      decelerationRate="normal"
      renderLoading={() => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a29' }}>
          <ActivityIndicator size="large" color={PRIMARY_COLORS.DEFAULT} />
        </View>
      )}
      onLoadStart={() => console.log('🗺️ Map WebView 로딩 시작')}
      onLoadEnd={() => console.log('🗺️ Map WebView 로딩 완료')}
      onError={(error) => console.error('🗺️ Map WebView 에러:', error.nativeEvent)}
    />
  );
}

export default React.memo(GoogleMapView, (prevProps, nextProps) => {
  const locationChanged = prevProps.currentLocation && nextProps.currentLocation
    ? Math.abs(prevProps.currentLocation.latitude - nextProps.currentLocation.latitude) > 0.000001 ||
      Math.abs(prevProps.currentLocation.longitude - nextProps.currentLocation.longitude) > 0.000001
    : prevProps.currentLocation !== nextProps.currentLocation;

  const droppingsChanged = prevProps.droppings.length !== nextProps.droppings.length ||
    prevProps.droppings.some((prev, index) => {
      const next = nextProps.droppings[index];
      return !next || prev.droppingId !== next.droppingId;
    });

  return !locationChanged && !droppingsChanged;
});