import { Image, View } from "react-native";
import { styles } from "./styles";
import CircleSvg from "../CircleSvg/CircleSvg";

function CdPlayer(){
    return(
        <View style = {styles.container}>
            <Image
            source={{ uri : ""}}
            style = {styles.imgContainer}></Image>
            <CircleSvg></CircleSvg>
            <View style = {styles.smallShape}></View>
        </View>
    )
}

export default CdPlayer;