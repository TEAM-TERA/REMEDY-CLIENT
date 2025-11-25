import { StyleProp, ViewStyle } from "react-native";

export type InputProps = {
    placeholder? : string;
    value? : string;
    onChangeText? : (text : string) => void;
    width? : number | `${number}%`;
    containerWidth?: number | `${number}%`;
    onSubmitEditing? : ()=>void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    error?: string;
    helperText?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    style?: StyleProp<ViewStyle>;
};
