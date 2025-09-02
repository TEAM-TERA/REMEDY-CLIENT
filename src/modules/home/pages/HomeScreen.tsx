import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from "../components/HeaderBar";
import GoogleMapView from "../../../components/map/GoogleMapView";
import MusicWheel from "../components/MainFunction/MusicWheel";

function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flex: 1, position: 'relative' }}>
            <HeaderBar/>
            <View style={{ flex: 1 }}>
                <GoogleMapView/>
            </View>
            <MusicWheel/>
        </View>
    </SafeAreaView>

  );
}
export default HomeScreen;