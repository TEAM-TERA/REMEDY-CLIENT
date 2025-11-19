import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLORS } from '../../constants/colors';
import { MAP_RADIUS, MAP_ZOOM, MAP_STYLE, MARKER_STYLES, GOOGLE_MAPS_API_KEY } from '../../constants/map';
import { Dropping } from '../../modules/home/types/musicList';


interface GoogleMapViewProps {
  droppings: Dropping[];
  currentLocation: { latitude: number, longitude: number };
}

export default function GoogleMapView({ droppings, currentLocation }: GoogleMapViewProps) {
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (isMapReady && webviewRef.current && droppings && droppings.length > 0) {
      const message = JSON.stringify({ type: 'droppings', payload: droppings });
      webviewRef.current.postMessage(message);
    }
  }, [droppings, isMapReady]);

  useEffect(() => {
    if (!isMapReady || !webviewRef.current || !currentLocation) return;
    
    const message = JSON.stringify({
      type: 'updateLocation',
      payload: { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
    });
    webviewRef.current.postMessage(message);
  }, [currentLocation, isMapReady]);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry"></script>
        <script>
          var map;
          var myLocationMarker;
          var userCircle;
          var mapReady = false;
          var existingMarkers = [];
          var messageQueue = [];
          var lastCenter = null;
          
          function initMap() {
            const center = { lat: 37.5665, lng: 126.9780 };

            map = new google.maps.Map(document.getElementById('map'), {
              center,
              zoom: ${MAP_ZOOM},
              styles: ${JSON.stringify(MAP_STYLE)},
              disableDefaultUI: true,
              gestureHandling: 'greedy'
            });

            myLocationMarker = new google.maps.Marker({
              position: center,
              map: map,
              title: '내 위치',
              icon: { url: "${MARKER_STYLES.MY_LOCATION}", scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) },
              zIndex: 0
            });

            userCircle = new google.maps.Circle({
              strokeColor: "#FFFFFF",
              strokeOpacity: 0,
              strokeWeight: 0,
              fillColor: "${PRIMARY_COLORS.DEFAULT}",
              fillOpacity: 0.2,
              map,
              center,
              radius: ${MAP_RADIUS},
              zIndex: 0
            });

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
            
            map.panTo(newPosition);
            
            if (myLocationMarker) {
              myLocationMarker.setPosition(newPosition);
            }
            
            if (userCircle) {
              userCircle.setCenter(newPosition);
            }

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
            } else if (data.type === 'updateLocation') {
              const lat = Number(data.payload?.latitude);
              const lng = Number(data.payload?.longitude);
              
              if (!isNaN(lat) && !isNaN(lng)) {
                updateLocation(lat, lng);
              }
            }
          }

          function processQueue() {
            while (messageQueue.length > 0) {
              const data = messageQueue.shift();
              processMessage(data);
            }
          }

          // document.addEventListener 사용
          document.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              
              if (!mapReady) {
                messageQueue.push(data);
              } else {
                processMessage(data);
              }
            } catch (e) {
              // Silent error
            }
          });

          // window.addEventListener도 유지 (플랫폼에 따라 다를 수 있음)
          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              
              if (!mapReady) {
                messageQueue.push(data);
              } else {
                processMessage(data);
              }
            } catch (e) {
              // Silent error
            }
          });

          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `;

  return (
    <>
      {!currentLocation && (
        <ActivityIndicator size="large" color={PRIMARY_COLORS.DEFAULT} />
      )}
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
        onMessage={(event) => {
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
        }}
      />
    </>
  );
}