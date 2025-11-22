import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { MusicProps } from "../../types/Music";
import MarqueeText from "../../../../components/marquee/MarqueeText";
import { TYPOGRAPHY } from "../../../../constants/typography";

const Music = React.memo(function Music({ musicTitle, singer, onPress, imgUrl, hlsPath, disabled = false }: MusicProps) {
  const imageSource = React.useMemo(() => {
    return imgUrl && imgUrl.trim() !== "" ? { uri: imgUrl } : require('../../../../assets/images/normal_music.png');
  }, [imgUrl]);

  const containerStyle = React.useMemo(() => {
    return [styles.container, disabled && styles.disabledContainer];
  }, [disabled]);

  const imageStyle = React.useMemo(() => {
    return [styles.imgContainer, disabled && styles.disabledImage];
  }, [disabled]);

  const titleStyle = React.useMemo(() => {
    return [styles.musicTitleText, disabled && styles.disabledText];
  }, [disabled]);

  const singerStyle = React.useMemo(() => {
    return [TYPOGRAPHY.CAPTION_1, styles.singerText, disabled && styles.disabledText];
  }, [disabled]);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Image
        source={imageSource}
        style={imageStyle}
      />
      <View style={styles.textContainer}>
        <Text style={titleStyle}>{musicTitle}</Text>
        <Text style={singerStyle}>{singer}</Text>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.musicTitle === nextProps.musicTitle &&
    prevProps.singer === nextProps.singer &&
    prevProps.imgUrl === nextProps.imgUrl &&
    prevProps.disabled === nextProps.disabled
  );
});

export default Music;