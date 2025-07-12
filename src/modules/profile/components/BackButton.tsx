import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { TEXT_COLORS } from '../../../constants/colors';

type BackButtonProps = {
    label?: string;
    onPress?: (event: GestureResponderEvent) => void;
    textStyle?: object;
};

function BackButton({ label = '', onPress, textStyle = {} }: BackButtonProps) {
    const handlePress = () => {
        console.log('Back button pressed');
    };

    return (
        <TouchableOpacity onPress={onPress || handlePress}>
            <Icon name="chevron-left" size={24} color={TEXT_COLORS.DEFAULT} />
            {label ? <Text style={textStyle}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

export default BackButton;
