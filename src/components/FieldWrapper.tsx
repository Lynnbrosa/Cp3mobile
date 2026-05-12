import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
};

export function FieldWrapper({ label, required, helperText, error, children }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {children}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  required: {
    color: colors.error,
  },
  helper: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error,
  },
});
