import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackButtonProps } from '../types/BackButton';
import Icon from '../../../components/icon/Icon';
import { scale } from '../../../utils/scalers';

function BackButton({ label = '', onPress, textStyle = {} }: BackButtonProps) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={onPress || navigation.goBack}>
            <Icon name="left" width={scale(24)} height={scale(24)} />
            {label ? <Text style={textStyle}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

export default BackButton;
