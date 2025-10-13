import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scalers';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: scale(40),
    gap: scale(20),
  },
  genderContainer: {
    marginTop: scale(8),
  },
  genderLabel: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: '400',
    marginBottom: scale(12),
  },
  genderButtons: {
    flexDirection: 'row',
    gap: scale(12),
  },
  genderButton: {
    flex: 1,
    height: scale(48),
    borderRadius: scale(8),
  },
  genderButtonActive: {
    backgroundColor: '#FF4444',
    borderColor: '#FF4444',
  },
  genderButtonInactive: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: '500',
  },
  genderButtonTextInactive: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: '400',
  },
  signUpButton: {
    marginTop: scale(32),
    backgroundColor: '#FF4444',
    borderColor: '#FF4444',
  },
});
