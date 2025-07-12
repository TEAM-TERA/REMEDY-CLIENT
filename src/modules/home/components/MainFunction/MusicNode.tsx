import { Image, View, TouchableOpacity, Text } from "react-native";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { styles } from "../../styles/MainFunction/MusicNode";

interface MusicNodeProps {
  isFirst?: boolean;
}

function MusicNode({isFirst}: MusicNodeProps){
    return(
        <TouchableOpacity style = {isFirst ? styles.container : styles.subContainer}>
            <Image 
              source={{ uri: "https://water-icon-dc4.notion.site/image/attachment%3Ab9bf731d-818d-401f-ad45-93d3b397b092%3Aimage.png?table=block&id=22e2845a-0c9f-80d8-b078-e961135b029a&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=2000&userId=&cache=v2" }}
              style={isFirst ? styles.musicImg : styles.subMusicImg}
            />
            <Text style = {[TYPOGRAPHY.BODY_1, isFirst ? styles.musicTitle : styles.subMusicTitle]}>LILAC</Text>
            <Text style = {[TYPOGRAPHY.CAPTION_2, isFirst ? styles.singerText : styles.subSingerText]}>아이유</Text>
        </TouchableOpacity>
    )
}

export default MusicNode;