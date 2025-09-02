import { Image, View } from "react-native";
import { styles } from "../../styles/HeaderBar/Profile";
import { scale } from "../../../../utils/scalers";

function Profile() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://water-icon-dc4.notion.site/image/attachment%3A28b5c24c-b89a-48b2-89e4-b800d44c7f6c%3Aimage.png?table=block&id=22e2845a-0c9f-8048-8dff-de8bb412500a&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=2000&userId=&cache=v2",
        }}
        style={{ width: scale(60), height: scale(60), borderRadius: scale(20) }}
      />
    </View>
  );
}

export default Profile;