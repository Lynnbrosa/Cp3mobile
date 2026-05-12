export type FieldOption = {
  label: string;
  value: string;
};

type BaseField = {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
};

export type TextField = BaseField & {
  type: 'text' | 'email' | 'password';
  minLength?: number;
  maxLength?: number;
};

export type NumberField = BaseField & {
  type: 'number';
  min?: number;
  max?: number;
};

export type TextAreaField = BaseField & {
  type: 'textarea';
  minLength?: number;
  maxLength?: number;
};

export type DateField = BaseField & {
  type: 'date';
};

export type RadioField = BaseField & {
  type: 'radio';
  options: FieldOption[];
};

export type SelectField = BaseField & {
  type: 'select';
  options: FieldOption[];
};

export type CheckboxField = BaseField & {
  type: 'checkbox';
};

export type SwitchField = BaseField & {
  type: 'switch';
};

export type FormField =
  | TextField
  | NumberField
  | TextAreaField
  | DateField
  | RadioField
  | SelectField
  | CheckboxField
  | SwitchField;

export type FormConfig = {
  title: string;
  description?: string;
  fields: FormField[];
};

export type FormValues = Record<string, string | number | boolean | null>;

export type FormErrors = Record<string, string | undefined>;
