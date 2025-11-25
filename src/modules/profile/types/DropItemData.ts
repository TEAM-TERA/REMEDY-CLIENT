import { ImageSourcePropType } from "react-native";

type DropItemData = {
    droppingId: string;
    memo: string;
    artist?: string;
    location: string;
    imageSource?: ImageSourcePropType;
    hasHeart: boolean;
};

export type { DropItemData };