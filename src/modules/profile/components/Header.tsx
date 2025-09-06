import React from 'react';
import { View, Text } from 'react-native';
import BackButton from './BackButton';
import { styles } from '../styles/NameEditScreen';
import { HeaderProps } from '../types/Header';

function Header({
    title,
    onBackPress,
    rightComponent,
    headerStyle = {},
    titleStyle = {},
}: HeaderProps) {
    return (
        <View style={[styles.headerContainer, headerStyle]}>
            <BackButton
                textStyle={styles.backButton}
                onPress={onBackPress}
            />
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            {rightComponent || <View style={styles.rightComponent} />}
        </View>
    );
}
export default Header;
