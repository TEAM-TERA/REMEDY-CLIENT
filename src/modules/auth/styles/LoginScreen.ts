import { StyleSheet } from "react-native";
import { rem } from "../../../utils/scalerRem";
import { TEXT_COLORS, UI_COLORS } from "../../../constants/colors";

export const styles = StyleSheet.create({
  container : {
    display : "flex",
    flex : 1,
    padding : rem(1),
    flexDirection : "column",
    alignItems : "flex-start",
    gap : rem(1.5),
    backgroundColor : UI_COLORS.BACKGROUND
  },
  textContainer : {
    display : "flex",
    padding : rem(0),
    justifyContent : "center",
    alignItems : "center",
    gap : rem(1.5),
    alignSelf : "stretch"
  },
  text : {
    color : TEXT_COLORS.DEFAULT
  },
  inputContainer : {
    display : "flex",
    width : rem(21.4375),
    padding : rem(0.75),
    flexDirection : "column",
    justifyContent : "center",
    alignItems : "center",
    gap : rem(1.5)
  },
  buttonContainer : {
    display : "flex",
    width : rem(21.4375),
    padding : rem(0.75),
    flexDirection : "column",
    justifyContent : "center",
    alignItems : "center",
    gap : rem(1)
  }
});