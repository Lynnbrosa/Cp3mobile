import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { SwitchField as SwitchFieldType } from '@/types/form';

type Props = {
  field: SwitchFieldType;
  value: boolean;
  onChange: (next: boolean) => void;
};

export function SwitchField({ field, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{field.label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 15,
    color: colors.text,
    flexShrink: 1,
    paddingRight: 16,
  },
});
