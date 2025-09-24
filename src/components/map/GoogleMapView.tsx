import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, PermissionsAndroid, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { PRIMARY_COLORS } from '../../constants/colors';
import { MAP_RADIUS, MAP_ZOOM, MAP_STYLE, MARKER_STYLES, GOOGLE_MAPS_API_KEY } from '../../constants/map';
import { useDroppings } from '../../modules/drop/hooks/useDroppings';
import { Linking } from 'react-native';


export default function GoogleMapView() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation();

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

  const currentLocation = location ?? { latitude: 37.5665, longitude: 126.9780 };

  const { data: droppings } = useDroppings(
    currentLocation.longitude,
    currentLocation.latitude
  );

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
          function initMap() {
            const center = { lat: ${currentLocation.latitude}, lng: ${currentLocation.longitude} };

            map = new google.maps.Map(document.getElementById('map'), {
              center,
              zoom: ${MAP_ZOOM},
              styles: ${JSON.stringify(MAP_STYLE)},
              disableDefaultUI: true,
              gestureHandling: 'none'
            });

            new google.maps.Marker({
              position: center,
              map,
              title: '내 위치',
              icon: {
                url: "${MARKER_STYLES.MY_LOCATION}",
                scaledSize: new google.maps.Size(40, 40)
              }
            });

            new google.maps.Circle({
              strokeColor: "#FFFFFF",
              strokeOpacity: 0,
              strokeWeight: 0,
              fillColor: "${PRIMARY_COLORS.DEFAULT}",
              fillOpacity: 0.2,
              map,
              center,
              radius: ${MAP_RADIUS}
            });

            window.ReactNativeWebView?.postMessage("initMap called");
          }

          function addDroppings(drops) {
            drops.forEach(function(drop) {
              const dropPosition = new google.maps.LatLng(drop.latitude, drop.longitude);
              const centerPosition = new google.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude});
              const distance = google.maps.geometry.spherical.computeDistanceBetween(centerPosition, dropPosition);

              const radius = ${MAP_RADIUS};

              const iconUrl = distance <= radius 
                ? "https://www.notion.so/image/attachment%3Aa6b92c55-063d-4be3-9e07-2863714d55f1%3Aimage.png?table=block&id=2752845a-0c9f-80c2-a2b9-ffceba8ca2ed&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=2000&userId=620d2e09-6c4e-4ca6-875c-c0f20106c899&cache=v2"
                : "https://water-icon-dc4.notion.site/image/attachment%3A3292e931-4479-40da-ab55-719824478764%3Aimage.png?table=block&id=2322845a-0c9f-8069-8720-e3a085f5acfa&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=300&userId=&cache=v2";

              const marker = new google.maps.Marker({
                position: { lat: drop.latitude, lng: drop.longitude },
                map: map,
                title: drop.content,
                icon: {
                  url: iconUrl,
                  scaledSize: new google.maps.Size(60, 60)
                }
              });
              
              marker.addListener('click', function() {
                const isInCircle = distance <= radius;
                if (isInCircle) {
                  window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'markerClick',
                    action: 'navigateToMusic',
                    payload: {
                      id: drop.id,
                      content: drop.content,
                      latitude: drop.latitude,
                      longitude: drop.longitude,
                    }
                  }));
                } else {
                  window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'markerClick',
                    action: 'showDetails',
                    payload: {
                      id: drop.id,
                      content: drop.content,
                      latitude: drop.latitude,
                      longitude: drop.longitude,
                    }
                  }));
                }
              });
            });
          }

          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'droppings') {
                console.log('Received droppings:', data.payload);
                addDroppings(data.payload);
              }
            } catch (e) {
              window.ReactNativeWebView?.postMessage("droppings error: " + e.message);
            }
          });
          
          document.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'droppings') {
                console.log('Received droppings (direct):', data.payload);
                addDroppings(data.payload);
              }
            } catch (e) {
              window.ReactNativeWebView?.postMessage("droppings error (direct): " + e.message);
            }
          });

          window.onerror = function(message, source, lineno, colno, error) {
            window.ReactNativeWebView?.postMessage("JS Error: " + message);
          };

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
      {!location && (
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
          console.log('WebView says:', event.nativeEvent.data);
          const message = event.nativeEvent.data;
          if (message.startsWith('{') && message.endsWith('}')) {
            try {
              const data = JSON.parse(message);
              if (data.type === 'markerClick') {
                if (data.action === 'navigateToMusic') {
                  (navigation as any).navigate('Music', { dropData: data.payload });
                } else if (data.action === 'showDetails') {
                  Alert.alert(
                    "알림",
                    "확인할 수 없는 드랍입니다",
                    [{ text: "확인", style: "default" }]
                  );
                }
              }
            } catch (e) {
              console.log('JSON 파싱 에러:', e);
            }
          } else {
            console.log('WebView 메시지:', message);
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
