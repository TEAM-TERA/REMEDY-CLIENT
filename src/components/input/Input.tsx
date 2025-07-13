import { View, TextInput } from "react-native";
import { InputProps } from "../../types/Input";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../constants/typography";

function Input({placeholder} : InputProps){
    return(
        <View style = {styles.container}>
            <TextInput
            style = {[TYPOGRAPHY.INPUT_TEXT, styles.text]}
            placeholder={placeholder}/>
        </View>
    )
}

export default Input;