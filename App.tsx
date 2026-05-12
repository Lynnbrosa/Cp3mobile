import { useCallback, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { FormScreen } from '@/screens/FormScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { colors } from '@/theme/colors';
import type { FormValues } from '@/types/form';

type View = 'form' | 'result';

export default function App() {
  const [view, setView] = useState<View>('form');
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);

  const handleSubmitted = useCallback((values: FormValues) => {
    setSubmittedValues(values);
    setView('result');
  }, []);

  const handleBack = useCallback(() => {
    setView('form');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {view === 'form' || submittedValues === null ? (
        <FormScreen onSubmitted={handleSubmitted} />
      ) : (
        <ResultScreen values={submittedValues} onBack={handleBack} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
