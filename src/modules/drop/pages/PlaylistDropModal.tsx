import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Icon from '../../../components/icon/Icon';
import {
  BACKGROUND_COLORS,
  TEXT_COLORS,
  FORM_COLORS,
  SECONDARY_COLORS,
  PRIMARY_COLORS
} from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';
import { scale } from '../../../utils/scalers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDropping } from '../api/dropApi';
import Config from 'react-native-config';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaylistDropModal'>;

function PlaylistDropModal({ navigation, route }: Props) {
  const { playlist, latitude, longitude, address } = route.params;
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  // 디버깅을 위한 로그
  console.log('PlaylistDropModal params:', { latitude, longitude, address });

  const getImageUrl = (albumImageUrl?: string) => {
    if (!albumImageUrl) {
      return require('../../../assets/images/profileImage.png');
    }
    if (albumImageUrl.startsWith('http')) {
      return { uri: albumImageUrl };
    }
    const baseUrl = Config.MUSIC_API_BASE_URL || 'http://localhost:3000';
    return { uri: `${baseUrl}${albumImageUrl}` };
  };

  const createDropMutation = useMutation({
    mutationFn: createDropping,
    onSuccess: () => {
      Alert.alert('성공', '플레이리스트가 드랍되었습니다!', [
        {
          text: '확인',
          onPress: () => {
            queryClient.invalidateQueries({ queryKey: ['droppings'] });
            navigation.navigate('Home');
          },
        },
      ]);
    },
    onError: (error) => {
      console.error('Drop error:', error);
      Alert.alert('오류', '드랍에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleDrop = () => {
    if (message.trim().length === 0) {
      Alert.alert('알림', '한마디를 입력해주세요.');
      return;
    }

    createDropMutation.mutate({
      type: 'PLAYLIST',
      playlistId: playlist.id,
      content: message.trim(),
      latitude,
      longitude,
      address,
    });
  };

  const addressParts = address.split(' ').filter(part => part.trim() !== '');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="close" width={20} height={20} fill={TEXT_COLORS.CAPTION} />
              </TouchableOpacity>
            </View>

        <View style={styles.content}>
          {/* Playlist Preview */}
          <View style={styles.playlistSection}>
            <View style={styles.playlistContainer}>
              <View style={styles.playlistHeaderBar} />
              <View style={styles.playlistImageContainer}>
                <Image
                  source={getImageUrl(playlist.albumImageUrl)}
                  style={styles.playlistThumbnail}
                  resizeMode="cover"
                />
              </View>
            </View>
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistTitle} numberOfLines={1}>
                {playlist.name}
              </Text>
              <TouchableOpacity style={styles.editButton}>
                <Icon name="edit" width={12} height={8} fill={SECONDARY_COLORS.DEFAULT} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Message Input */}
          <View style={styles.messageSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="남길 한마디"
                placeholderTextColor={TEXT_COLORS.CAPTION}
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={200}
                textAlignVertical="top"
              />
              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>{message.length}/200</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationSection}>
          <Icon name="location" width={16} height={18} fill={SECONDARY_COLORS.DEFAULT} />
          <View style={styles.locationTags}>
            {addressParts.map((part, index) => (
              <View key={index} style={styles.locationTag}>
                <Text style={styles.locationTagText}>{part}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Drop Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.dropButton, createDropMutation.isPending && styles.dropButtonDisabled]}
            onPress={handleDrop}
            disabled={createDropMutation.isPending}
            activeOpacity={0.8}
          >
            <Icon name="playlistDrop" width={24} height={24} fill={TEXT_COLORS.TEXT2} />
            <Text style={styles.dropButtonText}>
              {createDropMutation.isPending ? '드랍 중...' : '드랍'}
            </Text>
          </TouchableOpacity>
        </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  modalContainer: {
    backgroundColor: FORM_COLORS.BACKGROUND_3,
    borderRadius: scale(20),
    width: '100%',
    maxWidth: scale(320),
    padding: scale(24),
  },
  header: {
    alignItems: 'flex-end',
    paddingBottom: scale(12),
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingVertical: scale(12),
  },
  playlistSection: {
    alignItems: 'center',
    marginBottom: scale(24),
    paddingHorizontal: scale(12),
  },
  playlistContainer: {
    width: scale(160),
    backgroundColor: FORM_COLORS.BACKGROUND_2,
    borderRadius: scale(8),
    overflow: 'hidden',
    marginBottom: scale(12),
  },
  playlistHeaderBar: {
    height: scale(8),
    backgroundColor: FORM_COLORS.BACKGROUND_2,
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    borderBottomWidth: 0,
  },
  playlistImageContainer: {
    height: scale(72),
    overflow: 'hidden',
    borderRadius: scale(8),
    position: 'relative',
  },
  playlistThumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  playlistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: scale(160),
    paddingHorizontal: scale(4),
  },
  playlistTitle: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(16),
    lineHeight: scale(22),
    flex: 1,
  },
  editButton: {
    width: scale(12),
    height: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageSection: {
    marginBottom: scale(24),
  },
  inputContainer: {
    backgroundColor: FORM_COLORS.INPUT_1,
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    borderRadius: scale(8),
    minHeight: scale(138),
  },
  messageInput: {
    ...TYPOGRAPHY.BODY_2,
    color: TEXT_COLORS.DEFAULT,
    fontSize: scale(16),
    lineHeight: scale(22),
    padding: scale(12),
    flex: 1,
    textAlignVertical: 'top',
    minHeight: scale(100),
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: scale(12),
    paddingBottom: scale(12),
  },
  charCount: {
    ...TYPOGRAPHY.CAPTION_2,
    color: TEXT_COLORS.CAPTION_2,
    fontSize: scale(16),
    lineHeight: scale(22),
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(24),
    gap: scale(4),
  },
  locationTags: {
    flexDirection: 'row',
    gap: scale(4),
    flex: 1,
    flexWrap: 'wrap',
  },
  locationTag: {
    backgroundColor: FORM_COLORS.BACKGROUND_1,
    borderWidth: 1,
    borderColor: FORM_COLORS.STROKE,
    borderRadius: scale(24),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
  },
  locationTagText: {
    ...TYPOGRAPHY.CAPTION_2,
    color: SECONDARY_COLORS.PLUS_TWENTY,
    fontSize: scale(14),
    lineHeight: scale(16),
  },
  buttonSection: {
    paddingVertical: scale(12),
  },
  dropButton: {
    backgroundColor: SECONDARY_COLORS.DEFAULT,
    borderRadius: scale(8),
    height: scale(46),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  dropButtonDisabled: {
    opacity: 0.7,
  },
  dropButtonText: {
    ...TYPOGRAPHY.BUTTON,
    color: TEXT_COLORS.TEXT2,
    fontSize: scale(16),
    lineHeight: scale(22),
    fontWeight: '700',
  },
});

export default PlaylistDropModal;