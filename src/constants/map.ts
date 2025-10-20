import Config from 'react-native-config';

export const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

export const MAP_RADIUS = 40;
export const MAP_ZOOM = 18;

export const MAP_STYLE = [
  { "featureType": "all", "elementType": "geometry.stroke", "stylers": [ { "color": "#6c697c" } ] },
  { "featureType": "all", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "all", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [ { "color": "#10101d" } ] },
  { "featureType": "poi", "elementType": "geometry.fill", "stylers": [ { "color": "#1c1c2a" } ] },
  { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#191928" } ] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry.fill", "stylers": [ { "color": "#191928" } ] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [ { "color": "#282838" } ] },
  { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [ { "color": "#393949" } ] },
  { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [ { "color": "#404065" } ] },
  { "featureType": "water", "elementType": "geometry.fill", "stylers": [ { "color": "#489c8b" } ] }
];


export const MARKER_STYLES = {
    MY_LOCATION : "https://water-icon-dc4.notion.site/image/attachment%3A28b5c24c-b89a-48b2-89e4-b800d44c7f6c%3Aimage.png?table=block&id=22e2845a-0c9f-8048-8dff-de8bb412500a&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=1490&userId=&cache=v2"
}