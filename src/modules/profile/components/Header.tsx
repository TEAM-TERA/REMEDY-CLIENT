import React from 'react';
import { View, Text } from 'react-native';
import BackButton from './BackButton';
import nameEditScreen from '../styles/nameEditScreen';

type HeaderProps = {
    title: string;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
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
        <View style={[nameEditScreen.headerContainer, headerStyle]}>
            <BackButton
                textStyle={[nameEditScreen.backButton, backButtonStyle]}
                onPress={onBackPress}
            />
            <Text style={[nameEditScreen.title, titleStyle]}>{title}</Text>
            {rightComponent || <View style={nameEditScreen.rightComponent} />}
        </View>
    );
}
export default Header;
