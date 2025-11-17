import { ViewStyle, TextStyle } from 'react-native';

export type HeaderProps = {
    title?: string;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode;
    headerStyle?: ViewStyle;
    titleStyle?: TextStyle;
};
