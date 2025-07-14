import { TouchableOpacity, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { TEXT_COLORS } from '../../../constants/colors';
import { BackButtonProps } from '../types/BackButton';

function BackButton({ label = '', onPress, textStyle = {} }: BackButtonProps) {
    const handlePress = () => {
        // 뒤로가기 네비게이션 구현
    };

    return (
        <TouchableOpacity onPress={onPress || handlePress}>
            <Entypo
                name="chevron-small-left"
                size={24}
                color={TEXT_COLORS.DEFAULT}
            />
            {label ? <Text style={textStyle}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

export default BackButton;
