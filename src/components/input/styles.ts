import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalers";
import { TEXT_COLORS, UI_COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        height : scale(46),
        padding : scale(12),
        gap : scale(8),
        alignSelf : "stretch",
        backgroundColor : UI_COLORS.BACKGROUND
    },
    text : {
        color : TEXT_COLORS.CAPTION,
        textAlign : "left"
    }
})