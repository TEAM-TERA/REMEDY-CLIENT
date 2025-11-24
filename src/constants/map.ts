import Config from 'react-native-config';

export const GOOGLE_MAPS_API_KEY = Config.GOOGLE_MAPS_API_KEY;

export const MAP_RADIUS = 40;
export const MAP_ZOOM = 18;

export const MAP_STYLE = [
  { "featureType": "all", "elementType": "geometry.stroke", "stylers": [ { "color": "#6c697c" } ] },
  { "featureType": "all", "elementType": "labels.text", "stylers": [ { "visibility": "simplified" }, { "lightness": "0" }, { "weight": "0.99" } ] },
  { "featureType": "all", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "administrative.country", "elementType": "labels.text", "stylers": [ { "color": "#6780b3" } ] },
  { "featureType": "administrative.province", "elementType": "labels.text", "stylers": [ { "color": "#5156ca" } ] },
  { "featureType": "administrative.locality", "elementType": "labels.text", "stylers": [ { "color": "#6558bb" } ] },
  { "featureType": "administrative.neighborhood", "elementType": "labels.text", "stylers": [ { "color": "#5c3f7e" } ] },
  { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [ { "color": "#1a1a29" } ] },
  { "featureType": "poi", "elementType": "geometry.fill", "stylers": [ { "color": "#1c1c2a" } ] },
  { "featureType": "poi.park", "elementType": "labels.text", "stylers": [ { "color": "#ae3e6c" }, { "weight": "1.21" } ] },
  { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#282853" } ] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.highway", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry.fill", "stylers": [ { "color": "#242444" } ] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.highway.controlled_access", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [ { "color": "#3a3a5d" } ] },
  { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [ { "color": "#303058" } ] },
  { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "road.local", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [ { "color": "#404065" } ] },
  { "featureType": "water", "elementType": "geometry.fill", "stylers": [ { "color": "#8792c5" } ] },
  { "featureType": "water", "elementType": "labels.text", "stylers": [ { "color": "#596ac0" } ] }
];


export const MARKER_STYLES = {
    MY_LOCATION : "https://water-icon-dc4.notion.site/image/attachment%3A28b5c24c-b89a-48b2-89e4-b800d44c7f6c%3Aimage.png?table=block&id=22e2845a-0c9f-8048-8dff-de8bb412500a&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=1490&userId=&cache=v2"
}