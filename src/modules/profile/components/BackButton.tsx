import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

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
            <Icon name="chevron-small-left" size={20} color="#fff" />
            {label ? <Text style={textStyle}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

export default BackButton;
