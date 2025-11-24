import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/TermsScreen';
import { TYPOGRAPHY } from '../../../../constants/typography';
import { TEXT_COLORS, PRIMARY_COLORS } from '../../../../constants/colors';
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
    <TouchableOpacity 
      style={styles.card}
      onPress={onToggleExpand}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onToggleChecked();
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.checkCircle, checked ? styles.checkCircleOn : styles.checkCircleOff]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, TYPOGRAPHY.BODY_2]}>
            {title}
            {required && <Text style={{ color: PRIMARY_COLORS.DEFAULT }}> *</Text>}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }} 
          activeOpacity={0.8}
        >
          {expanded ? <Icon name="toggleOff" color={TEXT_COLORS.CAPTION_1} /> : <Icon name="toggleOn" color={TEXT_COLORS.CAPTION_1} />}
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {expanded && (
        <>
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
    </TouchableOpacity>
  );
}

export default TermsItem;