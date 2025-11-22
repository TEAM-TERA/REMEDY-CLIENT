import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalers";
import { TEXT_COLORS, FORM_COLORS, PRIMARY_COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    container : {
        display : "flex",
        flexDirection: "row",
        alignItems: "center",
        height : scale(46),
        padding : scale(12),
        gap : scale(8),
        alignSelf : "stretch",
        borderRadius : scale(8),
        backgroundColor : FORM_COLORS.INPUT_1,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    containerError: {
        borderColor: PRIMARY_COLORS.DEFAULT,
        borderWidth: 1,
    },
    text : {
        color : TEXT_COLORS.DEFAULT,
        textAlign : "left"
    },
    textFlex: {
        flex: 1,
    },
    textAndroid: {
        paddingVertical: 0,
        textAlignVertical: 'center',
    },
    containerCentered: {
        alignSelf: 'center',
        borderRadius: 8,
    },
    errorText: {
        color: PRIMARY_COLORS.DEFAULT,
        fontSize: scale(12),
        marginTop: scale(4),
        marginLeft: scale(4),
    },
    helperText: {
        color: TEXT_COLORS.CAPTION,
        fontSize: scale(12),
        marginTop: scale(4),
        marginLeft: scale(4),
    },
})