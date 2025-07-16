import { Image, View } from "react-native";
import { styles } from "../../styles/HeaderBar/Profile";
import { rem } from "../../../../utils/scalerRem";

function Profile() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://water-icon-dc4.notion.site/image/attachment%3A28b5c24c-b89a-48b2-89e4-b800d44c7f6c%3Aimage.png?table=block&id=22e2845a-0c9f-8048-8dff-de8bb412500a&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=2000&userId=&cache=v2",
        }}
        style={{ width: rem(2.5), height: rem(2.5), borderRadius: rem(1.25) }}
      />
    </View>
  );
}

export default Profile;