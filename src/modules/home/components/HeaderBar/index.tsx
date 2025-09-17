import { View, Text, Image, TouchableOpacity,SafeAreaView } from "react-native";
import { styles } from "../../styles/HeaderBar/Headerbar";
import Profile from "./Profile";
import { scale } from "../../../../utils/scalers";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../../../components/icon/Icon";

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
      <View style = {styles.iconsContainer}>
        <Icon name="music"/>
        <Icon name="target"/>
        <Icon name="paint"/>
        <Icon name="running"/>
      </View>
    </View>
    </SafeAreaView>
  );
}

export default HeaderBar;