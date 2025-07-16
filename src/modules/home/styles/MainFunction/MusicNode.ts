import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { PRIMARY_COLORS,TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
    container : {
        display : "flex",
        flexDirection : "column",
        alignItems: "center",
        gap : scale(0.25),
        marginLeft : scale(1)
    },
    subContainer : {
        display : "flex",
        flexDirection : "column",
        alignItems: "center",
        gap : scale(0.1875),
        opacity : 0.4
    },
    musicImg : {
        width: scale(4.70156),
        height: scale(4.6875),
        flexShrink: 0,
        aspectRatio: 75.23/75.00,
        borderRadius: scale(0.15625)
    },
    subMusicImg : {
        width: scale(3.52619),
        height: scale(3.51563),
        flexShrink: 0,
        aspectRatio: 56.42/56.25,
        borderRadius: scale(0.11719)
    },
    musicTitle : {
        color : PRIMARY_COLORS.DEFAULT
    },
    singerText : {
        color : PRIMARY_COLORS.PLUS_TWENTY
    },
    subMusicTitle : {
        color : TEXT_COLORS.DEFAULT,
        fontSize : scale(0.75)
    },
    subSingerText : {
        color : TEXT_COLORS.DEFAULT,
        fontSize : scale(0.65625)
    }
})