import { View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { styles } from "../../styles/MainFunction/MainFunction"
import MusicWheel from "./MusicWheel"

function MainFunction(){
    return(
        <GestureHandlerRootView style={styles.container}>
            <MusicWheel />
        </GestureHandlerRootView>
    )
}

export default MainFunction