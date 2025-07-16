import Svg, { Path } from "react-native-svg";
import { scale } from "../../utils/scalers";

function PlaySvg() {
  return (
    <Svg width={scale(16)} height={scale(18)} viewBox="0 0 16 18" fill="none">
      <Path d="M15.5 9L0.5 17.5L0.500001 0.5L15.5 9Z" fill="white" />
    </Svg>
  );
}

export default PlaySvg;