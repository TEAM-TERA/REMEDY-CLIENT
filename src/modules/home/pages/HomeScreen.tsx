import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import HeaderBar from "../components/HeaderBar";
import GoogleMapView from "../../../components/map/GoogleMapView";
import MusicWheel from "../components/MainFunction/MusicWheel";
import RunningStats from "../components/Running/RunningStats";

function HomeScreen() {
  const [headerHeight, setHeaderHeight] = useState(68);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flex: 1, position: 'relative' }}>
            <HeaderBar setIsRunning={setIsRunning} onLayout={setHeaderHeight} isRunning={isRunning}/>
            {
              isRunning && (
                <RunningStats 
                  distance={0.1} 
                  time={1} 
                  isRunning={isRunning} 
                  headerHeight={headerHeight}
                />
              )
            }
            <View style={{ flex: 1 }}>
                <GoogleMapView/>
            </View>
            <MusicWheel/>
        </View>
    </SafeAreaView>

  );
}
export default HomeScreen;