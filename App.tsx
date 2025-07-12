import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

import MusicWheel from './src/modules/home/components/MainFunction/MusicWheel';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <NewAppScreen templateFileName="App.tsx" />
//     </View>
//   );
// }

function App() {
  return(
    <MusicWheel></MusicWheel>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;