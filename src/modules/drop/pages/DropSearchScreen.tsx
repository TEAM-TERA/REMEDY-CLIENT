import { View, SafeAreaView, Text } from "react-native";
import { styles } from "../styles/DropSearchScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import BackSvg from "../../auth/components/BackSvg/BackSvg";
import Input from "../../../components/input/Input";

function DropSearchScreen(){
    return(
        <SafeAreaView style = {styles.container}>
            <View style = {styles.inputContainer}>
                <BackSvg></BackSvg>
                <Input placeholder="드랍할 음악 검색"></Input>
            </View>
            <View style = {styles.searchLogContainer}>
                <View style = {styles.textContainer}>
                    <Text style = {[TYPOGRAPHY.BODY_1, styles.logText]}>검색 기록</Text>
                </View>
            </View>
            <View style = {styles.recommendMusicContainer}>
                <View style = {styles.textContainer}>
                    <Text style = {[TYPOGRAPHY.HEADLINE_2, styles.recommendText]}>추천 음악</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default DropSearchScreen;