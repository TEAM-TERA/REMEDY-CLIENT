export type InputProps = {
    placeholder? : string;
    value? : string;
    onChangeText? : (text : string) => void;
    width? : number | `${number}%`;
    onSubmitEditing? : ()=>void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    error?: string;
};