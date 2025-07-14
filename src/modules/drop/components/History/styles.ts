import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        flexDirection : "row",
        height : scale(24),
        paddingVertical : scale(4),
        paddingHorizontal : scale(8),
        justifyContent : "center",
        alignItems : "center",
        gap : scale(4),
        backgroundColor : "#1A1A1A",
        borderRadius: scale(24)
    },
    text : {
        color : TEXT_COLORS.DEFAULT,
        textAlign : "center"
    }
})