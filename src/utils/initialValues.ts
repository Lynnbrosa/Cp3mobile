import type { FormConfig, FormValues } from '@/types/form';

export const buildInitialValues = (config: FormConfig): FormValues => {
  const values: FormValues = {};
  for (const field of config.fields) {
    switch (field.type) {
      case 'checkbox':
      case 'switch':
        values[field.id] = false;
        break;
      case 'number':
        values[field.id] = '';
        break;
      default:
        values[field.id] = '';
    }
  }
  return values;
};
