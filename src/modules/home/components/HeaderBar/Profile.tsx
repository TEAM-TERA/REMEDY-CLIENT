import { Image, View } from "react-native";
import { styles } from "../../styles/HeaderBar/Profile";
import { scale } from "../../../../utils/scalers";
import { useMyProfile } from "../../../profile/hooks/useMyProfile";

function Profile() {
  const { data: userProfile } = useMyProfile();
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: userProfile?.profileImageUrl || "",
        }}
        style={{ width: scale(40), height: scale(40), borderRadius: scale(20) }}
      />
    </View>
  );
}

export default Profile;