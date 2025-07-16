import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : scale(375),
        flexDirection : "column",
        justifyContent : "space-between",
        alignItems : "center",
        flex : scale(1)
    }
})