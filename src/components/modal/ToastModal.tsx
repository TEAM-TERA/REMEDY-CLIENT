import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { scale, verticalScale } from '../../utils/scalers';
import { TEXT_COLORS, BACKGROUND_COLORS } from '../../constants/colors';
import Icon from '../icon/Icon';

interface ToastModalProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const ToastModal: React.FC<ToastModalProps> = ({
  visible,
  message,
  type = 'success',
  onClose,
  duration = 2000,
}) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'heart';
      case 'error':
        return 'danger';
      case 'info':
        return 'list';
      default:
        return 'heart';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.toastContainer}>
          <View style={styles.iconContainer}>
            <Icon
              name={getIconName()}
              width={scale(20)}
              height={scale(20)}
              color="#E61F54"
            />
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  toastContainer: {
    backgroundColor: BACKGROUND_COLORS.MODAL,
    borderRadius: scale(12),
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    minWidth: scale(200),
    maxWidth: scale(300),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#E61F54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ToastModal;