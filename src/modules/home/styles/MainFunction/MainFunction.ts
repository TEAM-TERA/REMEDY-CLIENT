import { StyleSheet } from "react-native";
import { rem } from "../../../../utils/scalerRem";

export const styles = StyleSheet.create({
    container : {
        bottom: 0,
        left: 0,
        display: "flex",
        width: "100%",
        height: rem(13.875),
        padding: rem(0.625),
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
        position: 'absolute',
        zIndex: 1000
    }
})