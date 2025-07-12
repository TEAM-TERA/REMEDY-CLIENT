import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { TEXT_COLORS } from '../../../constants/colors';

type BackButtonProps = {
    label?: string;
    onPress?: (event: GestureResponderEvent) => void;
    textStyle?: object;
};

function BackButton({ label = '', onPress, textStyle = {} }: BackButtonProps) {
    // 기본 뒤로가기 핸들러 (onPress가 없을 때 사용)
    const handlePress = () => {};

    return (
        <TouchableOpacity onPress={onPress || handlePress}>
            {/* TODO: navigation.goBack() 또는 navigation.navigate() 로 교체 예정 */}
            <Icon name="chevron-left" size={24} color={TEXT_COLORS.DEFAULT} />
            {label ? <Text style={textStyle}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

export default BackButton;
