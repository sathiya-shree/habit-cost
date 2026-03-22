// src/screens/DashboardScreen.jsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { StreakBadge, SectionHeader, EmptyState } from '../components/UI';
import HabitCard from '../components/HabitCard';
import AddHabitSheet from '../components/AddHabitSheet';
import { useAuth } from '../context/AuthContext';
import {
  getMonthlyCost, getYearlyCost, getMonthlyMinutes,
  formatCurrency, formatMinutes, getTenYearProjection,
} from '../data/habits';

const { width } = Dimensions.get('window');

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning ☀️';
  if (h < 17) return 'Good afternoon 🌤️';
  return 'Good evening 🌙';
}

export default function DashboardScreen({ navigation }) {
  const { user, addHabit, deleteHabit } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const habits = user?.habits || [];
  const totalMonthly = habits.reduce((s, h) => s + getMonthlyCost(h), 0);
  const totalYearly  = totalMonthly * 12;
  const totalMins    = habits.reduce((s, h) => s + getMonthlyMinutes(h), 0);
  const dailyCost    = totalMonthly / 30;
  const { invested } = getTenYearProjection(totalMonthly);
  const incomePct    = Math.min(100, ((totalMonthly / (user?.income || 50000)) * 100));
  const firstName    = (user?.name || '').split(' ')[0];
  const initials     = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  async function handleSaveHabit(habit) {
    await addHabit(habit);
  }

  function handleDelete(id) {
    Alert.alert('Delete Habit', 'Remove this habit from tracking?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(id) },
    ]);
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── HERO HEADER ─────────────────────────────── */}
          <LinearGradient colors={['#E8FAF3', '#F5FDF8']} style={styles.heroHeader}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{firstName} 👋</Text>
              </View>
              <View style={styles.headerRight}>
                <StreakBadge count={user?.streak || 1} />
                <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
                  <LinearGradient colors={COLORS.gradHero} style={styles.avatarGrad}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Income bar */}
            <View style={styles.budgetCard}>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Monthly habit spend</Text>
                <Text style={styles.budgetValue}>{formatCurrency(totalMonthly)} / {formatCurrency(user?.income || 50000)}</Text>
              </View>
              <View style={styles.budgetTrack}>
                <LinearGradient
                  colors={incomePct > 30 ? COLORS.gradDanger : COLORS.gradTeal}
                  style={[styles.budgetFill, { width: `${incomePct}%` }]}
                  start={{x:0,y:0}} end={{x:1,y:0}}
                />
              </View>
              <Text style={styles.budgetPct}>{incomePct.toFixed(1)}% of your income</Text>
            </View>
          </LinearGradient>

          {/* ─── STAT CARDS ──────────────────────────────── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
          >
            <StatCard icon="📅" label="Daily" value={formatCurrency(dailyCost)} colors={COLORS.gradCoral} />
            <StatCard icon="📆" label="Monthly" value={formatCurrency(totalMonthly)} colors={COLORS.gradTeal} />
            <StatCard icon="🗓️" label="Yearly" value={formatCurrency(totalYearly)} colors={COLORS.gradLime} labelDark />
            <StatCard icon="⏰" label="Time / Month" value={formatMinutes(totalMins)} colors={['#A29BFE','#FD79A8']} />
          </ScrollView>

          {/* ─── HABITS ──────────────────────────────────── */}
          <SectionHeader title="My Habits" action="+ Add New" onAction={() => setSheetOpen(true)} />

          {habits.length === 0 ? (
            <EmptyState
              icon="🌱"
              title="No habits tracked yet"
              subtitle="Add your first habit to see how much it really costs you over time."
              action="+ Add First Habit"
              onAction={() => setSheetOpen(true)}
            />
          ) : (
            habits.map((h, i) => (
              <HabitCard
                key={h.id}
                habit={h}
                index={i}
                onDelete={handleDelete}
                onPress={() => {}}
              />
            ))
          )}

          {/* ─── 10-YEAR PROJECTION ──────────────────────── */}
          {habits.length > 0 && (
            <>
              <SectionHeader title="10-Year Projection 🔮" />
              <View style={styles.projCard}>
                <LinearGradient colors={['#FFF8F0', '#FFF3E8']} style={styles.projInner} start={{x:0,y:0}} end={{x:1,y:1}}>
                  <View style={styles.projRow}>
                    <View style={styles.projItem}>
                      <Text style={styles.projIcon}>😬</Text>
                      <Text style={styles.projLabel}>If you continue</Text>
                      <Text style={[styles.projValue, { color: COLORS.coral }]}>{formatCurrency(totalYearly * 10)}</Text>
                      <Text style={styles.projSub}>total spent</Text>
                    </View>
                    <View style={styles.projDivider} />
                    <View style={styles.projItem}>
                      <Text style={styles.projIcon}>📈</Text>
                      <Text style={styles.projLabel}>If invested @ 12%</Text>
                      <Text style={[styles.projValue, { color: COLORS.teal }]}>{formatCurrency(invested)}</Text>
                      <Text style={styles.projSub}>potential returns</Text>
                    </View>
                  </View>
                  <View style={styles.projFooter}>
                    <Text style={styles.projFooterText}>
                      💡 The difference is{' '}
                      <Text style={{ fontFamily: FONTS.bold, color: COLORS.lime }}>
                        {formatCurrency(invested - totalYearly * 10)}
                      </Text>
                      {' '}— that's the power of changing habits!
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setSheetOpen(true)} activeOpacity={0.85}>
        <LinearGradient colors={COLORS.gradHero} style={styles.fabGrad} start={{x:0,y:0}} end={{x:1,y:1}}>
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      <AddHabitSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={handleSaveHabit}
      />
    </View>
  );
}

function StatCard({ icon, label, value, colors, labelDark }) {
  return (
    <LinearGradient colors={colors} style={styles.statCard} start={{x:0,y:0}} end={{x:1,y:1}}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, labelDark && { color: COLORS.text }]}>{value}</Text>
      <Text style={[styles.statLabel, labelDark && { color: COLORS.text2 }]}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },

  heroHeader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.lg },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  greeting: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text2, marginBottom: 2 },
  userName: { fontFamily: FONTS.bold, fontSize: 26, color: COLORS.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { ...SHADOW.sm },
  avatarGrad: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONTS.bold, fontSize: 16, color: '#fff' },

  budgetCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  budgetLabel: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text2 },
  budgetValue: { fontFamily: FONTS.semibold, fontSize: 13, color: COLORS.text },
  budgetTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  budgetFill: { height: '100%', borderRadius: 4 },
  budgetPct: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.text3 },

  statsScroll: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: 12 },
  statCard: { width: 130, borderRadius: RADIUS.lg, padding: 16, ...SHADOW.md },
  statIcon: { fontSize: 26, marginBottom: 10 },
  statValue: { fontFamily: FONTS.bold, fontSize: 20, color: '#fff', marginBottom: 3 },
  statLabel: { fontFamily: FONTS.regular, fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  projCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border },
  projInner: { padding: SPACING.md },
  projRow: { flexDirection: 'row', alignItems: 'center' },
  projItem: { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm },
  projIcon: { fontSize: 28, marginBottom: 6 },
  projLabel: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.text2, marginBottom: 4, textAlign: 'center' },
  projValue: { fontFamily: FONTS.bold, fontSize: 22, marginBottom: 2 },
  projSub: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.text3 },
  projDivider: { width: 1, height: 80, backgroundColor: COLORS.border },
  projFooter: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: SPACING.md, paddingTop: SPACING.md },
  projFooterText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text2, lineHeight: 19, textAlign: 'center' },

  fab: { position: 'absolute', bottom: 90, right: 24, ...SHADOW.coral },
  fabGrad: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  fabText: { fontSize: 32, color: '#fff', lineHeight: 36 },
});
