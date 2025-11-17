import { Image, View } from "react-native";
import { styles } from "../../styles/HeaderBar/Profile";
import { scale } from "../../../../utils/scalers";
import { useMyProfile } from "../../../profile/hooks/useMyProfile";

function Profile() {
  const { data: userProfile } = useMyProfile();
  const defaultImg = require('../../../../assets/images/profileImage.png');
  return (
    <View style={styles.container}>
      <Image
        source={
          userProfile?.profileImageUrl && userProfile.profileImageUrl.trim() !== ""
            ? { uri: userProfile.profileImageUrl }
            : defaultImg
        }
        style={{ width: scale(40), height: scale(40), borderRadius: scale(20) }}
      />
    </View>
  );
}

export default Profile;