import React from 'react';
import { View, Text } from 'react-native';
import BackButton from './BackButton';
import nameEditScreen from '../styles/NameEditScreen';
import { HeaderProps } from '../types/Header';

function Header({
    title,
    onBackPress,
    rightComponent,
    headerStyle = {},
    titleStyle = {},
}: HeaderProps) {
    return (
        <View style={[nameEditScreen.headerContainer, headerStyle]}>
            <BackButton
                textStyle={nameEditScreen.backButton}
                onPress={onBackPress}
            />
            <Text style={[nameEditScreen.title, titleStyle]}>{title}</Text>
            {rightComponent || <View />}
        </View>
    );
}
export default Header;
