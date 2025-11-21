import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "../../styles/HeaderBar/Headerbar";
import Icon from "../../../../components/icon/Icon";
import { useMyProfile } from "../../../profile/hooks/useMyProfile";
import { TEXT_COLORS } from "../../../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const HeaderBar = React.memo(function HeaderBar(): React.JSX.Element {
  const { data: userProfile } = useMyProfile();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.leftSection}
        onPress={() => navigation.navigate('Profile' as never)}
      >
        {userProfile?.profileImageUrl ? (
          <Image
            source={{ uri: userProfile.profileImageUrl }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.defaultProfileImage} />
        )}
        <Text style={styles.userName}>
          {userProfile?.username || 'User 1'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rightButton}>
        <Icon name="list" width={20} height={20} color={TEXT_COLORS.DEFAULT} />
      </TouchableOpacity>
    </View>
  );
});

export default HeaderBar;