import { SafeAreaView, Text, View } from "react-native";
import { styles } from "../styles/HomeScreen";
import MainFunction from "../components/MainFunction";
import GoogleMapView from "../../../components/map/GoogleMapView";
import HeaderBar from "../components/HeaderBar";

function HomeScreen(){
    return(
        <SafeAreaView style = {styles.container}>
            <HeaderBar></HeaderBar>
            <GoogleMapView></GoogleMapView>
            <MainFunction></MainFunction>
        </SafeAreaView>
    )
}

export default HomeScreen;