import React from 'react';
import { View, Text } from 'react-native';
import BackButton from './BackButton';
import commonStyles from '../style';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode; // 오른쪽에 버튼 등 추가 가능
  headerStyle?: object;
  titleStyle?: object;
  backButtonStyle?: object;
};

function Header({
  title,
  onBackPress,
  rightComponent,
  headerStyle = {},
  titleStyle = {},
  backButtonStyle = {},
}: HeaderProps) {
  return (
    <View style={[commonStyles.headerContainer, headerStyle]}>
      <BackButton
        textStyle={[commonStyles.backButton, backButtonStyle]}
        onPress={onBackPress}
      />
      <Text style={[commonStyles.title, titleStyle]}>{title}</Text>
      {rightComponent || <View />}
    </View>
  );
}
export default Header;
