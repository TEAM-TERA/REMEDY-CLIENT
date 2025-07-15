import { View, SafeAreaView, Text } from "react-native";
import { useState } from "react";
import { styles } from "../styles/DropScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import { DropScreenProps } from "../types/DropScreen";
import PlayBar from "../../../components/playBar/PlayBar";

function DropScreen({musicTitle, singer} : DropScreenProps){

    const [currentTime, setCurrentTime] = useState(0);

    return(
        <SafeAreaView style = {styles.container}>
            <View style = {styles.playerContainer}>
                <View style = {styles.textContainer}>
                    <Text style = {[TYPOGRAPHY.HEADLINE_1, styles.titleText]}>{musicTitle}</Text>
                    <Text style = {[TYPOGRAPHY.SUBTITLE, styles.singerText]}>{singer}</Text>
                </View>
                <PlayBar currentTime={currentTime} musicTime={188}
                onSeek={(position : number)=>{
                    setCurrentTime(position);
                }}></PlayBar>
            </View>
            <View style = {styles.informationContainer}></View>
        </SafeAreaView>
    )
}

export default DropScreen;