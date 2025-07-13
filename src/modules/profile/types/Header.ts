import { ViewStyle, TextStyle } from 'react-native';

export type HeaderProps = {
    title: string;
    onBackPress?: () => void;
    rightComponent?: React.ReactNode; // 오른쪽에 버튼 등 추가 가능
    headerStyle?: ViewStyle;
    titleStyle?: TextStyle;
};
