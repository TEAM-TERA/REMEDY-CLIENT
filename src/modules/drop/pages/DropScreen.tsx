import { View, SafeAreaView } from "react-native";
import { styles } from "../styles/DropScreen";

function DropScreen(){
    return(
        <SafeAreaView style = {styles.container}>
            <View style = {styles.informationContainer}></View>
        </SafeAreaView>
    )
}

export default DropScreen;