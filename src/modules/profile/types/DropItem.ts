import { ImageSourcePropType } from 'react-native';

export type DropItemProps = {
    memo: string;
    location: string;
    imageSource?: ImageSourcePropType;
    hasHeart?: boolean;
};
