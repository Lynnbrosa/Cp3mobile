import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { formConfig } from '@/config/formConfig';
import { colors } from '@/theme/colors';
import type { FormValues } from '@/types/form';

type Props = {
  values: FormValues;
  onBack: () => void;
};

const formatValue = (value: FormValues[string]): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'string' && value.trim().length === 0) return '—';
  return String(value);
};

export function ResultScreen({ values, onBack }: Props) {
  const rows = useMemo(() => {
    return formConfig.fields.map((field) => {
      const raw = values[field.id];
      let display = formatValue(raw);
      if ((field.type === 'radio' || field.type === 'select') && typeof raw === 'string') {
        const match = field.options.find((option) => option.value === raw);
        if (match) display = match.label;
      }
      return { id: field.id, label: field.label, display };
    });
  }, [values]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Formulário enviado</Text>
      <Text style={styles.subtitle}>
        Os dados foram salvos localmente com AsyncStorage e serão recuperados na próxima abertura.
      </Text>

      <View style={styles.card}>
        {rows.map((row, index) => (
          <View
            key={row.id}
            style={[styles.row, index < rows.length - 1 && styles.rowDivider]}
          >
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.display}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Voltar ao formulário</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 48,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
