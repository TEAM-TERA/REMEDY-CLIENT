import { StyleSheet } from "react-native";
import { scale } from "../../../../utils/scalers";
import { BACKGROUND_COLORS, TEXT_COLORS, UI_COLORS } from "../../../../constants/colors";
import { TYPOGRAPHY } from "../../../../constants/typography";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: scale(60),
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    backgroundColor: "transparent"
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    gap: scale(12)
  },
  userIndicator: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: "#FF4444"
  },
  profileImage: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "#F0F0F0"
  },
  defaultProfileImage: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "#FF4444"
  },
  userName: {
    color: TEXT_COLORS.DEFAULT,
    ...TYPOGRAPHY.HEADLINE_3,
  },
  centerButton: {
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center"
  },
  rightButton: {
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center"
  },
  badge: {
    borderRadius: scale(16),
    height: scale(20),
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
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: scale(16)
  },
  iconWrap: {
    marginLeft: scale(20)
  }
});