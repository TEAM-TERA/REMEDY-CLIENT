import { View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { BACKGROUND_COLORS } from "../../../constants/colors";
import HeaderBar from "../components/HeaderBar";
import GoogleMapView from "../../../components/map/GoogleMapView";
import MusicWheel from "../components/MainFunction/MusicWheel";
import RunningStats from "../components/Running/RunningStats";
import useRunningTracker from "../hooks/useRunningTracker";
import { ConfirmModal } from "../../../components";
import useLocation from "../../../hooks/useLocation";
import { useDroppings } from "../../drop/hooks/useDroppings";

function HomeScreen() {
  const [headerHeight, setHeaderHeight] = useState(68);
  const [isRunning, setIsRunning] = useState(false);
  const [runModalVisible, setRunModalVisible] = useState(false);
  const [runModalMessage, setRunModalMessage] = useState("");
  const { currentDistance, timeComponents, currentTime } = useRunningTracker(isRunning);
  const { location } = useLocation();
  const currentLocation = location ?? { latitude: 37.5665, longitude: 126.9780 };

  const { data: droppings } = useDroppings(
    currentLocation.longitude,
    currentLocation.latitude
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLORS.BACKGROUND }} edges={['top']}>
        <View style={{ flex: 1, position: 'relative' }}>
            <HeaderBar setIsRunning={(next:boolean)=>{
                if (isRunning && !next) {
                  const hours = timeComponents.hours;
                  const minutes = timeComponents.minutes;
                  const seconds = timeComponents.seconds;
                  setRunModalMessage(`달린 시간: ${hours}:${minutes}:${seconds}\n달린 거리: ${currentDistance.toFixed(2)} km`);
                  setRunModalVisible(true);
                }
                setIsRunning(next);
              }} onLayout={setHeaderHeight} isRunning={isRunning}/>
            {isRunning && (
              <RunningStats 
                isRunning={isRunning} 
                headerHeight={headerHeight}
                currentDistance={currentDistance}
                timeComponents={timeComponents}
              />
            )}
            <View style={{ flex: 1 }}>
                <GoogleMapView droppings={droppings} currentLocation={currentLocation}/>
            </View>
            <MusicWheel droppings={droppings}/>
        </View>
        <ConfirmModal
          visible={runModalVisible}
          title="러닝 종료"
          message={runModalMessage}
          cancelText="취소"
          confirmText="확인"
          onCancel={() => setRunModalVisible(false)}
          onConfirm={() => setRunModalVisible(false)}
        />
    </SafeAreaView>

  );
}
export default HomeScreen;