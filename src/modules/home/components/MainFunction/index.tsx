import { View } from "react-native"
import { styles } from "../../styles/MainFunction/MainFunction"
import MusicWheel from "./MusicWheel"

function MainFunction(){
    return(
        <View style = {styles.container}>
            <MusicWheel></MusicWheel>
        </View>
    )
}

export default MainFunction