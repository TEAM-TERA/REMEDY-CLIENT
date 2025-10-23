import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { TYPOGRAPHY } from '../../constants/typography';
import { PRIMARY_COLORS, UI_COLORS, TEXT_COLORS, BACKGROUND_COLORS } from '../../constants/colors';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = '버튼',
  cancelText = '취소',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.55)' }}>
        <View style={{ width: 320, backgroundColor: BACKGROUND_COLORS.BACKGROUND, borderRadius: 16, padding: 20, borderColor: '#2E2E40', borderWidth: 1 }}>
          <Text style={[{ color: TEXT_COLORS.DEFAULT, marginBottom: 12 }, TYPOGRAPHY.HEADLINE_2]}>{title}</Text>
          <Text style={[{ color: TEXT_COLORS.DEFAULT, marginBottom: 20, lineHeight: 22 }, TYPOGRAPHY.BODY_1]}>{message}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: UI_COLORS.BACKGROUND_RED, alignItems: 'center', marginRight: 12, borderColor: '#3A3A52', borderWidth: 1 }}
            >
              <Text style={[{ color: TEXT_COLORS.DEFAULT }, TYPOGRAPHY.BUTTON_TEXT]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: PRIMARY_COLORS.DEFAULT, alignItems: 'center' }}
            >
              <Text style={[{ color: '#fff' }, TYPOGRAPHY.BUTTON_TEXT]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;


