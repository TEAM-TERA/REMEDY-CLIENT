import { StyleSheet } from 'react-native';
import { scale } from '../../utils/scalers';

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: scale(200),
        padding: scale(5),
        flexDirection: 'column',
        alignItems: 'center',
        gap: scale(5),
    },
});
