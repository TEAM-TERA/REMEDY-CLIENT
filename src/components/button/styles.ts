import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalers";
import { TEXT_COLORS, PRIMARY_COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        height : scale(46),
        padding : scale(12),
        justifyContent : "center",
        alignItems : "center",
        gap : scale(8),
        alignSelf : "stretch",
        backgroundColor : PRIMARY_COLORS.DEFAULT
    },
    text : {
        color : TEXT_COLORS.DEFAULT
    }
})