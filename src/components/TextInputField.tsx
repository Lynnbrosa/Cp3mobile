import { useMemo } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';

import { colors } from '@/theme/colors';
import type {
  DateField,
  NumberField,
  TextAreaField,
  TextField,
} from '@/types/form';

type SupportedField = TextField | NumberField | TextAreaField | DateField;

type Props = {
  field: SupportedField;
  value: string;
  hasError: boolean;
  onChange: (next: string) => void;
};

const maskDate = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join('/');
};

export function TextInputField({ field, value, hasError, onChange }: Props) {
  const config = useMemo(() => {
    let keyboardType: KeyboardTypeOptions = 'default';
    let autoCapitalize: 'none' | 'sentences' = 'sentences';
    let secureTextEntry = false;
    let multiline = false;
    let maxLength: number | undefined;

    switch (field.type) {
      case 'email':
        keyboardType = 'email-address';
        autoCapitalize = 'none';
        break;
      case 'password':
        secureTextEntry = true;
        autoCapitalize = 'none';
        break;
      case 'number':
        keyboardType = 'numeric';
        break;
      case 'textarea':
        multiline = true;
        break;
      case 'date':
        keyboardType = 'numeric';
        maxLength = 10;
        break;
      default:
        break;
    }

    if (field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'textarea') {
      if (field.maxLength) maxLength = field.maxLength;
    }

    return { keyboardType, autoCapitalize, secureTextEntry, multiline, maxLength };
  }, [field]);

  const handleChange = (next: string) => {
    if (field.type === 'date') {
      onChange(maskDate(next));
      return;
    }
    if (field.type === 'number') {
      onChange(next.replace(/[^0-9.-]/g, ''));
      return;
    }
    onChange(next);
  };

  return (
    <TextInput
      style={[
        styles.input,
        config.multiline && styles.multilineInput,
        hasError && styles.inputError,
      ]}
      value={value}
      onChangeText={handleChange}
      placeholder={field.placeholder}
      placeholderTextColor={colors.textMuted}
      keyboardType={config.keyboardType}
      autoCapitalize={config.autoCapitalize}
      secureTextEntry={config.secureTextEntry}
      multiline={config.multiline}
      numberOfLines={config.multiline ? 4 : undefined}
      maxLength={config.maxLength}
      textAlignVertical={config.multiline ? 'top' : 'center'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  multilineInput: {
    minHeight: 96,
    paddingTop: 10,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },
});
