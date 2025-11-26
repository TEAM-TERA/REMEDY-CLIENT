import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../../../utils/scalers';

export const styles = StyleSheet.create({
  container: {
    width: scale(300),
    height: scale(300),
    position: 'absolute',
    right: -scale(280),
    bottom: -verticalScale(120),
    transform: [{ translateX: -scale(150) }],
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: scale(150),
    zIndex: 10,
    elevation: 10,
  },
  optionWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeGroup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: -verticalScale(30),
  },
  dropButtonWrapper: {
    position: 'absolute',
    bottom: verticalScale(120),
    alignSelf: 'center',
  },
  selectorOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorOption: {
    alignItems: 'center',
    gap: scale(6),
    width: scale(70),
  },
  selectorIconWrap: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: 'rgba(19,3,9,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  selectorLabel: {
    color: '#E9E2E3',
    fontSize: scale(13),
    textAlign: 'center',
  },
});
