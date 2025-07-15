import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        height : scale(240),
        padding : scale(10),
        flexDirection : "column",
        alignItems : "center",
        gap : scale(10)
    }
})