import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalers";
import { TEXT_COLORS, UI_COLORS } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container : {
    display : "flex",
    flex : 1,
    padding : scale(16),
    flexDirection : "column",
    alignItems : "flex-start",
    gap : scale(24),
    backgroundColor : UI_COLORS.BACKGROUND
  },
  textContainer : {
    display : "flex",
    padding : scale(0),
    justifyContent : "center",
    alignItems : "center",
    gap : scale(24),
    alignSelf : "stretch"
  },
  text : {
    color : TEXT_COLORS.DEFAULT
  },
  inputContainer : {
    display : "flex",
    width : scale(343),
    padding : scale(12),
    flexDirection : "column",
    justifyContent : "center",
    alignItems : "center",
    gap : scale(24)
  },
  buttonContainer : {
    display : "flex",
    width : scale(343),
    padding : scale(12),
    flexDirection : "column",
    justifyContent : "center",
    alignItems : "center",
    gap : scale(16)
  }
});