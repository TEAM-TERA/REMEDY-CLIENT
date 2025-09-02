import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { BACKGROUND_COLORS, TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: scale(68),
    paddingHorizontal: scale(1),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center"
  },
  userName: {
    color: TEXT_COLORS.DEFAULT,
    marginBottom: scale(0.2)
  },
  badge: {
    backgroundColor: BACKGROUND_COLORS.BACKGROUND_RED,
    borderRadius: scale(0.5),
    paddingHorizontal: scale(0.5),
    paddingVertical: scale(0.15),
    alignSelf: "flex-start",
    marginTop: scale(0.1)
  },
  badgeText: {
    color: TEXT_COLORS.CAPTION_RED
  },
  menuButton: {
    padding: scale(20),
    justifyContent: "center",
    alignItems: "center"
  },
  hamburgerLine: {
    width: scale(25),
    height: scale(5),
    backgroundColor: TEXT_COLORS.DEFAULT,
    marginVertical: scale(1),
    borderRadius: scale(5)
  },
});