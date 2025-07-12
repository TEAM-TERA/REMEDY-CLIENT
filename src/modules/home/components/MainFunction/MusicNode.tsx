import { Image, View, TouchableOpacity, Text } from "react-native";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { styles } from "../../styles/MusicNode";

function MusicNode(){
    return(
        <TouchableOpacity style = {styles.container}>
            <Image></Image>
            <Text style = {TYPOGRAPHY.BODY_1}>LILAC</Text>
            <Text style = {TYPOGRAPHY.CAPTION_2}>아이유</Text>
        </TouchableOpacity>
    )
}

export default MusicNode;