import { View, Text, Image, Animated } from "react-native";
import { musicList } from '../../datas/index';
import { styles } from "../../styles/MainFunction/MusicWheel";
import MusicNode from "./MusicNode";

function MusicWheel() {
  return(
    <View style = {styles.container}>
      <MusicNode isFirst = {true}></MusicNode>
      <MusicNode></MusicNode>
      <MusicNode></MusicNode>
    </View>
  )
}

export default MusicWheel;