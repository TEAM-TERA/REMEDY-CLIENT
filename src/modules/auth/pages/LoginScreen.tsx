import { Text, View, SafeAreaView } from "react-native";
import { styles } from "../styles/LoginScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";
import HeaderNav from "../components/HeaderNav/HeaderNav";

function LoginScreen(){
    return(
        <SafeAreaView style = { styles.container }>
            <HeaderNav></HeaderNav>
            <View style = {styles.inputContainer}>
                <Input placeholder="이메일을 입력해주세요"></Input>
                <Input placeholder="비밀번호를 입력해주세요"></Input>
            </View>
            <View style = {styles.buttonContainer}>
                <Button title = {"로그인"}/>
                <View style = {styles.textContainer}>
                    <Text style = {[styles.text, TYPOGRAPHY.CAPTION_1]}>비밀번호 재설정</Text>
                    <Text style = {[styles.text, TYPOGRAPHY.CAPTION_1]}>회원가입</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen;