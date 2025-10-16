import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { BACKGROUND_COLORS, TEXT_COLORS, UI_COLORS } from "../../../../constants/colors";

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
    borderRadius: scale(16),
    height: scale(24),
    paddingLeft: scale(6),
    paddingRight: scale(6),
    paddingTop: scale(2),
    paddingBottom: scale(2),
    alignSelf: "flex-start",
    justifyContent: "center",
    marginTop: scale(0.1),
    borderColor: TEXT_COLORS.CAPTION_LIGHTER,
    borderWidth: scale(0.5)
  },
  badgeText: {
    color: TEXT_COLORS.CAPTION_LIGHTER
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