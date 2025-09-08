import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { TYPOGRAPHY } from "../../constants/typography";
import { TEXT_COLORS, PRIMARY_COLORS } from "../../constants/colors";
import Slider from "@react-native-community/slider";
import formatTime from "../../modules/drop/utils/formatTime";
import { PlayBarProps } from "../../modules/drop/types/PlayBar";
import PlaySvg from "./PlaySvg";

function PlayBar({ currentTime, musicTime, onSeek, onTogglePlay, isPlaying }: PlayBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onTogglePlay}>
        <PlaySvg /> 
      </TouchableOpacity>
      
      <Text style={[TYPOGRAPHY.CAPTION_3, styles.timeText]}>
        {formatTime(currentTime)}
      </Text>
      <Slider
        style={styles.sliderContainer}
        minimumValue={0}
        maximumValue={musicTime}
        value={currentTime}
        minimumTrackTintColor={PRIMARY_COLORS.DEFAULT}
        maximumTrackTintColor={TEXT_COLORS.DEFAULT}
        thumbTintColor={TEXT_COLORS.DEFAULT}
        onValueChange={onSeek}
      />
      <Text style={[TYPOGRAPHY.CAPTION_3, styles.timeText]}>
        {formatTime(musicTime)}
      </Text>
    </View>
  );
}


export default PlayBar;