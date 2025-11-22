import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { TEXT_COLORS, FORM_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        flexDirection : "row",
        marginLeft : "auto",
        marginRight : "auto",
        width : scale(343),
        padding : scale(0),
        justifyContent : "space-between",
        alignItems : "center"
    },
    centerContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8),
        paddingVertical: scale(4),
        paddingHorizontal: scale(16),
        borderRadius: scale(16),
        backgroundColor : FORM_COLORS.BACKGROUND_3,
    },
    text : {
        textAlign : "center",
        color : TEXT_COLORS.CAPTION_1
    }
})