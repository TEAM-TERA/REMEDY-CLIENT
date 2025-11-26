import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { TYPOGRAPHY } from '../../../constants/typography';
import { PRIMARY_COLORS, UI_COLORS, TEXT_COLORS, BACKGROUND_COLORS, FORM_COLORS } from '../../../constants/colors';
import { scale, verticalScale } from '../../../utils/scalers';

type CreatePlaylistModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (playlistName: string) => void;
  isCreating?: boolean;
};

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isCreating = false,
}) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleConfirm = () => {
    const trimmedName = playlistName.trim();
    if (!trimmedName) {
      Alert.alert('알림', '플레이리스트 이름을 입력해주세요.');
      return;
    }
    if (trimmedName.length > 30) {
      Alert.alert('알림', '플레이리스트 이름은 30자 이하로 입력해주세요.');
      return;
    }
    onConfirm(trimmedName);
  };

  const handleClose = () => {
    setPlaylistName('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)'
      }}>
        <View style={{
          width: scale(320),
          backgroundColor: BACKGROUND_COLORS.BACKGROUND,
          borderRadius: scale(16),
          padding: scale(20),
          borderColor: '#2E2E40',
          borderWidth: 1
        }}>
          {/* Header */}
          <Text style={[
            { color: TEXT_COLORS.DEFAULT, marginBottom: verticalScale(8) },
            TYPOGRAPHY.HEADLINE_2
          ]}>
            새 플레이리스트
          </Text>

          <Text style={[
            { color: TEXT_COLORS.CAPTION_1, marginBottom: verticalScale(20) },
            TYPOGRAPHY.BODY_2
          ]}>
            플레이리스트 이름을 입력해주세요.
          </Text>

          {/* Input */}
          <View style={{ marginBottom: verticalScale(24) }}>
            <TextInput
              value={playlistName}
              onChangeText={setPlaylistName}
              placeholder="예: 내가 좋아하는 노래"
              placeholderTextColor={TEXT_COLORS.CAPTION_RED}
              style={{
                backgroundColor: FORM_COLORS.BACKGROUND_3,
                borderRadius: scale(12),
                paddingHorizontal: scale(16),
                paddingVertical: scale(14),
                color: TEXT_COLORS.DEFAULT,
                fontSize: scale(16),
                fontFamily: 'Pretendard-Medium',
                borderWidth: 1,
                borderColor: 'transparent',
              }}
              maxLength={30}
              editable={!isCreating}
              autoFocus
            />
            <Text style={{
              color: TEXT_COLORS.CAPTION_1,
              fontSize: scale(12),
              marginTop: scale(6),
              textAlign: 'right'
            }}>
              {playlistName.length}/30
            </Text>
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isCreating}
              style={{
                flex: 1,
                paddingVertical: verticalScale(12),
                borderRadius: scale(12),
                backgroundColor: UI_COLORS.BACKGROUND_RED,
                alignItems: 'center',
                marginRight: scale(12),
                borderColor: '#3A3A52',
                borderWidth: 1,
                opacity: isCreating ? 0.5 : 1,
              }}
            >
              <Text style={[{ color: TEXT_COLORS.DEFAULT }, TYPOGRAPHY.BUTTON_TEXT]}>
                취소
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isCreating || !playlistName.trim()}
              style={{
                flex: 1,
                paddingVertical: verticalScale(12),
                borderRadius: scale(12),
                backgroundColor: PRIMARY_COLORS.DEFAULT,
                alignItems: 'center',
                opacity: (isCreating || !playlistName.trim()) ? 0.5 : 1,
              }}
            >
              <Text style={[{ color: '#fff' }, TYPOGRAPHY.BUTTON_TEXT]}>
                {isCreating ? '생성 중...' : '생성'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePlaylistModal;