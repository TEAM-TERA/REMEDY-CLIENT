export type InputProps = {
    placeholder? : string;
    value? : string;
    onChangeText? : (text : string) => void;
    width? : number | `${number}%`;
    onSubmitEditing? : ()=>void;
};