import { TouchableOpacity, Text } from 'react-native';
import { BackButtonProps } from '../types/BackButton';
import Icon from '../../../components/icon/Icon';

function BackButton({ label = '', onPress, textStyle = {} }: BackButtonProps) {
    const handlePress = () => {
        // 뒤로가기 네비게이션 구현
    };

    return (
        <TouchableOpacity onPress={onPress || handlePress}>
            <Icon name="left" width={24} height={24} />
            {label ? <Text style={textStyle}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

export default BackButton;
