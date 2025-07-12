import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { PRIMARY_COLORS } from '../../constants/colors';
import { MAP_RADIUS, MAP_ZOOM, MAP_STYLE, MARKER_STYLES, GOOGLE_MAPS_API_KEY } from '../../constants/map';


export default function GoogleMapView() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const webviewRef = useRef<WebView>(null);
  const apiKey = GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    async function requestLocation() {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return;
          }
        }
        Geolocation.getCurrentPosition(
          (pos: GeoPosition) => {
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          (err: any) => {},
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (e) {}
    }
    requestLocation();
  }, []);

  const html = location ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
        <script>
          var map, marker;
          function initMap() {
            var center = { lat: ${location.latitude}, lng: ${location.longitude} };
            map = new google.maps.Map(document.getElementById('map'), {
              center: center,
              zoom: ${MAP_ZOOM},
              minZoom: ${MAP_ZOOM},
              maxZoom: ${MAP_ZOOM},
              styles: ${JSON.stringify(MAP_STYLE)},
              disableDefaultUI: true,
              zoomControl: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
              gestureHandling: 'none'
            });
            marker = new google.maps.Marker({
              position: center,
              map: map,
              title: '내 위치',
              icon: {
                url: "${MARKER_STYLES.MY_LOCATION}",
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20)
              }
            });
            // 40m 반경 원 추가
            new google.maps.Circle({
              strokeColor: "#FFFFFF",   
              strokeOpacity: 0,      
              strokeWeight: 0,    
              fillColor: "${PRIMARY_COLORS.DEFAULT}",
              fillOpacity: 0.2,
              map: map,
              center: center,
              radius: ${MAP_RADIUS}
            });
          }
        </script>
      </head>
      <body onload="initMap()">
        <div id="map"></div>
      </body>
    </html>
  ` : null;

  return (
    <View style={styles.container}>
      {html ? (
        <WebView
          ref={webviewRef}
          style={styles.map}
          originWhitelist={['*']}
          source={{ html }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          automaticallyAdjustContentInsets={false}
          scrollEnabled={false}
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
        />
      ) : (
        <ActivityIndicator size="large" color="#888" style={{ flex: 1 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});