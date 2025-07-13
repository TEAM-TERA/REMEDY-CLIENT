import { StyleSheet } from "react-native";
import { rem } from "../../../../utils/scalerRem";
import { TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : rem(21.4375),
        padding : rem(0),
        justifyContent : "space-between",
        alignItems : "center"
    },
    text : {
        textAlign : "center",
        color : TEXT_COLORS.DEFAULT
    }
})