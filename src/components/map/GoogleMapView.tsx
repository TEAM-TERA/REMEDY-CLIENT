import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { PRIMARY_COLORS } from '../../constants/colors';
import { MAP_RADIUS, MAP_ZOOM, MAP_STYLE, MARKER_STYLES, GOOGLE_MAPS_API_KEY } from '../../constants/map';
import { useDroppings } from '../../modules/drop/hooks/useDroppings';
import { Linking } from 'react-native';


export default function GoogleMapView() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const webviewRef = useRef<WebView>(null);

  // 위치 요청
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
  

  // fallback 위치 (서울)
  const currentLocation = location ?? { latitude: 37.5665, longitude: 126.9780 };

  const { data: droppings } = useDroppings(
    currentLocation.longitude,
    currentLocation.latitude
  );

  // 지도 HTML 생성
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}"></script>
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
              new google.maps.Marker({
                position: { lat: drop.latitude, lng: drop.longitude },
                map: map,
                title: drop.content,
                icon: {
                  url: "https://water-icon-dc4.notion.site/image/attachment%3A3292e931-4479-40da-ab55-719824478764%3Aimage.png?table=block&id=2322845a-0c9f-8069-8720-e3a085f5acfa&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=300&userId=&cache=v2",
                  scaledSize: new google.maps.Size(32, 32)
                }
              });
            });
          }

          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'droppings') {
                addDroppings(data.payload);
              }
            } catch (e) {
              window.ReactNativeWebView?.postMessage("droppings error: " + e.message);
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

  // droppings 전달
  useEffect(() => {
    if (webviewRef.current && droppings) {
      webviewRef.current.postMessage(JSON.stringify({ type: 'droppings', payload: droppings }));
    }
  }, [droppings]);

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
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
