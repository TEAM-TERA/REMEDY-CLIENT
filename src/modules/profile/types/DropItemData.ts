import { ImageSourcePropType } from "react-native";

type DropItemData = {
    droppingId: string;
    memo: string;
    location: string;
    imageSource?: ImageSourcePropType;
    hasHeart: boolean;
};

export type { DropItemData };