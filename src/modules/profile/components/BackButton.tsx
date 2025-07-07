import { TouchableOpacity, Text } from 'react-native';
import { GestureResponderEvent } from 'react-native';

type BackButtonProps = {
  label?: string;
  onPress?: (event: GestureResponderEvent) => void;
  textStyle?: object;
  containerStyle?: object;
};

function BackButton({
  label = '<',
  onPress,
  textStyle = {},
  containerStyle = {},
}: BackButtonProps) {
  const handlePress = () => {
    console.log('Back button pressed');
  };

  return (
    <TouchableOpacity onPress={onPress || handlePress} style={containerStyle}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

export default BackButton;
