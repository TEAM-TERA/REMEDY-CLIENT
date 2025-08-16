import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";

export const styles = StyleSheet.create({
    container : {
        width : scale(19.625),
        height: scale(21.375),
        position : "absolute", 
        right : scale(-7.5),
        bottom : scale(-7.5)
    }
})