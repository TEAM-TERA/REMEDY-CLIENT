import { View, SafeAreaView, Text, TextInput, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { styles } from "../styles/DropScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import { TEXT_COLORS } from "../../../constants/colors";
import { DropScreenProps } from "../types/DropScreen";
import PlayBar from "../../../components/playBar/PlayBar";
import CdPlayer from "../../../components/cdPlayer/CdPlayer";
import LocationMarkerSvg from "../components/LocationMarker/LocationMarkerSvg";
import GoogleMapView from "../../../components/map/GoogleMapView";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useCreateDropping } from "../hooks/useCreateDropping";
import { useContext } from "react";
import { AuthContext } from "../../auth/auth-context";
import Button from "../../../components/button/Button";

function DropScreen(){
    const route = useRoute<RouteProp<{params : DropScreenProps}, 'params'>>();
    const { musicTitle, singer, musicTime, location } = route.params;

    const {userToken} = useContext(AuthContext);
    const createDroppingMutation = useCreateDropping();

    const handleCreateDropping = () => {
        if (!userToken) {
            Alert.alert('로그인 필요', '드롭핑을 생성하려면 로그인이 필요합니다.');
            return;
        }
        
        createDroppingMutation.mutate(
            {
                songId : "test",
                content : "test",
                latitude : 35,
                longitude : 127,
                address : location
            },
            {
                onSuccess : (data) => {
                    Alert.alert('성공', '드롭핑이 성공적으로 생성되었습니다!');
                },
                onError : (err : any) => {
                    console.error('드롭핑 생성 실패:', err);
                    Alert.alert('실패', '드롭핑 생성에 실패했습니다.');
                },
            }
        )
    }
    
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
            <View style = {styles.buttonContainer}>
                <Button 
                title = "드롭핑 생성"
                onPress = {handleCreateDropping}
                disabled = {createDroppingMutation.isPending}/>
            </View>
            
        </ScrollView>
    )
}

export default DropScreen;