import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/TermsScreen';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { TEXT_COLORS } from '../../../../constants/colors';
import Icon from '../../../../components/icon/Icon';

type TermsItemProps = {
  title: string;
  required: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  checked: boolean;
  onToggleChecked: () => void;
  contentLines?: string[];
  showRequiredNotice?: boolean;
};

function TermsItem({
  title,
  required,
  expanded,
  onToggleExpand,
  checked,
  onToggleChecked,
  contentLines,
  showRequiredNotice,
}: TermsItemProps) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={onToggleExpand}
        activeOpacity={0.8}
        style={styles.cardHeader}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.checkCircle, checked ? styles.checkCircleOn : styles.checkCircleOff]} />
          <Text style={[styles.headerTitle, TYPOGRAPHY.BODY_2]}>
            {title}{required ? ' *' : ''}
          </Text>
        </View>
        <Text style={[styles.expandIcon, TYPOGRAPHY.BODY_2]}>{expanded ? <Icon name="toggleOff" /> : <Icon name="toggleOn" />}</Text>
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={styles.divider} />
          <View style={styles.content}>
            {(contentLines || []).map((line, idx) => (
              <Text key={idx} style={[styles.contentText, TYPOGRAPHY.CAPTION_1]}>
                {line}
              </Text>
            ))}
          </View>
          {showRequiredNotice && required && !checked && (
            <Text style={[styles.requiredNotice, TYPOGRAPHY.CAPTION_1]}>⚠ 필수 항목 입니다</Text>
          )}
        </>
      )}

      <TouchableOpacity onPress={onToggleChecked} activeOpacity={0.9} style={styles.agreeButton}>
        <Text style={[{ color: TEXT_COLORS.DEFAULT }, TYPOGRAPHY.BUTTON_TEXT]}>
          {checked ? '동의 취소' : '동의'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TermsItem;