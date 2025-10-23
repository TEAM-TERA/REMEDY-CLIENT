import { View, Text, Image, TouchableOpacity,SafeAreaView, Pressable, Alert } from "react-native";
import { styles } from "../../styles/HeaderBar/Headerbar";
import Profile from "./Profile";
import { scale } from "../../../../utils/scalers";
import { TYPOGRAPHY } from "../../../../constants/typography";
import { useNavigation } from "@react-navigation/native";
import Icon from "../../../../components/icon/Icon";
import { useMyProfile } from "../../../profile/hooks/useMyProfile";

interface HeaderBarProps {
  onLayout?: (height: number) => void;
  setIsRunning?: (isRunning: boolean) => void;
  isRunning?: boolean;
}

function HeaderBar({ onLayout, setIsRunning, isRunning }: HeaderBarProps) {

  const navigation = useNavigation();
  const { data: userProfile } = useMyProfile();
  const pressHandlerProfile = ()=>{
    navigation.navigate("Profile");
  }
  const pressHandlerRunning = ()=>{
    const next = !isRunning;
    if (!next) {
      // 러닝 종료 시점: HomeScreen에서 계산된 거리/시간을 전달받지 못하므로, 종료 알럿은 HomeScreen에서 처리
    }
    setIsRunning?.(next);
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
            <Text style={[styles.userName, TYPOGRAPHY.HEADLINE_3]}>{userProfile?.username || '로그인'}</Text>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, TYPOGRAPHY.CAPTION_2]}>모험가</Text>
            </View>
          </View>
        </Pressable>
      </View>
      <View style = {styles.iconsContainer}>
        <Icon name="music"/>
        <Icon name="target" onPress={() => navigation.navigate('Challenge' as never)} />
        <Icon name="paint"/>
        <Icon name="running" onPress={pressHandlerRunning} isPress={isRunning} pressname="turnRunning"/>
      </View>
    </View>
    </SafeAreaView>
  );
}

export default HeaderBar;