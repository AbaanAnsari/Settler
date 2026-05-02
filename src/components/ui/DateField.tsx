import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Spacing, FontSize, FontWeight, Radius, ThemeColors, useThemeColors } from '../../utils/colors';

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function createPickerStyles(colors: ThemeColors) {
  return {
  header: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  month_selector: {
    minWidth: 88,
    borderRadius: Radius.sm,
    paddingVertical: 6,
  },
  year_selector: {
    minWidth: 72,
    borderRadius: Radius.sm,
    paddingVertical: 6,
  },
  month_selector_label: {
    color: colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  year_selector_label: {
    color: colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  weekday_label: {
    color: colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  month_label: {
    color: colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  year_label: {
    color: colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  selected_month: {
    backgroundColor: colors.accent,
    borderRadius: Radius.sm,
  },
  selected_month_label: {
    color: '#fff',
  },
  active_year: {
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: Radius.sm,
  },
  active_year_label: {
    color: colors.accentLight,
  },
  selected_year: {
    backgroundColor: colors.accent,
    borderRadius: Radius.sm,
  },
  selected_year_label: {
    color: '#fff',
  },
  day: {
    borderRadius: Radius.sm,
  },
  day_label: {
    color: colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  outside_label: {
    color: colors.textMuted,
  },
  today: {
    borderColor: colors.accent,
    borderWidth: 1,
  },
  today_label: {
    color: colors.accentLight,
  },
  selected: {
    backgroundColor: colors.accent,
  },
  selected_label: {
    color: '#fff',
  },
  button_prev: {
    borderRadius: Radius.sm,
  },
  button_next: {
    borderRadius: Radius.sm,
  },
  button_prev_image: {
    tintColor: colors.text,
  },
  button_next_image: {
    tintColor: colors.text,
  },
  };
}

export const DateField = memo(function DateField({ value, onChange }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const colors = useThemeColors();
  const pickerStyles = createPickerStyles(colors);

  return (
    <>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
      <TouchableOpacity
        style={[styles.dateInput, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
        onPress={() => setShowPicker((visible) => !visible)}
        activeOpacity={0.75}
      >
        <Text style={[styles.dateText, { color: colors.text }]}>{value}</Text>
        <MaterialCommunityIcons
          name={showPicker ? 'chevron-up' : 'calendar-month-outline'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {showPicker && (
        <View style={[styles.calendarContainer, { backgroundColor: colors.surface }]}>
          <DateTimePicker
            mode="single"
            date={value}
            showOutsideDays={false}
            navigationPosition="around"
            containerHeight={300}
            weekdaysHeight={30}
            disableMonthPicker
            disableYearPicker
            styles={pickerStyles}
            components={{
              IconPrev: <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />,
              IconNext: <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />,
            }}
            onChange={(params) => {
              if (params.date) {
                onChange(dayjs(params.date).format('YYYY-MM-DD'));
                setShowPicker(false);
              }
            }}
          />
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  dateInput: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  calendarContainer: {
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    overflow: 'hidden',
  },
});
