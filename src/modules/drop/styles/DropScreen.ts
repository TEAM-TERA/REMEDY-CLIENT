import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        width : scale(375),
        padding : scale(16),
        flexDirection : "column",
        alignItems: "center",
        gap : scale(24)
    }
});