import { View, SafeAreaView, Text } from "react-native";
import { styles, historyStyles } from "../styles/DropSearchScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import BackSvg from "../../auth/components/BackSvg/BackSvg";
import Input from "../../../components/input/Input";
import History from "../components/History/History";
import Music from "../components/Music/Music";

function DropSearchScreen(){
    return(
        <SafeAreaView style = {styles.container}>
            <View style = {styles.inputContainer}>
                <BackSvg></BackSvg>
                <Input placeholder="드랍할 음악 검색"></Input>
            </View>
            <View style = {historyStyles.logContainer}>
                <View style = {styles.textContainer}>
                    <Text style = {[TYPOGRAPHY.BODY_1, historyStyles.logText]}>검색 기록</Text>
                    <View style = {historyStyles.historyContainer}>
                        <History musicTitle="Lilac"></History>
                    </View>
                </View>
            </View>
            <View style = {styles.recommendMusicContainer}>
                <View style = {styles.textContainer}>
                    <Text style = {[TYPOGRAPHY.HEADLINE_2, styles.recommendText]}>추천 음악</Text>
                    <Music musicTitle="LILAC" singer="아이유"></Music>
                    <Music musicTitle="LILAC" singer="아이유"></Music>
                    <Music musicTitle="LILAC" singer="아이유"></Music>
                    
                </View>
            </View>
        </SafeAreaView>
    )
}

export default DropSearchScreen;