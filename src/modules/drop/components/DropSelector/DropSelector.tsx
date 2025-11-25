import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../../../components/icon/Icon';
import { BACKGROUND_COLORS, TEXT_COLORS, PRIMARY_COLORS, UI_COLORS } from '../../../../constants/colors';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { scale, verticalScale } from '../../../../utils/scalers';

export type DropType = 'music' | 'playlist' | 'debate';

interface DropOption {
  id: DropType;
  label: string;
  iconName: 'music' | 'playlist' | 'debate';
  color: string;
  shadowColor: string;
}

interface DropSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (option: DropType) => void;
  inline?: boolean;
}

const dropOptions: DropOption[] = [
  {
    id: 'music',
    label: 'Music',
    iconName: 'music',
    color: PRIMARY_COLORS.DEFAULT,
    shadowColor: '#EF104C'
  },
  {
    id: 'playlist',
    label: 'Playlist',
    iconName: 'playlist',
    color: '#EF9210',
    shadowColor: '#EF9210'
  },
  {
    id: 'debate',
    label: 'Debate',
    iconName: 'debate',
    color: '#6210EF',
    shadowColor: '#6210EF'
  }
];

const DropSelector: React.FC<DropSelectorProps> = ({
  visible,
  onClose,
  onSelectOption,
  inline = false,
}) => {
  const handleOptionPress = (option: DropType) => {
    onSelectOption(option);
    onClose();
  };

  const DropOptionButton = ({ option, style }: { option: DropOption; style: any }) => (
    <TouchableOpacity
      style={[styles.optionContainer, style]}
      onPress={() => handleOptionPress(option.id)}
    >
      <View style={[styles.optionButton, { shadowColor: option.shadowColor }]}>
        <Icon
          name={option.iconName}
          width={24}
          height={24}
          color={option.color}
        />
      </View>
      <Text style={[styles.optionLabel, { color: option.color }]}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  const content = (
    <View style={styles.selectorContainer}>
      <View style={styles.sliderBackground} />
      <DropOptionButton option={dropOptions[0]} style={styles.musicOption} />
      <DropOptionButton option={dropOptions[1]} style={styles.playlistOption} />
      <DropOptionButton option={dropOptions[2]} style={styles.debateOption} />
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <View style={styles.cancelButtonBackground}>
          <Icon name="danger" width={18} height={18} color={TEXT_COLORS.DEFAULT} />
        </View>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  if (inline) {
    if (!visible) return null;
    return (
      <View style={[styles.inlineOverlay]}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        {content}
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        {content}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inlineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  selectorContainer: {
    position: 'absolute',
    bottom: scale(20),
    left: scale(20),
    right: scale(20),
    height: scale(240),
  },
  sliderBackground: {
    position: 'absolute',
    bottom: 0,
    left: scale(120),
    width: scale(200),
    height: scale(220),
    backgroundColor: BACKGROUND_COLORS.BACKGROUND,
    borderRadius: scale(25),
    borderWidth: 1,
    borderColor: UI_COLORS.STROKE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  optionContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: scale(64),
  },
  optionButton: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(8),
    backgroundColor: UI_COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    marginBottom: scale(8),
  },
  optionLabel: {
    ...TYPOGRAPHY.BODY_1,
    fontSize: scale(16),
    textAlign: 'center',
  },
  // 각 옵션의 위치
  musicOption: {
    top: scale(10),
    right: scale(40),
  },
  playlistOption: {
    top: scale(80),
    left: scale(20),
  },
  debateOption: {
    top: scale(150),
    left: scale(0),
  },
  cancelButton: {
    position: 'absolute',
    bottom: scale(40),
    left: '50%',
    marginLeft: scale(-35),
    alignItems: 'center',
    width: scale(70),
  },
  cancelButtonBackground: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27),
    backgroundColor: UI_COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  cancelText: {
    ...TYPOGRAPHY.BODY_1,
    fontSize: scale(16),
    color: TEXT_COLORS.DEFAULT,
    textAlign: 'center',
  },
});

export default DropSelector;
