import { View, Text, Image, TouchableOpacity,SafeAreaView } from "react-native";
import { styles } from "../../styles/HeaderBar/Headerbar";
import Profile from "./Profile";
import { scale } from "../../../../utils/scalers";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { useNavigation } from "@react-navigation/native";

function HeaderBar() {

  const navigation = useNavigation();
  const pressHandlerProfile = ()=>{
    navigation.navigate("Profile");
  }
  return (
    <SafeAreaView>
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Profile />
        <View style={{ marginLeft: scale(0.75) }}>
          <Text style={[styles.userName, TYPOGRAPHY.HEADLINE_3]}>User_1</Text>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, TYPOGRAPHY.CAPTION_2]}>모험가</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        onPress={pressHandlerProfile}
        style={styles.menuButton}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

export default HeaderBar;