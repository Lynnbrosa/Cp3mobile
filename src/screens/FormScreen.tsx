import { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FieldRenderer } from '@/components/FieldRenderer';
import { formConfig } from '@/config/formConfig';
import { useDynamicForm } from '@/hooks/useDynamicForm';
import { colors } from '@/theme/colors';
import type { FormValues } from '@/types/form';

type Props = {
  onSubmitted: (values: FormValues) => void;
};

export function FormScreen({ onSubmitted }: Props) {
  const form = useDynamicForm(formConfig);

  const showAlert = useCallback((title: string, message: string) => {
    if (Platform.OS === 'web') {
      // window.alert works on web; native uses Alert.alert
      // eslint-disable-next-line no-alert
      window.alert(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  }, []);

  const handleSubmit = useCallback(async () => {
    const result = await form.submit();
    if (result) {
      onSubmitted(result);
    } else {
      showAlert('Revise o formulário', 'Existem campos com erro. Confira as mensagens abaixo de cada campo.');
    }
  }, [form, onSubmitted, showAlert]);

  const handleClear = useCallback(async () => {
    await form.reset();
    showAlert('Dados limpos', 'Os dados salvos localmente foram apagados.');
  }, [form, showAlert]);

  if (form.status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados salvos…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>{formConfig.title}</Text>
          {formConfig.description ? (
            <Text style={styles.description}>{formConfig.description}</Text>
          ) : null}
          {form.hasStoredData ? (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Dados restaurados do armazenamento local.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          {formConfig.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={form.values[field.id]}
              error={form.errors[field.id]}
              onChange={form.setValue}
            />
          ))}

          <Pressable
            onPress={handleSubmit}
            disabled={form.isSubmitting}
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.buttonPressed,
              form.isSubmitting && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {form.isSubmitting ? 'Enviando…' : 'Enviar'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleClear}
            disabled={form.isSubmitting}
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Limpar dados salvos</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          CP3 · React Native · Formulários dinâmicos via JSON
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: {
    color: colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 48,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
  },
  banner: {
    marginTop: 12,
    backgroundColor: '#E8EEFF',
    borderRadius: 10,
    padding: 12,
  },
  bannerText: {
    color: colors.primaryDark,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  footer: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
  },
});
