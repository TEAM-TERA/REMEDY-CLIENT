import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalers";
import { BACKGROUND_COLORS, PRIMARY_COLORS, TEXT_COLORS } from "../../../constants/colors";

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
        flexDirection : "row",
        padding : scale(0),
        alignItems : "center",
        marginLeft : "auto",
        marginRight : "auto",
        alignSelf : "stretch"
    },
    recommendMusicContainer : {
        display : "flex",
        padding : scale(12),
        alignItems : "flex-start",
        flexDirection : "column",
        gap : scale(12),
        marginLeft : "auto",
        marginRight : "auto",
        alignSelf : "stretch"
    },
    recommendText : {
        color : PRIMARY_COLORS.DEFAULT,
        textAlign : "center"
    },
    textContainer : {
        display : "flex",
        padding : scale(0),
        alignItems : "flex-start",
        gap : scale(8),
        alignSelf : "stretch"
        
    },
    searchMusicContainer : {
        padding: scale(12),
        flex: 1,
        alignSelf: "stretch"
    },
    searchMusicContent: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: scale(0)
    }
})

export const historyStyles = StyleSheet.create({
    logText : {
        color : TEXT_COLORS.CAPTION,
        textAlign : "center"
    },
    logContainer : {
        display : "flex",
        width : scale(345),
        padding : scale(12),
        alignItems : "flex-start",
        flexDirection : "column",
        gap : scale(12),
        marginLeft : "auto",
        marginRight : "auto",
        alignSelf : "stretch"
    },
    historyContainer : {
        display : "flex",
        alignItems: "flex-start",
        gap : scale(8),
        alignSelf : "stretch"
    }
})