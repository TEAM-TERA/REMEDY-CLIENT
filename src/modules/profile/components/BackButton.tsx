import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackButtonProps } from '../types/BackButton';
import Icon from '../../../components/icon/Icon';

function BackButton({ label = '', onPress, textStyle = {} }: BackButtonProps) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={onPress || navigation.goBack}>
            <Icon name="left" width={24} height={24} />
            {label ? <Text style={textStyle}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

export default BackButton;
