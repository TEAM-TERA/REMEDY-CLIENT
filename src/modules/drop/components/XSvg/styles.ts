import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        width : scale(15),
        height : scale(16),
        flexShrink : 0,
        aspectRatio: 1/1
    }
})