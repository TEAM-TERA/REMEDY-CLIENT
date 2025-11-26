import { View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { styles } from "../../styles/MainFunction/MainFunction"
import MusicWheel from "./MusicWheel"
import { useDroppings } from "../../../drop/hooks/useDroppings"
import useLocation from "../../../../hooks/useLocation"

function MainFunction(){
    const { location, address } = useLocation();
    const currentLocation = location ?? { latitude: 37.5665, longitude: 126.9780 };
    const { data: droppings } = useDroppings(
        currentLocation.longitude,
        currentLocation.latitude,
        1000  // 1km 반경 내 드랍핑 조회
    );
    return(
        <GestureHandlerRootView style={styles.container}>
            <MusicWheel droppings={droppings || []} />
        </GestureHandlerRootView>
    )
}

export default MainFunction