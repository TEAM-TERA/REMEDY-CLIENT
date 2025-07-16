import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

<<<<<<< HEAD
const scale = SCREEN_WIDTH / BASE_WIDTH;

// 폰트 크기 기반 rem 계산 (1rem = 16px)
const BASE_FONT_SIZE = 16;

// 유사한 rem을 구해줍니다!
export function rem(size : number) {
  return Math.round(PixelRatio.roundToNearestPixel(size * BASE_FONT_SIZE * scale));
}
=======
export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;
>>>>>>> 2c9ebdcb6dd6aee356952caedcae13a79b5fcbc2
