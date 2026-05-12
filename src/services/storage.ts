import AsyncStorage from '@react-native-async-storage/async-storage';

import type { FormValues } from '@/types/form';

const STORAGE_KEY = '@cp3-formularios-dinamicos:lastSubmission';

export const saveSubmission = async (values: FormValues): Promise<void> => {
  const payload = JSON.stringify({ values, savedAt: new Date().toISOString() });
  await AsyncStorage.setItem(STORAGE_KEY, payload);
};

export type StoredSubmission = {
  values: FormValues;
  savedAt: string;
};

export const loadSubmission = async (): Promise<StoredSubmission | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSubmission;
    if (parsed && typeof parsed === 'object' && parsed.values) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const clearSubmission = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
