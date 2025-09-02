import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/scalers';

export const styles = StyleSheet.create({
  container: {
    width: scale(300),
    height: scale(300),
    position: 'absolute',
    left: '92%',
    bottom: scale(-140), 
    transform: [{ translateX: -scale(150) }],
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: scale(150),
    zIndex: 10,
    elevation: 10,
  },
  nodeGroup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: -50,
  },
});
