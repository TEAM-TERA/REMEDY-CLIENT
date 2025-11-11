import React from 'react';
import { Text, TextStyle, ViewStyle, StyleSheet } from 'react-native';
import { Marquee } from '@animatereactnative/marquee';

type MarqueeTextProps = {
  text: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  thresholdChars?: number;
  spacing?: number;
  speed?: number;
};

function MarqueeText({
  text,
  textStyle,
  containerStyle,
  thresholdChars = 18,
  spacing = 100,
  speed = 0.35,
}: MarqueeTextProps) {
  const shouldMarquee = (text || '').length > thresholdChars;

  if (shouldMarquee) {
    return (
      <Marquee
        style={StyleSheet.flatten([{ width: '100%' } as ViewStyle, containerStyle])}
        spacing={spacing}
        speed={speed}
      >
        <Text style={textStyle}>{text}</Text>
      </Marquee>
    );
  }

  return (
    <Text style={textStyle} numberOfLines={1} ellipsizeMode="tail">
      {text}
    </Text>
  );
}

export default MarqueeText;