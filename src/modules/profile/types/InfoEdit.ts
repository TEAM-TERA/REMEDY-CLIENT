export type GenderType = 'male' | 'female';

export type InfoEditFormData = {
    name: string;
    birthDate: string;
    gender: GenderType;
};

export type GenderButtonProps = {
    label: string;
    isSelected: boolean;
    onPress: () => void;
};

export type DateInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    onDatePickerPress: () => void;
    placeholder?: string;
    label: string;
};

export type FormInputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};
