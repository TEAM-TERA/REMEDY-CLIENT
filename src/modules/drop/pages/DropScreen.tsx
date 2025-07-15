import { View, SafeAreaView, Text, TextInput } from "react-native";
import { useState } from "react";
import { styles } from "../styles/DropScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import { DropScreenProps } from "../types/DropScreen";
import PlayBar from "../../../components/playBar/PlayBar";
import CdPlayer from "../components/CdPlayer/CdPlayer";
import { TEXT_COLORS } from "../../../constants/colors";

function DropScreen({musicTitle, singer} : DropScreenProps){

    const [currentTime, setCurrentTime] = useState(0);

    return(
        <SafeAreaView style = {styles.container}>
            <CdPlayer></CdPlayer>
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
            <View style = {styles.informationContainer}>
                <View style = {styles.remainTextContainer}>
                    <Text style = {[TYPOGRAPHY.SUBTITLE, styles.remainText]}>남길 한마디</Text>
                    <TextInput style = {styles.remainInput}
                    placeholder="음악과 남길 한마디를 적어주세요"
                    placeholderTextColor={TEXT_COLORS.CAPTION_RED}></TextInput>
                </View>

                
            </View>
        </SafeAreaView>
    )
}

export default DropScreen;