import { View, SafeAreaView, Text, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import { styles } from "../styles/DropScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import { TEXT_COLORS } from "../../../constants/colors";
import { DropScreenProps } from "../types/DropScreen";
import PlayBar from "../../../components/playBar/PlayBar";
import CdPlayer from "../components/CdPlayer/CdPlayer";
import LocationMarkerSvg from "../components/LocationMarker/LocationMarkerSvg";
import GoogleMapView from "../../../components/map/GoogleMapView";


function DropScreen({musicTitle, singer, musicTime, location} : DropScreenProps){

    const [currentTime, setCurrentTime] = useState(0);

    return(
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <CdPlayer></CdPlayer>
            <View style = {styles.playerContainer}>
                <View style = {styles.textContainer}>
                    <Text style = {[TYPOGRAPHY.HEADLINE_1, styles.titleText]}>{musicTitle}</Text>
                    <Text style = {[TYPOGRAPHY.SUBTITLE, styles.singerText]}>{singer}</Text>
                </View>
                <PlayBar currentTime={currentTime} musicTime={musicTime}
                onSeek={(position : number)=>{
                    setCurrentTime(position);
                }}></PlayBar>
            </View>
            <View style = {styles.informationContainer}>
                <View style = {styles.remainTextContainer}>
                    <Text style = {[TYPOGRAPHY.SUBTITLE, styles.remainText]}>남길 한마디</Text>
                    <TextInput style = {styles.remainInput}
                    placeholder="음악과 남길 한마디를 적어주세요"
                    textAlignVertical="top"
                    multiline={true}
                    placeholderTextColor={TEXT_COLORS.CAPTION_RED}></TextInput>
                </View>
            </View>
            <View style = {styles.informationContainer}>
                <View style = {styles.remainTextContainer}>
                    <Text style = {[TYPOGRAPHY.SUBTITLE, styles.remainText]}>위치 선택</Text>
                    <View style = {styles.locationContainer}>
                        <LocationMarkerSvg></LocationMarkerSvg>
                        <Text style = {[TYPOGRAPHY.CAPTION_1, styles.locationText]}>{location}</Text>
                    </View>
                    <GoogleMapView></GoogleMapView>
                </View>
            </View>
        </ScrollView>
    )
}

export default DropScreen;