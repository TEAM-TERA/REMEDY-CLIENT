import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { BACKGROUND_COLORS, TEXT_COLORS } from "../../../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: scale(68),
    paddingHorizontal: scale(1),
    padding: scale(16),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND
  },
  leftSection: {
    flexDirection: "row",
    gap: scale(8),
    alignItems: "center",
    marginLeft: scale(12)
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
  rightSection: {
    flexDirection: "row",
    gap: scale(1)
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    gap: scale(20),
    marginRight: scale(16)
  }
});