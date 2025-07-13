import { GestureResponderEvent, TextStyle } from 'react-native';

export type BackButtonProps = {
    label?: string;
    onPress?: (event: GestureResponderEvent) => void;
    textStyle?: TextStyle;
};
