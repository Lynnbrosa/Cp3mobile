import { useCallback, useEffect, useMemo, useState } from 'react';

import { clearSubmission, loadSubmission, saveSubmission } from '@/services/storage';
import type { FormConfig, FormErrors, FormValues } from '@/types/form';
import { buildInitialValues } from '@/utils/initialValues';
import { validateField } from '@/utils/validators';

type Status = 'idle' | 'loading' | 'ready';

type UseDynamicFormResult = {
  status: Status;
  values: FormValues;
  errors: FormErrors;
  hasStoredData: boolean;
  isSubmitting: boolean;
  setValue: (id: string, next: FormValues[string]) => void;
  reset: () => Promise<void>;
  submit: () => Promise<FormValues | null>;
};

export function useDynamicForm(config: FormConfig): UseDynamicFormResult {
  const initialValues = useMemo(() => buildInitialValues(config), [config]);

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('loading');
  const [hasStoredData, setHasStoredData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      try {
        const stored = await loadSubmission();
        if (cancelled) return;
        if (stored) {
          setValues({ ...initialValues, ...stored.values });
          setHasStoredData(true);
        }
      } catch {
        // ignore hydration errors – we just start with defaults
      } finally {
        if (!cancelled) setStatus('ready');
      }
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [initialValues]);

  const setValue = useCallback<UseDynamicFormResult['setValue']>((id, next) => {
    setValues((prev) => ({ ...prev, [id]: next }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const validateAll = useCallback(
    (current: FormValues): FormErrors => {
      const next: FormErrors = {};
      for (const field of config.fields) {
        const error = validateField(field, current[field.id]);
        if (error) next[field.id] = error;
      }
      return next;
    },
    [config.fields],
  );

  const submit = useCallback<UseDynamicFormResult['submit']>(async () => {
    setIsSubmitting(true);
    try {
      const nextErrors = validateAll(values);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        return null;
      }
      const normalized: FormValues = { ...values };
      for (const field of config.fields) {
        if (field.type === 'number') {
          const raw = normalized[field.id];
          if (typeof raw === 'string' && raw.trim().length > 0) {
            const parsed = Number(raw);
            if (!Number.isNaN(parsed)) {
              normalized[field.id] = parsed;
            }
          }
        }
      }
      await saveSubmission(normalized);
      setHasStoredData(true);
      return normalized;
    } finally {
      setIsSubmitting(false);
    }
  }, [config.fields, validateAll, values]);

  const reset = useCallback<UseDynamicFormResult['reset']>(async () => {
    await clearSubmission();
    setValues(initialValues);
    setErrors({});
    setHasStoredData(false);
  }, [initialValues]);

  return {
    status,
    values,
    errors,
    hasStoredData,
    isSubmitting,
    setValue,
    reset,
    submit,
  };
}
