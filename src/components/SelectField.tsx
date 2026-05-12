import { useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { SelectField as SelectFieldType } from '@/types/form';

type Props = {
  field: SelectFieldType;
  value: string;
  hasError: boolean;
  onChange: (next: string) => void;
};

export function SelectField({ field, value, hasError, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const match = field.options.find((option) => option.value === value);
    return match?.label;
  }, [field.options, value]);

  const handleSelect = useCallback(
    (next: string) => {
      onChange(next);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          hasError && styles.triggerError,
          pressed && styles.triggerPressed,
        ]}
        accessibilityRole="button"
      >
        <Text style={[styles.triggerText, !selectedLabel && styles.placeholderText]}>
          {selectedLabel ?? field.placeholder ?? 'Selecione...'}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.sheetTitle}>{field.label}</Text>
            <FlatList
              data={field.options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const selected = item.value === value;
                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.option,
                      selected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },
  triggerText: {
    fontSize: 15,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 14,
    color: colors.textMuted,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    maxHeight: '70%',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionPressed: {
    backgroundColor: colors.background,
  },
  optionSelected: {
    backgroundColor: colors.background,
  },
  optionText: {
    fontSize: 15,
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.4,
  },
});
