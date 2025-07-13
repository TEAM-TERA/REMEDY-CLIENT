import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : scale(343),
        padding : scale(0),
        justifyContent : "space-between",
        alignItems : "center"
    },
    text : {
        textAlign : "center",
        color : TEXT_COLORS.DEFAULT
    }
})