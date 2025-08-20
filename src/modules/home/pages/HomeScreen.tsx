import { SafeAreaView, Text, View } from "react-native";
import { styles } from "../styles/HomeScreen";
import MainFunction from "../components/MainFunction";
import GoogleMapView from "../../../components/map/GoogleMapView";
import HeaderBar from "../components/HeaderBar";

function HomeScreen(){
    return(
        <GoogleMapView></GoogleMapView>
    )
}

export default HomeScreen;