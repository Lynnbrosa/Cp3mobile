import type { FormField, FormValues } from '@/types/form';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
};

const validateDate = (raw: string): string | undefined => {
  const match = raw.match(DATE_REGEX);
  if (!match) return 'Use o formato DD/MM/AAAA.';
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) return 'Mês inválido.';
  if (day < 1 || day > 31) return 'Dia inválido.';
  if (year < 1900 || year > 2100) return 'Ano inválido.';
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'Data inexistente no calendário.';
  }
  return undefined;
};

export const validateField = (
  field: FormField,
  value: FormValues[string],
): string | undefined => {
  if (field.required) {
    if (field.type === 'checkbox' || field.type === 'switch') {
      if (value !== true) return 'Esta opção é obrigatória.';
    } else if (isEmpty(value)) {
      return 'Campo obrigatório.';
    }
  }

  if (isEmpty(value)) return undefined;

  switch (field.type) {
    case 'email': {
      if (typeof value !== 'string' || !EMAIL_REGEX.test(value)) {
        return 'E-mail inválido.';
      }
      if (field.minLength && value.length < field.minLength) {
        return `Mínimo de ${field.minLength} caracteres.`;
      }
      if (field.maxLength && value.length > field.maxLength) {
        return `Máximo de ${field.maxLength} caracteres.`;
      }
      return undefined;
    }
    case 'text':
    case 'password': {
      if (typeof value !== 'string') return 'Valor inválido.';
      if (field.minLength && value.length < field.minLength) {
        return `Mínimo de ${field.minLength} caracteres.`;
      }
      if (field.maxLength && value.length > field.maxLength) {
        return `Máximo de ${field.maxLength} caracteres.`;
      }
      return undefined;
    }
    case 'textarea': {
      if (typeof value !== 'string') return 'Valor inválido.';
      if (field.minLength && value.length < field.minLength) {
        return `Mínimo de ${field.minLength} caracteres.`;
      }
      if (field.maxLength && value.length > field.maxLength) {
        return `Máximo de ${field.maxLength} caracteres.`;
      }
      return undefined;
    }
    case 'number': {
      const num = typeof value === 'number' ? value : Number(value);
      if (Number.isNaN(num)) return 'Informe um número válido.';
      if (field.min !== undefined && num < field.min) {
        return `Valor mínimo: ${field.min}.`;
      }
      if (field.max !== undefined && num > field.max) {
        return `Valor máximo: ${field.max}.`;
      }
      return undefined;
    }
    case 'date': {
      if (typeof value !== 'string') return 'Valor inválido.';
      return validateDate(value);
    }
    case 'radio':
    case 'select': {
      if (typeof value !== 'string') return 'Valor inválido.';
      const ok = field.options.some((option) => option.value === value);
      return ok ? undefined : 'Selecione uma opção válida.';
    }
    case 'checkbox':
    case 'switch':
      return undefined;
    default:
      return undefined;
  }
};
