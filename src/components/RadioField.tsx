import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { RadioField as RadioFieldType } from '@/types/form';

type Props = {
  field: RadioFieldType;
  value: string;
  onChange: (next: string) => void;
};

export function RadioField({ field, value, onChange }: Props) {
  return (
    <View style={styles.list}>
      {field.options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <View style={[styles.outer, selected && styles.outerSelected]}>
              {selected ? <View style={styles.inner} /> : null}
            </View>
            <Text style={styles.label}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  rowPressed: {
    opacity: 0.7,
  },
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  outerSelected: {
    borderColor: colors.primary,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 15,
    color: colors.text,
  },
});
