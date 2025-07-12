import { StyleSheet } from "react-native";
import { rem } from "../../../../utils/scalerRem";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { UI_COLORS, TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: rem(4),
    paddingHorizontal: rem(1),
    backgroundColor: UI_COLORS.BACKGROUND
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center"
  },
  userName: {
    color: TEXT_COLORS.DEFAULT,
    marginBottom: rem(0.2)
  },
  badge: {
    backgroundColor: UI_COLORS.BACKGROUND_RED,
    borderRadius: rem(0.5),
    paddingHorizontal: rem(0.5),
    paddingVertical: rem(0.15),
    alignSelf: "flex-start",
    marginTop: rem(0.1)
  },
  badgeText: {
    color: TEXT_COLORS.CAPTION_RED
  },
  menuButton: {
    padding: rem(0.5),
    justifyContent: "center",
    alignItems: "center"
  },
  hamburgerLine: {
    width: rem(1.5),
    height: rem(0.18),
    backgroundColor: TEXT_COLORS.DEFAULT,
    marginVertical: rem(0.13),
    borderRadius: rem(0.1)
  },
});