import { StyleSheet } from "react-native";
import { PRIMARY_COLORS, BACKGROUND_COLORS } from "../../../constants/colors";
import { scale } from "../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : scale(375),
        padding : scale(16),
        flexDirection : "column",
        alignItems: "center",
        gap : scale(24),
        backgroundColor : BACKGROUND_COLORS.BACKGROUND_RED
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
    }
});