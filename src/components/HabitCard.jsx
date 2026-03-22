// src/components/HabitCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { getMonthlyCost, getYearlyCost, getMonthlyMinutes, formatCurrency, formatMinutes } from '../data/habits';

const CARD_COLORS = [
  ['#FF6B6B', '#FF9F43'],
  ['#0CB8A4', '#3DD6C2'],
  ['#7ED321', '#A4E84A'],
  ['#A29BFE', '#FD79A8'],
  ['#FDCB6E', '#FF9F43'],
  ['#74B9FF', '#0984E3'],
];

export default function HabitCard({ habit, index, onDelete, onPress }) {
  const gradColors = CARD_COLORS[index % CARD_COLORS.length];
  const monthly = getMonthlyCost(habit);
  const yearly = getYearlyCost(habit);
  const mins = getMonthlyMinutes(habit);
  const freqLabel = { daily: 'Every day', weekdays: 'Weekdays', weekly: 'Weekly', monthly: 'Monthly' }[habit.freq] || habit.freq;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={[styles.wrap, SHADOW.sm]}>
      <View style={[styles.accentBar, { backgroundColor: gradColors[0] }]} />
      <View style={styles.inner}>
        {/* Top row */}
        <View style={styles.topRow}>
          <LinearGradient colors={gradColors} style={styles.emojiWrap} start={{x:0,y:0}} end={{x:1,y:1}}>
            <Text style={styles.emoji}>{habit.emoji}</Text>
          </LinearGradient>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
            <Text style={styles.freq}>{freqLabel} · ₹{habit.cost}/time · {habit.time}min</Text>
          </View>

          <TouchableOpacity onPress={() => onDelete(habit.id)} style={styles.deleteBtn} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Text style={styles.deleteIcon}>🗑</Text>
          </TouchableOpacity>
        </View>

        {/* Cost Row */}
        <View style={styles.costRow}>
          <CostPill label="Monthly" value={formatCurrency(monthly)} color={gradColors[0]} bg={gradColors[0] + '15'} />
          <CostPill label="Yearly"  value={formatCurrency(yearly)}  color="#FF6B6B"       bg="#FF6B6B15"            />
          <CostPill label="Time/mo" value={formatMinutes(mins)}      color={COLORS.teal}   bg={COLORS.teal + '15'}  />
        </View>

        {/* Daily cost bar */}
        <View style={styles.barWrap}>
          <View style={styles.barTrack}>
            <LinearGradient
              colors={gradColors}
              style={[styles.barFill, { width: `${Math.min(100, (monthly / 5000) * 100)}%` }]}
              start={{x:0,y:0}} end={{x:1,y:0}}
            />
          </View>
          <Text style={styles.barLabel}>₹{(monthly / 30).toFixed(0)}/day</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CostPill({ label, value, color, bg }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
  accentBar: { width: 5 },
  inner: { flex: 1, padding: 16 },

  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  emojiWrap: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  name: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: 3 },
  freq: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.text2 },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 16 },

  costRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  pill: { flex: 1, borderRadius: RADIUS.sm, padding: 10, alignItems: 'center' },
  pillValue: { fontFamily: FONTS.bold, fontSize: 14, marginBottom: 2 },
  pillLabel: { fontFamily: FONTS.regular, fontSize: 10, color: COLORS.text2 },

  barWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barTrack: { flex: 1, height: 5, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barLabel: { fontFamily: FONTS.semibold, fontSize: 11, color: COLORS.text2 },
});
