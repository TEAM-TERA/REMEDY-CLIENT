import Svg, { Path } from "react-native-svg";
import { styles } from "./styles";

function XSvg() {
  return (
    <Svg style = {styles.container} viewBox="0 0 15 16" fill="none">
      <Path d="M11.78 3.71997L7.45996 8.03997" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" fill="#808080"/>
      <Path d="M3.21979 3.63989L7.53979 7.95989" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" fill="#808080"/>
      <Path d="M7.45996 8.03992L11.78 12.3599" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" fill="#808080"/>
      <Path d="M7.53979 7.95984L3.21979 12.2798" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" fill="#808080"/>
    </Svg>
  );
}

export default XSvg;