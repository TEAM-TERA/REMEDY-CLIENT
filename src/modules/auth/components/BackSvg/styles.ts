import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        width : scale(20),
        height : scale(20),
        flexShrink : 0,
        aspectRatio: 1/1
    }
})