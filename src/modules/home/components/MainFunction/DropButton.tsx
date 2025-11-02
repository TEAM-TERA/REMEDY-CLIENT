import React from 'react';
import { Pressable, View, Text, Platform } from 'react-native';
import Svg, { G, Circle, Path, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';
import { styles } from '../../styles/MainFunction/DropButton';
import { TYPOGRAPHY } from '../../../../constants/typography';

type Props = {
  onPress?: () => void;
};

export default function DropButton({ onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Drop music"
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: true }}
      style={styles.container}
      hitSlop={12}
    >
      <Svg width="120" height="112" viewBox="0 0 120 112" fill="none">
        {Platform.OS === 'android' ? (
          <Circle cx="60" cy="56" r="50" fill="#F3124E" />
        ) : (
          <G transform="translate(-22,-22)">
            <G filter="url(#filter0_d_6509_1724)">
              <Circle cx="90" cy="90" r="70" fill="#F3124E"/>
            </G>
            <Path d="M83.5461 43.9682C83.5461 43.3873 83.3291 42.8369 82.9547 42.4686C82.5803 42.1003 82.088 41.9528 81.6133 42.0667L65.4538 45.945C64.6984 46.1263 64.1547 46.9221 64.1547 47.8465V65.5194C63.6493 65.3765 63.1054 65.2987 62.5388 65.2987C59.8614 65.2987 57.6909 67.0351 57.6909 69.177C57.6909 71.3189 59.8614 73.0553 62.5388 73.0553C65.2162 73.0553 67.3866 71.3189 67.3866 69.177V53.3145L80.3142 50.2119V61.6411C79.8088 61.4982 79.2649 61.4205 78.6983 61.4205C76.0209 61.4205 73.8504 63.1568 73.8504 65.2987C73.8504 67.4406 76.0209 69.177 78.6983 69.177C81.3757 69.177 83.5461 67.4406 83.5461 65.2987V43.9682Z" fill="#D6D6DC"/>
            <Path d="M55.2656 97H51.2812V85.6875H55.3125C58.7188 85.6875 60.7969 87.8125 60.7969 91.3281C60.7969 94.875 58.7188 97 55.2656 97ZM53.625 94.9844H55.1719C57.3281 94.9844 58.4531 93.8594 58.4531 91.3281C58.4531 88.8125 57.3281 87.7031 55.1875 87.7031H53.625V94.9844ZM62.5 97V85.6875H66.9375C69.5156 85.6875 70.9844 87.1406 70.9844 89.375C70.9844 90.9219 70.2734 92.0469 68.9844 92.5938L71.3906 97H68.7969L66.6406 92.9844H64.8438V97H62.5ZM64.8438 91.0781H66.5C67.8906 91.0781 68.5625 90.5 68.5625 89.375C68.5625 88.2344 67.8906 87.6094 66.5 87.6094H64.8438V91.0781ZM82.9688 91.3438C82.9688 95.0312 80.6719 97.1562 77.6875 97.1562C74.6719 97.1562 72.3906 95.0156 72.3906 91.3438C72.3906 87.6562 74.6719 85.5312 77.6875 85.5312C80.6719 85.5312 82.9688 87.6562 82.9688 91.3438ZM80.5781 91.3438C80.5781 88.9219 79.4375 87.6094 77.6875 87.6094C75.9375 87.6094 74.7812 88.9219 74.7812 91.3438C74.7812 93.7656 75.9375 95.0781 77.6875 95.0781C79.4375 95.0781 80.5781 93.7656 80.5781 91.3438ZM84.6562 97V85.6875H89.0938C91.6719 85.6875 93.1406 87.2656 93.1406 89.5C93.1406 91.7656 91.6406 93.3125 89.0312 93.3125H87V97H84.6562ZM87 91.4219H88.6562C90.0469 91.4219 90.7188 90.6406 90.7188 89.5C90.7188 88.375 90.0469 87.6094 88.6562 87.6094H87V91.4219Z" fill="#D6D6DC"/>
          </G>
        )}
        <Defs>
          <Filter id="filter0_d_6509_1724" x="0" y="0" width="180" height="180" filterUnits="userSpaceOnUse">
            <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
            <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <FeOffset/>
            <FeGaussianBlur stdDeviation="10"/>
            <FeComposite in2="hardAlpha" operator="out"/>
            <FeColorMatrix type="matrix" values="0 0 0 0 0.937255 0 0 0 0 0.0627451 0 0 0 0 0.298039 0 0 0 1 0"/>
            <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6509_1724"/>
            <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6509_1724" result="shape"/>
          </Filter>
        </Defs>
      </Svg>
      {Platform.OS === 'android' && (
        <View style={styles.badge} pointerEvents="none">
          <Text style={[styles.badgeText, TYPOGRAPHY.BUTTON_TEXT]}>DROP</Text>
        </View>
      )}
    </Pressable>
  );
}