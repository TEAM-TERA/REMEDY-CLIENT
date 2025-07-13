import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { BACKGROUND_COLORS, TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : scale(323),
        height : scale(74),
        flexDirection : "row",
        paddingVertical : scale(12),
        paddingHorizontal : scale(0),
        alignItems : "center",
        gap : scale(8),
        backgroundColor : BACKGROUND_COLORS.BACKGROUND
    },
    textContainer : {
        display : "flex",
        padding : scale(0),
        flexDirection : "column",
        justifyContent : "center",
        alignItems : "flex-start",
        gap : scale(0),
        flex : 1,
        alignSelf : "stretch"
    },
    imgContainer : {
        width : scale(54.162),
        height : scale(54),
        flexShrink : 0,
        aspectRatio : 54.16/54.00
    },
    musicTitleText : {
        color : TEXT_COLORS.DEFAULT,
        textAlign : "center"
    },
    singerText : {
        color : TEXT_COLORS.CAPTION_LIGHTER,
        textAlign : "center"
    }
})