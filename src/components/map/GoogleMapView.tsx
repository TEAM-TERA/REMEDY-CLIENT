import React, { useEffect, useRef, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLORS } from '../../constants/colors';
import { MAP_RADIUS, MAP_ZOOM, MAP_STYLE, MARKER_STYLES, GOOGLE_MAPS_API_KEY } from '../../constants/map';
import { Dropping } from '../../modules/home/types/musicList';


interface GoogleMapViewProps {
  droppings: Dropping[];
  currentLocation: { latitude: number, longitude: number };
  currentPlayingDroppingId?: string | number;
}

const GoogleMapView = forwardRef<any, GoogleMapViewProps>(({ droppings, currentLocation, currentPlayingDroppingId }, ref) => {
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const [isMapReady, setIsMapReady] = useState(false);
  const previousLocation = useRef<{ latitude: number, longitude: number } | null>(null);

  // ref를 통해 postMessage 메소드 노출
  useImperativeHandle(ref, () => ({
    postMessage: (message: string) => {
      if (webviewRef.current) {
        webviewRef.current.postMessage(message);
      }
    }
  }));

  useEffect(() => {
  }, [currentPlayingDroppingId]);

  useEffect(() => {
    if (webviewRef.current && droppings) {
      console.log('React Native -> WebView 데이터 전송:', {
        droppings: droppings.length,
        currentPlayingDroppingId: currentPlayingDroppingId
      });
      const message = JSON.stringify({
        type: 'droppings',
        payload: droppings,
        currentPlayingDroppingId: currentPlayingDroppingId != null ? String(currentPlayingDroppingId) : null
      });
      webviewRef.current.postMessage(message);
    }
  }, [droppings, currentPlayingDroppingId]);

  useEffect(() => {
    console.log('[SYNC] useEffect 트리거됨:', {
      currentPlayingDroppingId,
      isMapReady,
      hasWebviewRef: !!webviewRef.current
    });

    if (webviewRef.current && currentPlayingDroppingId != null) {
      const timestamp = new Date().toISOString();
      console.log('[SYNC] 강제 메시지 전송 시도:', {
        timestamp,
        newCurrentPlayingDroppingId: currentPlayingDroppingId,
        isMapReady,
        hasWebviewRef: !!webviewRef.current
      });
      const message = JSON.stringify({
        type: 'updateCurrentDropping',
        currentPlayingDroppingId: String(currentPlayingDroppingId),
        timestamp
      });

      try {
        webviewRef.current.postMessage(message);
        console.log('[SYNC] 강제 메시지 전송 성공');
      } catch (error) {
        console.error('[SYNC] 강제 메시지 전송 실패:', error);
      }
    }
  }, [currentPlayingDroppingId, isMapReady]);

  useEffect(() => {
    if (webviewRef.current && currentLocation) {
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
    const rawMessage = event.nativeEvent.data;
    try {
      const message = typeof rawMessage === 'string' ? rawMessage.trim() : rawMessage;
      const data = typeof message === 'string' ? JSON.parse(message) : message;

      if (!data || typeof data !== 'object') {
        return;
      }

      if (data.type === 'mapReady') {
        console.log('[MAP] mapReady 수신됨 - setIsMapReady(true) 호출');
        setIsMapReady(true);
        return;
      }

      if (data.type === 'debug') {
        return;
      }

      if (data.type === 'markerClick') {
        console.log('마커 클릭됨:', data.action, data.payload);
        const payloadDroppingId = data.payload?.droppingId || data.payload?.id;
        if (data.action === 'navigateToMusic') {
          (navigation as any).navigate('Music', {
            droppingId: data.payload.droppingId || data.payload.id,
            songId: data.payload.songId || data.payload.song_id,
            title: data.payload.title || '드랍핑 음악',
            artist: data.payload.artist || '알 수 없는 아티스트',
            message: data.payload.content || '',
            location: data.payload.address || data.payload.location || '위치 정보 없음',
            isMyDropping: data.payload.isMyDropping || false
          });
        } else if (data.action === 'navigateToDebate') {
          // DebateScreen으로 이동 (VOTE 드랍핑)
          console.log('DebateScreen 네비게이션 시도:', data.payload);
          const debateDroppingId = payloadDroppingId;
          if (!debateDroppingId) {
            console.warn('DebateScreen 네비게이션 실패: droppingId 없음');
            return;
          }
          try {
            (navigation as any).navigate('DebateScreen', {
              droppingId: String(debateDroppingId),
              content: data.payload.content,
              location: data.payload.address || '위치 정보 없음'
            });
            console.log('DebateScreen 네비게이션 성공');
          } catch (error) {
            console.error('DebateScreen 네비게이션 실패:', error);
          }
        } else if (data.action === 'navigateToPlaylist') {
          // PlaylistDetail로 이동 (PLAYLIST 드랍핑)
          console.log('PlaylistDetail 네비게이션 시도:', data.payload);
          const playlistDroppingId = payloadDroppingId;
          if (!playlistDroppingId) {
            console.warn('PlaylistDetail 네비게이션 실패: droppingId 없음');
            return;
          }
          try {
            (navigation as any).navigate('PlaylistDetail', {
              droppingId: String(playlistDroppingId)
            });
            console.log('PlaylistDetail 네비게이션 성공');
          } catch (error) {
            console.error('PlaylistDetail 네비게이션 실패:', error);
          }
        } else if (data.action === 'showDetails') {
          if ((data.payload?.type || '').toUpperCase() === 'VOTE' && payloadDroppingId) {
            console.log('원 밖 클릭이지만 DebateScreen 이동 시도');
            (navigation as any).navigate('DebateScreen', {
              droppingId: String(payloadDroppingId),
              content: data.payload.content,
              location: data.payload.address || '위치 정보 없음'
            });
          }
        }
      }
    } catch (e) {
      console.warn('WebView 메시지 파싱 실패:', rawMessage, e);
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
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=geometry" async defer></script>
        <script>
          var map;
          var mapReady = false;
          var existingMarkers = [];
          var messageQueue = [];
          var lastCenter = null;
          var myLocationMarker;
          var currentPlayingDroppingId = null;
          var nowPlayingCardElement = null;
          var currentSongData = null;
          
          function initMap() {
            const center = { lat: 37.5665, lng: 126.9780 };

            map = new google.maps.Map(document.getElementById('map'), {
              center,
              zoom: ${MAP_ZOOM},
              minZoom: 6,
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


            google.maps.event.addListenerOnce(map, 'idle', function() {
              mapReady = true;
              console.log('[WebView] Google Maps idle 이벤트 발생 - mapReady 메시지 전송 시도');

              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
                console.log('[WebView] mapReady 메시지 전송 성공');
              } else {
                console.error('[WebView] ReactNativeWebView가 없음');
              }

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

            console.log('내 위치 마커 생성:', lat, lng);
          }

          function updateAllMarkersForCurrentSong(newCurrentPlayingDroppingId) {
            existingMarkers.forEach(function(marker) {
              marker.setIcon({
                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
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
                ),
                scaledSize: new google.maps.Size(60, 60)
              });
              marker.setZIndex(100);
            });

            if (newCurrentPlayingDroppingId) {
              let foundMatch = false;
              let debugInfo = [];

              existingMarkers.forEach(function(marker, index) {
                const droppingData = marker.droppingData;
                if (droppingData) {
                  const dropMatch = String(droppingData.droppingId) === String(newCurrentPlayingDroppingId);

                  debugInfo.push({
                    index: index,
                    droppingId: droppingData.droppingId,
                    songId: droppingData.songId,
                    songIdType: typeof droppingData.songId,
                    dropMatch: dropMatch
                  });

                  if (dropMatch) {
                    foundMatch = true;
                    marker.setIcon({
                      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
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
                      ),
                      scaledSize: new google.maps.Size(60, 60)
                    });
                    marker.setZIndex(2000);

                    const position = marker.getPosition();
                    if (position) {
                      map.panTo(position);
                    }
                  }
                }
              });

              if (window.ReactNativeWebView) {
                let debugMessage = foundMatch ?
                  ('✅ 빨간 핀 찾음!\\n드랍핑ID: ' + newCurrentPlayingDroppingId) :
                  ('❌ 일치하는 핀 없음\\n드랍핑ID: ' + newCurrentPlayingDroppingId + '\\n타입: ' + typeof newCurrentPlayingDroppingId);

                debugMessage += '\\n\\n📊 마커 정보:';
                for (let i = 0; i < Math.min(3, debugInfo.length); i++) {
                  const info = debugInfo[i];
                  debugMessage += '\\n[' + i + '] songId:' + info.songId + '(' + info.songIdType + ') droppingId:' + info.droppingId;
                }

                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: debugMessage
                }));
              }
            }
          }

          function focusOnCurrentlyPlayingMusic(currentPlayingDroppingId) {
            if (!currentPlayingDroppingId) return;

            existingMarkers.forEach(function(marker) {
              const droppingData = marker.droppingData;
              if (droppingData && (String(droppingData.droppingId) === String(currentPlayingDroppingId))) {
                const position = marker.getPosition();
                if (position) {
                  console.log('재생 중인 음악으로 화면 이동:', position.lat(), position.lng());
                  map.panTo(position);
                }
              }
            });
          }

          function addDroppings(drops, currentPlayingDroppingId) {
            if (!mapReady || !map) return;

            clearDroppings();

            drops.forEach(function(drop) {
              const dropId = drop.droppingId || drop.id;
              const songId = drop.songId || drop.song_id;
              const dropPosition = new google.maps.LatLng(drop.latitude, drop.longitude);
              const centerPositionDynamic = map.getCenter();
              const distance = google.maps.geometry.spherical.computeDistanceBetween(centerPositionDynamic, dropPosition);
              const radius = ${MAP_RADIUS};

              const isCurrentlyPlaying = currentPlayingDroppingId &&
                (String(dropId) === String(currentPlayingDroppingId));

              const dropType = String(drop.type || 'MUSIC').toUpperCase();
              const isVoteDropping = dropType === 'VOTE';
              const isPlaylistDropping = dropType === 'PLAYLIST';

              console.log('마커 생성 중:', {
                droppingId: dropId,
                songId: songId,
                type: dropType,
                isVoteDropping: isVoteDropping,
                currentPlayingDroppingId: currentPlayingDroppingId,
                droppingIdMatch: String(dropId) === String(currentPlayingDroppingId),
                isCurrentlyPlaying: isCurrentlyPlaying,
                songIdType: typeof songId,
                currentPlayingDroppingIdType: typeof currentPlayingDroppingId
              });

              const iconUrl = isVoteDropping ?
                // VOTE 드랍핑 아이콘 (토론 아이콘)
                "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
                  '<svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<g filter="url(#filter0_d_180_98)">' +
                  '<rect x="20" y="20" width="35" height="35" rx="17.5" fill="#101118" shape-rendering="crispEdges"/>' +
                  '<path d="M39.5 40.5V42.5C39.5 42.7652 39.3946 43.0196 39.2071 43.2071C39.0196 43.3946 38.7652 43.5 38.5 43.5H31.5L28.5 46.5V36.5C28.5 36.2348 28.6054 35.9804 28.7929 35.7929C28.9804 35.6054 29.2348 35.5 29.5 35.5H31.5M46.5 33V29.5C46.5 29.2348 46.3946 28.9804 46.2071 28.7929C46.0196 28.6054 45.7652 28.5 45.5 28.5H36.5C36.2348 28.5 35.9804 28.6054 35.7929 28.7929C35.6054 28.9804 35.5 29.2348 35.5 29.5V35.5C35.5 35.7652 35.6054 36.0196 35.7929 36.2071C35.9804 36.3946 36.2348 36.5 36.5 36.5H43.5L46.5 39.5V33.5" stroke="#6210EF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                  '</g>' +
                  '<defs>' +
                  '<filter id="filter0_d_180_98" x="0" y="0" width="75" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
                  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
                  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>' +
                  '<feOffset/>' +
                  '<feGaussianBlur stdDeviation="10"/>' +
                  '<feComposite in2="hardAlpha" operator="out"/>' +
                  '<feColorMatrix type="matrix" values="0 0 0 0 0.384314 0 0 0 0 0.0627451 0 0 0 0 0.937255 0 0 0 1 0"/>' +
                  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_180_98"/>' +
                  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_180_98" result="shape"/>' +
                  '</filter>' +
                  '</defs>' +
                  '</svg>'
                )
              : isPlaylistDropping ?
                // PLAYLIST 드랍핑 아이콘
                "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
                  '<svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<g filter="url(#filter0_d_1_4961)">' +
                  '<rect x="20" y="20" width="35" height="35" rx="17.5" fill="#101118" shape-rendering="crispEdges"/>' +
                  '<path d="M47.5049 35.1279C48.1335 34.9773 48.7381 35.4532 48.7383 36.0996V36.9521C48.7381 37.4143 48.4202 37.816 47.9707 37.9238L45.8613 38.4307V44.3203C45.8612 45.1155 45.0555 45.7598 44.0615 45.7598C43.0676 45.7597 42.2619 45.1154 42.2617 44.3203C42.2617 43.5251 43.0675 42.88 44.0615 42.8799C44.2719 42.8799 44.4744 42.9088 44.6621 42.9619V36.4004C44.6621 36.0572 44.8641 35.7616 45.1445 35.6943L47.5049 35.1279ZM38.2617 41.2402C38.814 41.2402 39.2617 41.6879 39.2617 42.2402C39.2617 42.7925 38.814 43.2402 38.2617 43.2402H27.2617C26.7094 43.2402 26.2617 42.7925 26.2617 42.2402C26.2617 41.6879 26.7094 41.2402 27.2617 41.2402H38.2617ZM41.2617 35.2402C41.814 35.2402 42.2617 35.6879 42.2617 36.2402C42.2617 36.7925 41.814 37.2402 41.2617 37.2402H27.2617C26.7094 37.2402 26.2617 36.7925 26.2617 36.2402C26.2617 35.6879 26.7094 35.2402 27.2617 35.2402H41.2617ZM45.2617 29.2402C45.814 29.2402 46.2617 29.6879 46.2617 30.2402C46.2617 30.7925 45.814 31.2402 45.2617 31.2402H27.2617C26.7094 31.2402 26.2617 30.7925 26.2617 30.2402C26.2617 29.6879 26.7094 29.2402 27.2617 29.2402H45.2617Z" fill="#EF9210"/>' +
                  '</g>' +
                  '<defs>' +
                  '<filter id="filter0_d_1_4961" x="0" y="0" width="75" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
                  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
                  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>' +
                  '<feOffset/>' +
                  '<feGaussianBlur stdDeviation="10"/>' +
                  '<feComposite in2="hardAlpha" operator="out"/>' +
                  '<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.580392 0 0 0 0 0.160784 0 0 0 1 0"/>' +
                  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_4961"/>' +
                  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_4961" result="shape"/>' +
                  '</filter>' +
                  '</defs>' +
                  '</svg>'
                )
              : isCurrentlyPlaying
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
                zIndex: isCurrentlyPlaying ? 2000 : 100
              });

              marker.droppingData = {
                ...drop,
                droppingId: dropId,
                songId: songId,
              };

              existingMarkers.push(marker);

              if (isCurrentlyPlaying) {
                console.log('현재 재생 중인 음악 위치로 이동:', drop.latitude, drop.longitude);
                setTimeout(() => {
                  map.panTo({ lat: drop.latitude, lng: drop.longitude });
                }, 500);
              }
              
              marker.addListener('click', function() {
                const isInCircle = distance <= radius;
                console.log('WebView 마커 클릭:', {
                  isVoteDropping: isVoteDropping,
                  dropType: dropType,
                  isInCircle: isInCircle,
                  droppingId: dropId
                });

                if (isInCircle) {
                  let action = 'navigateToMusic';
                  if (isVoteDropping) {
                    action = 'navigateToDebate';
                  } else if (isPlaylistDropping) {
                    action = 'navigateToPlaylist';
                  }
                  console.log('WebView 액션 결정:', action);
                  window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'markerClick',
                    action: action,
                    payload: {
                      droppingId: dropId,
                      songId: songId,
                      content: drop.content,
                      latitude: drop.latitude,
                      longitude: drop.longitude,
                      address: drop.address,
                      type: dropType
                    }
                  }));
                } else {
                  let action = 'showDetails';
                  if (isPlaylistDropping) {
                    action = 'navigateToPlaylist';
                  }
                  window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'markerClick',
                    action: action,
                    payload: {
                      droppingId: dropId,
                      songId: songId,
                      content: drop.content,
                      latitude: drop.latitude,
                      longitude: drop.longitude,
                      address: drop.address,
                      type: dropType
                    }
                  }));
                }
              });
            });
            updateAllMarkersForCurrentSong(currentPlayingSongId);
          }

          function createNowPlayingCard(marker, songData) {
            if (nowPlayingCardElement) {
              nowPlayingCardElement.remove();
            }

            const cardDiv = document.createElement('div');
            cardDiv.style.cssText = \`
              position: absolute;
              background: rgba(0, 0, 0, 0.8);
              border-radius: 12px;
              padding: 16px;
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              width: 280px;
              z-index: 1000;
              pointer-events: auto;
            \`;

            // 곡 정보
            const title = songData.title || '재생 중인 곡';
            const artist = songData.artist || '알 수 없는 아티스트';
            const likeCount = songData.likeCount || 0;

            // CD 모양 앨범 이미지 SVG
            const clipId = 'albumClip' + Date.now();
            const cdAlbumSvg = \`
              <svg width="60" height="60" viewBox="0 0 108 108">
                <!-- 외부 CD 배경 -->
                <rect x="0" y="0" width="108" height="108" rx="20" fill="#212131"/>

                <!-- 앨범 이미지 마스크 -->
                <defs>
                  <clipPath id="\${clipId}">
                    <circle cx="54" cy="54" r="50"/>
                  </clipPath>
                </defs>

                <!-- 앨범 이미지 -->
                <g clip-path="url(#\${clipId})">
                  \${songData.albumImagePath ?
                    \`<image x="4" y="4" width="100" height="100" href="\${songData.albumImagePath}" preserveAspectRatio="xMidYMid slice"/>\` :
                    \`<rect x="4" y="4" width="100" height="100" fill="#333"/>
                     <text x="54" y="60" text-anchor="middle" fill="#656581" font-size="20">♪</text>\`
                  }
                </g>

                <!-- CD 효과 오버레이 -->
                <path d="M54.3083 3C84.6867 3.00019 109.208 27.5217 109.208 57.9004C109.208 88.279 84.6866 112.8 54.3083 112.8C23.9299 112.8 -0.59183 88.2791 -0.59204 57.9004C-0.59204 27.5216 23.9297 3 54.3083 3ZM54.7 48.2002C49.4542 48.2002 45.2 52.4544 45.2 57.7002C45.2001 62.9459 49.4543 67.2002 54.7 67.2002C59.9456 67.2002 64.1998 62.9459 64.2 57.7002C64.2 52.4544 59.9457 48.2002 54.7 48.2002Z" fill="rgba(19, 3, 9, 0.2)"/>

                <!-- 중앙 홀 -->
                <circle cx="54" cy="54" r="9" fill="#212131"/>
              </svg>
            \`;

            // 하트 아이콘 SVG
            const heartIcon = \`
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14s6-4.5 6-8.5C14 3.5 12.5 2 10.5 2 9.5 2 8.5 2.5 8 3.5 7.5 2.5 6.5 2 5.5 2 3.5 2 2 3.5 2 5.5 2 9.5 8 14 8 14z" fill="#FF4444"/>
              </svg>
            \`;

            // 다운로드 아이콘 SVG
            const downloadIcon = \`
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2" stroke="#EF9210" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            \`;

            cardDiv.innerHTML = \`
              <div style="display: flex; align-items: flex-start; gap: 12px; position: relative;">
                <!-- CD 모양 앨범 이미지 -->
                <div style="flex-shrink: 0;">
                  \${cdAlbumSvg}
                </div>

                <!-- 곡 정보 + 아이콘들 -->
                <div style="flex: 1; min-width: 0;">
                  <!-- 곡 제목 -->
                  <div style="font-weight: bold; font-size: 24px; line-height: 32px; color: #FF4444; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    \${title}
                  </div>

                  <!-- 가수명 -->
                  <div style="font-size: 14px; line-height: 16px; color: rgba(255,255,255,0.6); margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    by \${artist}
                  </div>

                  <!-- 아이콘들 (가로 배치) -->
                  <div style="display: flex; align-items: center; gap: 16px;">
                    <!-- 좋아요 -->
                    <div style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                      \${heartIcon}
                      <span style="font-size: 16px; color: #FF4444; font-weight: bold;">\${likeCount}</span>
                    </div>

                    <!-- 다운로드 -->
                    <div style="cursor: pointer;">
                      \${downloadIcon}
                    </div>
                  </div>
                </div>


                <!-- 닫기 버튼 (우상단) -->
                <div style="position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; border-radius: 12px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; font-weight: bold;" onclick="hideNowPlayingCard()">
                  ✕
                </div>
              </div>
            \`;


            // 마커 위치에 카드 배치
            const position = marker.getPosition();
            const projection = map.getProjection();
            const overlayView = new google.maps.OverlayView();

            overlayView.onAdd = function() {
              this.getPanes().overlayLayer.appendChild(cardDiv);
              nowPlayingCardElement = cardDiv;

              // 초기 위치 설정
              this.draw = function() {
                const pixelPosition = this.getProjection().fromLatLngToDivPixel(position);
                if (pixelPosition && cardDiv) {
                  cardDiv.style.left = (pixelPosition.x - 140) + 'px'; // 카드 너비의 절반만큼 왼쪽으로
                  cardDiv.style.top = (pixelPosition.y - 160) + 'px'; // 카드를 핀 위쪽에 더 멀리 배치
                }
              };
            };

            overlayView.onRemove = function() {
              if (cardDiv && cardDiv.parentNode) {
                cardDiv.parentNode.removeChild(cardDiv);
              }
              nowPlayingCardElement = null;
            };

            overlayView.setMap(map);

            // 전역에서 참조할 수 있도록 저장
            window.currentOverlayView = overlayView;
          }

          function hideNowPlayingCard() {
            if (window.currentOverlayView) {
              window.currentOverlayView.setMap(null);
              window.currentOverlayView = null;
            }
            nowPlayingCardElement = null;
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

            map.panTo(newPosition);

            existingMarkers.forEach(function(marker) {
              const droppingData = marker.droppingData;
              if (!droppingData) return;

              const isCurrentlyPlaying = currentPlayingSongId &&
                (droppingData.songId === currentPlayingSongId || droppingData.droppingId === currentPlayingSongId);

              const iconUrl = isCurrentlyPlaying 
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

              marker.setZIndex(isCurrentlyPlaying ? 2000 : 100);
            });
          }

          function showNowPlayingCard(droppingId, songData) {
            const targetMarker = existingMarkers.find(marker =>
              marker.droppingData && String(marker.droppingData.droppingId) === String(droppingId)
            );

            if (targetMarker && songData) {
              createNowPlayingCard(targetMarker, songData);
            }
          }

          function processMessage(data) {
            if (data.type === 'showNowPlayingCard') {
              currentSongData = data.songData;
              if (currentPlayingDroppingId && currentSongData) {
                showNowPlayingCard(currentPlayingDroppingId, currentSongData);
              }
            } else if (data.type === 'hideNowPlayingCard') {
              hideNowPlayingCard();
            } else if (data.type === 'droppings') {
              const previousPlayingDroppingId = currentPlayingDroppingId;
              currentPlayingDroppingId = data.currentPlayingDroppingId;
              console.log('WebView - 현재 재생 중인 드랍핑 ID:', currentPlayingDroppingId);
              console.log('WebView - 받은 드랍핑 개수:', data.payload?.length || 0);

              if (mapReady && map && data.payload) {
                if (data.payload.length > 0) {
                  addDroppings(data.payload, data.currentPlayingDroppingId);
                  updateAllMarkersForCurrentSong(currentPlayingDroppingId);
                } else {
                  console.log('WebView - 드랍핑이 없어서 기존 마커 제거');
                  clearDroppings();
                }
              }

              if (previousPlayingDroppingId !== currentPlayingDroppingId) {
                console.log('재생 드랍핑 변경됨:', previousPlayingDroppingId, '->', currentPlayingDroppingId);
                updateAllMarkersForCurrentSong(currentPlayingDroppingId);

                // 새로운 곡이 재생되면 카드 표시
                if (currentPlayingDroppingId && currentSongData) {
                  showNowPlayingCard(currentPlayingDroppingId, currentSongData);
                } else {
                  hideNowPlayingCard();
                }
              }
            } else if (data.type === 'updateCurrentDropping') {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: 'WebView 메시지 수신됨\\n드랍핑ID: ' + data.currentPlayingDroppingId + '\\n타입: ' + typeof data.currentPlayingDroppingId
                }));
              }

              const previousPlayingDroppingId = currentPlayingDroppingId;
              currentPlayingDroppingId = data.currentPlayingDroppingId;
              const timestamp = data.timestamp;
              console.log('[SYNC] WebView 즉시 재생 음악 업데이트:', {
                timestamp,
                previousPlayingDroppingId,
                newCurrentPlayingDroppingId: currentPlayingDroppingId,
                changed: previousPlayingDroppingId !== currentPlayingDroppingId,
                existingMarkersCount: existingMarkers.length
              });

              console.log('[SYNC] 강제 마커 업데이트 시작...', currentPlayingDroppingId);

              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'debug',
                  message: '마커 업데이트 시작: ' + currentPlayingDroppingId
                }));
              }

              updateAllMarkersForCurrentSong(currentPlayingDroppingId);

              if (currentPlayingDroppingId) {
                focusOnCurrentlyPlayingMusic(currentPlayingDroppingId);
              }
            } else if (data.type === 'initLocation') {
              const lat = Number(data.payload?.latitude);
              const lng = Number(data.payload?.longitude);

              if (!isNaN(lat) && !isNaN(lng) && mapReady && map) {
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
                if (myLocationMarker) {
                  myLocationMarker.setPosition(new google.maps.LatLng(lat, lng));
                  console.log('내 위치 마커 업데이트:', lat, lng);
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
      decelerationRate={0.998}
      renderLoading={() => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a29' }}>
          <ActivityIndicator size="large" color={PRIMARY_COLORS.DEFAULT} />
        </View>
      )}
      onLoadStart={() => console.log('Map WebView 로딩 시작')}
      onLoadEnd={() => console.log('Map WebView 로딩 완료')}
      onError={(error) => console.error('Map WebView 에러:', error.nativeEvent)}
    />
  );
});

export default React.memo(GoogleMapView, (prevProps, nextProps) => {
  const locationChanged = prevProps.currentLocation && nextProps.currentLocation
    ? Math.abs(prevProps.currentLocation.latitude - nextProps.currentLocation.latitude) > 0.0001 ||
      Math.abs(prevProps.currentLocation.longitude - nextProps.currentLocation.longitude) > 0.0001
    : prevProps.currentLocation !== nextProps.currentLocation;

  const droppingsChanged = prevProps.droppings.length !== nextProps.droppings.length ||
    prevProps.droppings.some((prev, index) => {
      const next = nextProps.droppings[index];
      return !next || prev.droppingId !== next.droppingId;
    });

  const currentDroppingChanged =
    String(prevProps.currentPlayingDroppingId ?? '') !== String(nextProps.currentPlayingDroppingId ?? '');

  return !locationChanged && !droppingsChanged && !currentDroppingChanged;
});
