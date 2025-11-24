import { StyleSheet } from "react-native";
import { scale } from "../../../utils/scalers";
import { TEXT_COLORS, BACKGROUND_COLORS, FORM_COLORS, PRIMARY_COLORS } from "../../../constants/colors";

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
  innerContainer : {
    flex : 1,
    width : "100%",
    paddingVertical : scale(64),
    paddingHorizontal : scale(12),
    gap: scale(24),
    borderRadius : scale(20),
    backgroundColor : FORM_COLORS.BACKGROUND_3,
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
    color : TEXT_COLORS.DEFAULT,
  },
  inputContainer : {
    marginLeft : "auto",
    marginRight : "auto",
    display : "flex",
    width : "100%",
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
    width : "100%",
    padding : scale(12),
    flexDirection : "column",
    justifyContent : "center",
    alignItems : "center",
    gap : scale(16)
  },
  errorText : {
    color : "#FF3B30",
    textAlign : "center",
    marginTop : scale(8)
  },
  logo : {
    alignSelf : "center",
  },
  socialLoginContainer : {
    flexDirection : "row",
    justifyContent : "center",
    alignItems : "center",
    gap : scale(48),
  },
  socialButton : {
    width : scale(48),
    height : scale(48),
    justifyContent : "center",
    alignItems : "center",
  },
  loginErrorContainer : {
    flexDirection : "row",
    alignItems : "center",
    gap : scale(4),
    alignSelf : "center",
  },
  loginErrorText : {
    color : PRIMARY_COLORS.DEFAULT,
    textAlign : "center",
  }
});