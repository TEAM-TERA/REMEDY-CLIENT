import Svg, { Path } from "react-native-svg";
import { styles } from "./styles";
import { TEXT_COLORS } from "../../../../constants/colors";

function BackSvg() {
  return (
    <Svg style = {styles.container} fill = "none">
      <Path
        fillRule = "evenodd"
        clipRule = "evenodd"
        d = "M14.6778 2.78761L7.83964 9.98185L14.7081 17.208C15.1008 17.6211 15.1007 18.2782 14.6871 18.7125C14.2922 19.104 13.6613 19.0945 13.2779 18.6911L6.41624 11.4794L5 9.98209L6.42313 8.49156C10.9823 3.69535 13.2654 1.29372 13.2724 1.28668C13.6663 0.896232 14.2955 0.905817 14.6779 1.30809C15.0695 1.72017 15.0695 2.37555 14.6778 2.78761Z"
        fill = {TEXT_COLORS.DEFAULT}
      />
    </Svg>
  );
}

export default BackSvg;