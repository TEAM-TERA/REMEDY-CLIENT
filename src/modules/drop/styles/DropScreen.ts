import { StyleSheet } from "react-native";
import { PRIMARY_COLORS, BACKGROUND_COLORS, TEXT_COLORS, UI_COLORS } from "../../../constants/colors";
import { scale } from "../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : scale(375),
        padding : scale(16),
        flexDirection : "column",
        gap : scale(24),
        backgroundColor : BACKGROUND_COLORS.BACKGROUND
    },
    contentContainer: {
        alignItems: "center"
    },
    playerContainer : {
        display : "flex",
        padding : scale(12),
        flexDirection : "column",
        alignItems : "flex-start",
        gap : scale(12),
        alignSelf: "stretch"
    },
    textContainer : {
        display : "flex",
        padding : scale(0),
        alignItems : "flex-start",
        gap : scale(0),
        alignSelf: "stretch"
    },
    informationContainer : {
        display : "flex",
        padding : scale(12),
        flexDirection : "column",
        alignItems : "flex-start",
        gap : scale(12),
        alignSelf: "stretch"
    },
    titleText : {
        color : PRIMARY_COLORS.DEFAULT,
        textAlign : "center"
    },
    singerText : {
        color : PRIMARY_COLORS.PLUS_TWENTY,
        textAlign : "center"
    },
    remainTextContainer : {
        display : "flex",
        padding : scale(0),
        alignItems : "flex-start",
        gap : scale(8),
        alignSelf : "stretch"
    },
    remainText : {
        color : TEXT_COLORS.DEFAULT,
        textAlign : "center"
    },
    remainInput : {
        display : "flex",
        height : scale(128),
        padding : scale(12),
        justifyContent : "space-between",
        alignItems : "flex-start",
        alignSelf : "stretch",
        borderRadius : scale(12),
        color : TEXT_COLORS.DEFAULT,
        backgroundColor : UI_COLORS.BACKGROUND_RED
    },
    locationContainer : {
        display : "flex",
        flexDirection : "row",
        padding : scale(0),
        justifyContent : "center",
        alignItems : "center",
        gap : scale(4)
    },
    locationText : {
        color : PRIMARY_COLORS.PLUS_TWENTY
    },
    buttonContainer : {
        display : "flex",
        padding : scale(12),
        flexDirection: "column",
        alignItems: "flex-start",
        gap : scale(12),
        alignSelf: "stretch"
    }
});