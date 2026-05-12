import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { CheckboxField as CheckboxFieldType } from '@/types/form';

type Props = {
  field: CheckboxFieldType;
  value: boolean;
  onChange: (next: boolean) => void;
};

export function CheckboxField({ field, value, onChange }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => onChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
    >
      <View style={[styles.box, value && styles.boxChecked]}>
        {value ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{field.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  rowPressed: {
    opacity: 0.7,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  boxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  check: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
  label: {
    fontSize: 15,
    color: colors.text,
    flexShrink: 1,
  },
});
