import { Text, View } from "react-native";
import { styles } from "../styles/LoginScreen";
import { TYPOGRAPHY } from "../../../constants/typography";
import Input from "../../../components/input/Input";
import Button from "../../../components/button/Button";

function LoginScreen(){
    return(
        <View style = { styles.container }>
            <View style = {styles.inputContainer}>
                <Input></Input>
                <Input></Input>
            </View>
            <View style = {styles.buttonContainer}>
                <Button title = {"로그인"}/>
                <View style = {styles.textContainer}>
                    <Text style = {[styles.text, TYPOGRAPHY.CAPTION_1]}>비밀번호 재설정</Text>
                    <Text style = {[styles.text, TYPOGRAPHY.CAPTION_1]}>회원가입</Text>
                </View>
            </View>
        </View>
    )
}