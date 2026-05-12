import { useCallback } from 'react';

import { CheckboxField } from './CheckboxField';
import { FieldWrapper } from './FieldWrapper';
import { RadioField } from './RadioField';
import { SelectField } from './SelectField';
import { SwitchField } from './SwitchField';
import { TextInputField } from './TextInputField';
import type { FormField, FormValues } from '@/types/form';

type Props = {
  field: FormField;
  value: FormValues[string];
  error?: string;
  onChange: (id: string, next: FormValues[string]) => void;
};

export function FieldRenderer({ field, value, error, onChange }: Props) {
  const setValue = useCallback(
    (next: FormValues[string]) => onChange(field.id, next),
    [field.id, onChange],
  );

  const hasError = Boolean(error);

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'textarea':
    case 'date': {
      const stringValue = typeof value === 'string' ? value : value == null ? '' : String(value);
      return (
        <FieldWrapper
          label={field.label}
          required={field.required}
          helperText={field.helperText}
          error={error}
        >
          <TextInputField
            field={field}
            value={stringValue}
            hasError={hasError}
            onChange={setValue}
          />
        </FieldWrapper>
      );
    }
    case 'radio': {
      const stringValue = typeof value === 'string' ? value : '';
      return (
        <FieldWrapper
          label={field.label}
          required={field.required}
          helperText={field.helperText}
          error={error}
        >
          <RadioField field={field} value={stringValue} onChange={setValue} />
        </FieldWrapper>
      );
    }
    case 'select': {
      const stringValue = typeof value === 'string' ? value : '';
      return (
        <FieldWrapper
          label={field.label}
          required={field.required}
          helperText={field.helperText}
          error={error}
        >
          <SelectField
            field={field}
            value={stringValue}
            hasError={hasError}
            onChange={setValue}
          />
        </FieldWrapper>
      );
    }
    case 'checkbox': {
      const boolValue = value === true;
      return (
        <FieldWrapper
          label={field.required ? 'Confirmação obrigatória' : 'Opção'}
          required={field.required}
          helperText={field.helperText}
          error={error}
        >
          <CheckboxField field={field} value={boolValue} onChange={setValue} />
        </FieldWrapper>
      );
    }
    case 'switch': {
      const boolValue = value === true;
      return (
        <FieldWrapper
          label={field.required ? 'Configuração obrigatória' : 'Preferência'}
          required={field.required}
          helperText={field.helperText}
          error={error}
        >
          <SwitchField field={field} value={boolValue} onChange={setValue} />
        </FieldWrapper>
      );
    }
    default:
      return null;
  }
}
