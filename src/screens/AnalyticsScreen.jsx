// src/screens/AnalyticsScreen.jsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { SectionHeader } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import {
  getMonthlyCost, getYearlyCost, getMonthlyMinutes,
  formatCurrency, formatMinutes, ALTERNATIVES,
} from '../data/habits';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - SPACING.lg * 2;

const PIE_COLORS = ['#FF6B6B','#0CB8A4','#7ED321','#A29BFE','#FDCB6E','#74B9FF','#FD79A8'];

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const habits = user?.habits || [];

  const totalMonthly = useMemo(() => habits.reduce((s, h) => s + getMonthlyCost(h), 0), [habits]);
  const totalYearly  = useMemo(() => totalMonthly * 12, [totalMonthly]);

  const barData = useMemo(() => ({
    labels: habits.map(h => h.emoji + ' ' + h.name.slice(0, 6)),
    datasets: [{ data: habits.map(h => Math.round(getMonthlyCost(h))) }],
  }), [habits]);

  const pieData = useMemo(() => habits.map((h, i) => ({
    name: h.name,
    population: Math.round(getMonthlyCost(h)),
    color: PIE_COLORS[i % PIE_COLORS.length],
    legendFontColor: COLORS.text2,
    legendFontSize: 12,
  })), [habits]);

  const timeData = useMemo(() => [...habits].sort((a,b) => getMonthlyMinutes(b)-getMonthlyMinutes(a)), [habits]);
  const maxTime  = useMemo(() => Math.max(...habits.map(h => getMonthlyMinutes(h)), 1), [habits]);

  const biggestHabit = habits.length ? habits.reduce((a, b) => getMonthlyCost(a) > getMonthlyCost(b) ? a : b) : null;
  const wouldSave10yr = totalYearly * 10;

  const chartConfig = {
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    color: (opacity = 1) => `rgba(12,184,164,${opacity})`,
    labelColor: () => COLORS.text2,
    barPercentage: 0.7,
    decimalPlaces: 0,
    propsForLabels: { fontFamily: FONTS.regular, fontSize: 10 },
    propsForBackgroundLines: { stroke: COLORS.border },
  };

  if (habits.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <View style={styles.emptyHeader}>
            <Text style={styles.pageTitle}>Analytics 📊</Text>
            <Text style={styles.pageSubtitle}>Add habits to unlock insights</Text>
          </View>
          <View style={styles.emptyCenter}>
            <Text style={{ fontSize: 64 }}>📊</Text>
            <Text style={styles.emptyTitle}>No data yet</Text>
            <Text style={styles.emptyText}>Once you add habits, you'll see beautiful charts and spending breakdowns here.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <LinearGradient colors={['#E8FAF3', COLORS.bg]} style={styles.header}>
            <Text style={styles.pageTitle}>Analytics 📊</Text>
            <Text style={styles.pageSubtitle}>Where your money & time actually goes</Text>
          </LinearGradient>

          {/* Summary Strip */}
          <View style={styles.summaryStrip}>
            <SummaryItem label="Total Monthly" value={formatCurrency(totalMonthly)} color={COLORS.coral} />
            <View style={styles.stripDivider} />
            <SummaryItem label="Total Yearly" value={formatCurrency(totalYearly)} color={COLORS.teal} />
            <View style={styles.stripDivider} />
            <SummaryItem label="Habits Tracked" value={String(habits.length)} color={COLORS.lime} />
          </View>

          {/* Bar Chart */}
          <SectionHeader title="Monthly Cost per Habit" />
          <View style={[styles.chartCard, SHADOW.sm]}>
            <BarChart
              data={barData}
              width={CHART_WIDTH}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
              withInnerLines
            />
          </View>

          {/* Pie Chart */}
          <SectionHeader title="Cost Breakdown" />
          <View style={[styles.chartCard, SHADOW.sm]}>
            <PieChart
              data={pieData}
              width={CHART_WIDTH}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>

          {/* Insight Box */}
          {biggestHabit && (
            <View style={styles.insightCard}>
              <LinearGradient colors={['#E8FAF3', '#E8F8FF']} style={styles.insightInner}>
                <Text style={styles.insightIcon}>💡</Text>
                <View style={styles.insightText}>
                  <Text style={styles.insightTitle}>Top Spender</Text>
                  <Text style={styles.insightBody}>
                    <Text style={{ fontFamily: FONTS.bold, color: COLORS.teal }}>{biggestHabit.emoji} {biggestHabit.name}</Text>
                    {' costs you '}
                    <Text style={{ fontFamily: FONTS.bold, color: COLORS.coral }}>{formatCurrency(getYearlyCost(biggestHabit))}/year</Text>
                    {'. Over 10 years, that\'s '}
                    <Text style={{ fontFamily: FONTS.bold, color: COLORS.coral }}>{formatCurrency(getYearlyCost(biggestHabit) * 10)}</Text>
                    {'!'}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Time Chart */}
          <SectionHeader title="Time Spent per Month ⏰" />
          <View style={[styles.chartCard, SHADOW.sm, { paddingVertical: 16 }]}>
            {timeData.map((h, i) => {
              const mins = getMonthlyMinutes(h);
              const pct = maxTime > 0 ? (mins / maxTime) * 100 : 0;
              return (
                <View key={h.id} style={styles.timeRow}>
                  <Text style={styles.timeEmoji}>{h.emoji}</Text>
                  <View style={styles.timeBarWrap}>
                    <View style={styles.timeInfo}>
                      <Text style={styles.timeName}>{h.name}</Text>
                      <Text style={[styles.timeVal, { color: PIE_COLORS[i % PIE_COLORS.length] }]}>{formatMinutes(mins)}</Text>
                    </View>
                    <View style={styles.timeTrack}>
                      <LinearGradient
                        colors={[PIE_COLORS[i % PIE_COLORS.length], PIE_COLORS[i % PIE_COLORS.length] + '88']}
                        style={[styles.timeFill, { width: `${pct}%` }]}
                        start={{x:0,y:0}} end={{x:1,y:0}}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Alternatives */}
          <SectionHeader title="What else could you afford? 🤔" />
          <View style={[styles.chartCard, SHADOW.sm]}>
            {ALTERNATIVES.map((a, i) => {
              const canAfford = Math.floor(totalYearly / a.cost);
              const partial = (totalYearly / a.cost) * 100;
              return (
                <View key={i} style={[styles.altRow, i < ALTERNATIVES.length - 1 && styles.altRowBorder]}>
                  <Text style={styles.altIcon}>{a.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.altLabel}>{a.label}</Text>
                    {canAfford >= 1 ? (
                      <Text style={styles.altResult}>
                        You could afford <Text style={{ color: COLORS.teal, fontFamily: FONTS.bold }}>{canAfford}×</Text> per year
                      </Text>
                    ) : (
                      <Text style={styles.altResult}>
                        That's <Text style={{ color: COLORS.lime, fontFamily: FONTS.bold }}>{partial.toFixed(0)}%</Text> of the cost covered
                      </Text>
                    )}
                  </View>
                  <Text style={styles.altCost}>{formatCurrency(a.cost)}</Text>
                </View>
              );
            })}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SummaryItem({ label, value, color }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.lg },
  pageTitle: { fontFamily: FONTS.bold, fontSize: 28, color: COLORS.text, marginBottom: 4 },
  pageSubtitle: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text2 },

  emptyHeader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.lg },
  emptyCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text, marginTop: SPACING.md, marginBottom: 8 },
  emptyText: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text2, textAlign: 'center', lineHeight: 22 },

  summaryStrip: { flexDirection: 'row', backgroundColor: COLORS.card, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', ...SHADOW.sm },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  summaryValue: { fontFamily: FONTS.bold, fontSize: 18, marginBottom: 3 },
  summaryLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.text2 },
  stripDivider: { width: 1, backgroundColor: COLORS.border },

  chartCard: { backgroundColor: COLORS.card, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, overflow: 'hidden' },
  chart: { paddingRight: 0 },

  insightCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.teal + '30' },
  insightInner: { flexDirection: 'row', alignItems: 'flex-start', padding: SPACING.md, gap: 12 },
  insightIcon: { fontSize: 28, marginTop: 2 },
  insightText: { flex: 1 },
  insightTitle: { fontFamily: FONTS.semibold, fontSize: 13, color: COLORS.teal, marginBottom: 4 },
  insightBody: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text2, lineHeight: 21 },

  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: SPACING.md, marginBottom: 14 },
  timeEmoji: { fontSize: 22, width: 28, textAlign: 'center' },
  timeBarWrap: { flex: 1 },
  timeInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  timeName: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.text },
  timeVal: { fontFamily: FONTS.bold, fontSize: 13 },
  timeTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  timeFill: { height: '100%', borderRadius: 3 },

  altRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.md },
  altRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  altIcon: { fontSize: 28, width: 34, textAlign: 'center' },
  altLabel: { fontFamily: FONTS.semibold, fontSize: 14, color: COLORS.text, marginBottom: 3 },
  altResult: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text2 },
  altCost: { fontFamily: FONTS.semibold, fontSize: 13, color: COLORS.text3 },
});
