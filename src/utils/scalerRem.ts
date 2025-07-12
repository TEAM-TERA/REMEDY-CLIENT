import { Dimensions, PixelRatio } from 'react-native';

const { width : SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375;

const scale = SCREEN_WIDTH / BASE_WIDTH;

// 유사한 rem을 구해줍니다!
export function rem(size : number) {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}