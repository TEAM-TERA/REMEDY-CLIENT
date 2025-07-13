import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalers";
import { TEXT_COLORS, BACKGROUND_COLORS } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container : {
    display : "flex",
    width : "100%",
    flex : 1,
    padding : scale(16),
    flexDirection : "column",
    alignItems : "flex-start",
    gap : scale(24),
    backgroundColor : BACKGROUND_COLORS.BACKGROUND
  },
  textContainer : {
    marginLeft : "auto",
    marginRight : "auto",
    display : "flex",
    padding : scale(0),
    justifyContent : "center",
    alignItems : "center",
    gap : scale(24),
    alignSelf : "stretch",
    flexDirection : "row"
  },
  text : {
    color : TEXT_COLORS.DEFAULT
  },
  inputContainer : {
    marginLeft : "auto",
    marginRight : "auto",
    display : "flex",
    width : scale(343),
    padding : scale(12),
    flexDirection : "column",
    justifyContent : "center",
    alignItems : "center",
    gap : scale(24),
  },
  buttonContainer : {
    marginLeft : "auto",
    marginRight : "auto",
    display : "flex",
    width : scale(343),
    padding : scale(12),
    flexDirection : "column",
    justifyContent : "center",
    alignItems : "center",
    gap : scale(16)
  }
});