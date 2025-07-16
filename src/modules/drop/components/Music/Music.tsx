import { Image, Text, View, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { MusicProps } from "../../types/Music";
import { TYPOGRAPHY } from "../../../../constants/typography";

function Music({ musicTitle, singer, onPress, imgUrl }: MusicProps) {
  return (
    <TouchableOpacity style={styles.container}
    onPress={onPress}>
      <Image
        source={{
          uri: imgUrl,
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