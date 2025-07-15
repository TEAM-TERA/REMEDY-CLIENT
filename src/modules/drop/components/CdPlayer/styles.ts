import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { BACKGROUND_COLORS, TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : scale(396.613),
        justifyContent: "center",
        alignItems: "center",
        borderRadius : scale(615.859),
        backgroundColor : TEXT_COLORS.DEFAULT,
        shadowColor : "#F23F6F",
        shadowOffset : { width : scale(0), height : scale(4) },
        shadowOpacity : scale(0.15),
        shadowRadius : scale(4)
    },
    imgContainer : {
        width : scale(419.332),
        height : scale(418.076),
        flexShrink: scale(0),
        aspectRatio: scale(419.33/418.08),
        borderRadius: scale(5)
    },
    bigShape : {
        width : scale(120),
        height : scale(120),
        flexShrink: scale(0),
        backgroundColor : "rgba(19, 3, 9, 0.50)"
    },
    smallShape : {
        width : scale(80),
        height : scale(80),
        flexShrink: scale(0),
        backgroundColor : BACKGROUND_COLORS.BACKGROUND_RED,
    }
})