import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalers";
import { BACKGROUND_COLORS } from "../../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : "100%",
        flex : 1,
        padding : scale(16),
        flexDirection : "column",
        alignItems : "flex-start",
        gap : scale(24),
        backgroundColor : BACKGROUND_COLORS.BACKGROUND
    },
    inputContainer : {
        display : "flex",
        padding : scale(0),
        alignItems : "center",
        gap : scale(12),
        alignSelf : "stretch"
    },
    searchLogContainer : {
        display : "flex",
        padding : scale(12),
        alignItems : "flex-start",
        flexDirection : "column",
        gap : scale(12),
        alignSelf : "stretch"
    },
    recommendMusicContainer : {
        display : "flex",
        padding : scale(12),
        alignItems : "flex-start",
        flexDirection : "column",
        gap : scale(12),
        alignSelf : "stretch"
    }
})