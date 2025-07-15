import { StyleSheet } from "react-native";
import { TEXT_COLORS } from "../../constants/colors";
import { scale } from "../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        padding : scale(12),
        flexDirection : "column",
        alignItems : "flex-start",
        gap : scale(12),
        alignSelf : "stretch"
    },
    timeText : {
        color : TEXT_COLORS.DEFAULT
    }

})