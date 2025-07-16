import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        bottom: 0,
        left: 0,
        display: "flex",
        width: "100%",
        height: scale(13.875),
        padding: scale(0.625),
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
        position: 'absolute',
        zIndex: 1000
    }
})