import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import GoogleMapView from './src/components/map/GoogleMapView';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GoogleMapView></GoogleMapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
