import { StyleSheet } from "react-native";
import { scale } from "../../utils/scalers";
import { TEXT_COLORS, UI_COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    container : {
        display : "flex",
        height : scale(46),
        padding : scale(12),
        justifyContent : "center",
        gap : scale(8),
        alignSelf : "stretch",
        borderRadius : scale(8),
        backgroundColor : UI_COLORS.BACKGROUND,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    containerError: {
        borderColor: '#EF4444',
        borderWidth: 1,
    },
    text : {
        color : TEXT_COLORS.DEFAULT,
        textAlign : "left"
    },
    errorText: {
        color: '#EF4444',
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