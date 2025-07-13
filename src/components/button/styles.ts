import { StyleSheet } from "react-native";
import { rem } from "../../utils/scalerRem";
import { TEXT_COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        height : rem(2.875),
        padding : rem(0.75),
        justifyContent : "center",
        alignItems : "center",
        gap : rem(0.5),
        alignSelf : "stretch"
    },
    text : {
        color : TEXT_COLORS.DEFAULT
    }
})