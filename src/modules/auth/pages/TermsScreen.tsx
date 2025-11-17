import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderNav from '../components/HeaderNav/HeaderNav';
import Button from '../../../components/button/Button';
import { useAuthNavigation } from '../../../hooks/navigation/useAuthNavigation';
import { styles } from '../styles/TermsScreen';
import { PRIMARY_COLORS } from '../../../constants/colors';
import TermsItem from '../components/TermsItem/TermsItem';
import { TERMS, TermId } from '../../../constants/terms';

function TermsScreen() {
  const navigation = useAuthNavigation();

  const [expanded, setExpanded] = useState<Record<TermId, boolean>>({
    service: true,
    privacy: false,
    location: false,
    marketing: false,
  });

  const [checked, setChecked] = useState<Record<TermId, boolean>>({
    service: false,
    privacy: false,
    location: false,
    marketing: false,
  });

  const allRequiredChecked = useMemo(
    () => TERMS.filter(t => t.required).every(t => checked[t.id]),
    [checked],
  );

  const toggleExpand = (id: TermId) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleChecked = (id: TermId) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const handleNext = () => {
    if (!allRequiredChecked) {
      return;
    }
    navigation.navigate('SignUp', {
      requiredServiceTerms: checked.service,
      requiredPrivacyTerms: checked.privacy,
      locationConsent: checked.location,
      marketingConsent: checked.marketing,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNav title="이용약관 & 동의" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {TERMS.map(term => (
          <TermsItem
            key={term.id}
            title={term.title}
            required={term.required}
            expanded={expanded[term.id]}
            onToggleExpand={() => toggleExpand(term.id)}
            checked={checked[term.id]}
            onToggleChecked={() => toggleChecked(term.id)}
            contentLines={term.contentLines}
            showRequiredNotice={term.required}
          />
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        <Button
          title="다음"
          onPress={handleNext}
          disabled={!allRequiredChecked}
          style={[
            styles.nextButton,
            { opacity: allRequiredChecked ? 1 : 0.5, backgroundColor: PRIMARY_COLORS.DEFAULT },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

export default TermsScreen;


