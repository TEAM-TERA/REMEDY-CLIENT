import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalers';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: scale(40),
    justifyContent: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: scale(48),
  },
  userName: {
    color: '#FFFFFF',
    fontSize: scale(24),
    fontWeight: '600',
    marginBottom: scale(8),
  },
  userEmail: {
    color: '#888888',
    fontSize: scale(16),
    fontWeight: '400',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: scale(64),
  },
  message: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: '400',
    lineHeight: scale(24),
    textAlign: 'center',
  },
  buttonContainer: {
    gap: scale(16),
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    borderColor: '#FF4444',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#333333',
    borderWidth: 1,
  },
});
