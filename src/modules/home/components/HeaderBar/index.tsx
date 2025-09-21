import { View, Text, Image, TouchableOpacity,SafeAreaView, Pressable } from "react-native";
import { styles } from "../../styles/HeaderBar/Headerbar";
import Profile from "./Profile";
import { scale } from "../../../../utils/scalers";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../../../components/icon/Icon";

interface HeaderBarProps {
  onLayout?: (height: number) => void;
}

function HeaderBar({ onLayout }: HeaderBarProps) {

  const navigation = useNavigation();
  const pressHandlerProfile = ()=>{
    navigation.navigate("Profile");
  }
  return (
    <SafeAreaView>
    <View 
      style={styles.container}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        onLayout?.(height);
      }}
    >
      <View style={styles.leftSection}>
        <Profile />
        <Pressable
          onPress={pressHandlerProfile}
          >
          <View style={{ marginLeft: scale(0.75) }}>
            <Text style={[styles.userName, TYPOGRAPHY.HEADLINE_3]}>User_1</Text>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, TYPOGRAPHY.CAPTION_2]}>모험가</Text>
            </View>
          </View>
        </Pressable>
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