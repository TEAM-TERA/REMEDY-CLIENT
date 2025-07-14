import { Image, Text, View, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { MusicProps } from "../../types/Music";
import { TYPOGRAPHY } from "../../../../constants/typography";

function Music({ musicTitle, singer, onPress }: MusicProps) {
  return (
    <TouchableOpacity style={styles.container}
    onPress={onPress}>
      <Image
        source={{
          uri: "https://water-icon-dc4.notion.site/image/attachment%3A399b6f60-5f40-4b12-a738-fc2a9fc89758%3Aimage.png?table=block&id=22f2845a-0c9f-80e3-a337-c6043069abf5&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=200&userId=&cache=v2",
        }}
        style={styles.imgContainer}
      />
      <View style={styles.textContainer}>
        <Text style={[TYPOGRAPHY.SUBTITLE, styles.musicTitleText]}>{musicTitle}</Text>
        <Text style={[TYPOGRAPHY.CAPTION_1, styles.singerText]}>{singer}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default Music;