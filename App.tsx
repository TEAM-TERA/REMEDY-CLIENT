// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <NewAppScreen templateFileName="App.tsx" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import GoogleMapView from './src/components/map/GoogleMapView';

import MainFunction from './src/modules/home/components/MainFunction';
import HeaderBar from './src/modules/home/components/HeaderBar';


function App() {
  return (
    <View style={{ flex: 1 }}>
      <HeaderBar></HeaderBar>
      <GoogleMapView></GoogleMapView>
      <MainFunction></MainFunction>
    </View>
  );
}

export default App;