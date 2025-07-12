import { View, Text, Image, TouchableOpacity,SafeAreaView } from "react-native";
import { styles } from "../../styles/HeaderBar/Headerbar";
import Profile from "./Profile";
import { rem } from "../../../../utils/scalerRem";
import { TYPOGRAPHY } from "../../../../constants/typography";

function HeaderBar() {
  return (
    <SafeAreaView>
    <View style={styles.container}>
      {/* 프로필 영역 */}
      <View style={styles.leftSection}>
        <Profile />
        <View style={{ marginLeft: rem(0.75) }}>
          <Text style={[styles.userName, TYPOGRAPHY.HEADLINE_3]}>User_1</Text>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, TYPOGRAPHY.CAPTION_2]}>모험가</Text>
          </View>
        </View>
      </View>
      {/* 햄버거 버튼 */}
      <TouchableOpacity style={styles.menuButton}>
        {/* 햄버거 아이콘 예시 (실제 아이콘 라이브러리 사용 추천) */}
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

export default HeaderBar;