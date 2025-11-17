import { Image, Text, View, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { MusicProps } from "../../types/Music";
import MarqueeText from "../../../../components/marquee/MarqueeText";
import { TYPOGRAPHY } from "../../../../constants/typography";

function Music({ musicTitle, singer, onPress, imgUrl, hlsPath }: MusicProps) {
  return (
    <TouchableOpacity style={styles.container}
    onPress={onPress}>
      <Image
        source={imgUrl && imgUrl.trim() !== "" ? { uri: imgUrl } : require('../../../../assets/images/normal_music.png')}
        style={styles.imgContainer}
      />
      <View style={styles.textContainer}>
        <Text style={styles.musicTitleText}>{musicTitle}</Text>
        <Text style={[TYPOGRAPHY.CAPTION_1, styles.singerText]}>{singer}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default Music;