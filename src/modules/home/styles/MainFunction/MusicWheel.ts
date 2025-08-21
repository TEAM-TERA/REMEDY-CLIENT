import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/scalers';

export const styles = StyleSheet.create({
  container: {
    width: scale(19.625),
    height: scale(21.375),
    position: 'absolute',
    right: scale(-7.5),
    bottom: scale(-10.5),
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: scale(9.8125),
  },
  nodeGroup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: -30,
  },
});