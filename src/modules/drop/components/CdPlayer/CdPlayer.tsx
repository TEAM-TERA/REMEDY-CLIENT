import { Image, View } from "react-native";
import { styles } from "./styles";
import CircleSvg from "../CircleSvg/CircleSvg";
import CircleBlurSvg from "../CircleSvg/CircleBlurSvg";
import DiscSvg from "./DiscSvg";

function CdPlayer(){
    return(
        <View style = {styles.container}>
            <DiscSvg imageUrl="https://water-icon-dc4.notion.site/image/attachment%3Ac6210c58-7309-41bd-8aba-c2725c761d68%3Aimage.png?table=block&id=2312845a-0c9f-8072-9ae3-ce72c6b7b598&spaceId=f74ce79a-507a-45d0-8a14-248ea481b327&width=1420&userId=&cache=v2"></DiscSvg>
            <CircleSvg></CircleSvg>
            <CircleBlurSvg></CircleBlurSvg>
        </View>
    )
}

export default CdPlayer;