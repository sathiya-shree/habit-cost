// src/screens/ProfileScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { Toggle, Badge, SectionHeader, ProgressBar } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { getMonthlyCost, ACHIEVEMENT_LIST, formatCurrency } from '../data/habits';
import { scheduleDailyReminders, cancelReminders } from '../utils/notifications';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser, clearAllHabits } = useAuth();
  const [notifEnabled, setNotifEnabled] = useState(user?.notificationsEnabled ?? true);

  const habits = user?.habits || [];
  const totalMonthly = habits.reduce((s, h) => s + getMonthlyCost(h), 0);
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Evaluate achievements
  function isUnlocked(achievement) {
    switch (achievement.metric) {
      case 'habits_count': return habits.length >= achievement.target;
      case 'streak': return (user?.streak || 0) >= achievement.target;
      case 'monthly_total': return totalMonthly >= achievement.target;
      default: return false;
    }
  }

  async function toggleNotifications(val) {
    setNotifEnabled(val);
    await updateUser({ notificationsEnabled: val });
    if (val) {
      const firstName = (user?.name || '').split(' ')[0];
      const ok = await scheduleDailyReminders(firstName);
      if (!ok) {
        Alert.alert('Permission Needed', 'Please allow notifications in your device settings.');
      }
    } else {
      await cancelReminders();
    }
  }

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  }

  function handleClearHabits() {
    Alert.alert('Clear All Habits', 'This will permanently delete all your habits. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => clearAllHabits() },
    ]);
  }

  const unlockedCount = ACHIEVEMENT_LIST.filter(a => isUnlocked(a)).length;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

          {/* Profile Hero */}
          <LinearGradient colors={['#E8FAF3', '#F0FFFE']} style={styles.profileHero}>
            <LinearGradient colors={COLORS.gradHero} style={styles.avatarLarge}>
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: COLORS.coral + '18', borderColor: COLORS.coral + '40' }]}>
                <Text style={[styles.badgeText, { color: COLORS.coral }]}>🔥 {user?.streak || 1}-day streak</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: COLORS.teal + '18', borderColor: COLORS.teal + '40' }]}>
                <Text style={[styles.badgeText, { color: COLORS.teal }]}>🎯 {habits.length} habits</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: COLORS.lime + '18', borderColor: COLORS.lime + '40' }]}>
                <Text style={[styles.badgeText, { color: COLORS.limeDark }]}>⚡ Early Adopter</Text>
              </View>
            </View>

            {/* Quick stats */}
            <View style={styles.miniStats}>
              <MiniStat label="Monthly Spend" value={formatCurrency(totalMonthly)} color={COLORS.coral} />
              <View style={styles.miniDivider} />
              <MiniStat label="Income" value={formatCurrency(user?.income || 50000)} color={COLORS.teal} />
              <View style={styles.miniDivider} />
              <MiniStat label="Achievements" value={`${unlockedCount}/${ACHIEVEMENT_LIST.length}`} color={COLORS.yellow} />
            </View>
          </LinearGradient>

          {/* Streak Progress */}
          <SectionHeader title="Streak Progress 🔥" />
          <View style={[styles.streakCard, SHADOW.sm]}>
            <View style={styles.streakTop}>
              <View>
                <Text style={styles.streakNum}>{user?.streak || 1}</Text>
                <Text style={styles.streakLabel}>day streak</Text>
              </View>
              <View style={styles.streakMilestones}>
                {[7, 14, 30, 60, 100].map(m => (
                  <View key={m} style={[styles.milestone, (user?.streak || 1) >= m && styles.milestoneActive]}>
                    <Text style={[styles.milestoneNum, (user?.streak || 1) >= m && { color: '#fff' }]}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
            <ProgressBar progress={Math.min(1, (user?.streak || 1) / 30)} color={COLORS.coral} height={8} style={{ marginTop: 12 }} />
            <Text style={styles.streakHint}>{30 - (user?.streak || 1) > 0 ? `${30 - (user?.streak || 1)} more days to 30-day milestone!` : '🎉 30-day milestone reached!'}</Text>
          </View>

          {/* Achievements */}
          <SectionHeader title="Achievements 🏆" />
          <View style={styles.achievGrid}>
            {ACHIEVEMENT_LIST.map(a => {
              const unlocked = isUnlocked(a);
              return (
                <View key={a.id} style={[styles.achievCard, unlocked && styles.achievUnlocked, SHADOW.sm]}>
                  <Text style={[styles.achievIcon, !unlocked && { opacity: 0.3 }]}>{a.icon}</Text>
                  <Text style={[styles.achievName, !unlocked && { color: COLORS.text3 }]}>{a.name}</Text>
                  <Text style={styles.achievDesc}>{a.desc}</Text>
                  {!unlocked && <Text style={styles.achievLock}>🔒</Text>}
                </View>
              );
            })}
          </View>

          {/* Settings */}
          <SectionHeader title="Settings" />
          <View style={[styles.settingsList, SHADOW.sm]}>

            <SettingItem icon="🔔" iconBg={COLORS.yellow + '20'} label="Daily Reminder" sub="8:00 AM &amp; 8:00 PM daily" right={
              <Toggle value={notifEnabled} onChange={toggleNotifications} />
            } />
            <SettingItem icon="💰" iconBg={COLORS.lime + '20'} label="Monthly Income" sub={formatCurrency(user?.income || 50000)} />
            <SettingItem icon="🌍" iconBg={COLORS.teal + '20'} label="Currency" sub="Indian Rupee (₹)" />
            <SettingItem icon="📤" iconBg={COLORS.blue + '20'} label="Export Data" sub="Download as CSV" last />
          </View>

          <SectionHeader title="Danger Zone" />
          <View style={[styles.settingsList, SHADOW.sm]}>
            <SettingItem
              icon="🗑️" iconBg={COLORS.coral + '15'} label="Clear All Habits" sub="Cannot be undone"
              onPress={handleClearHabits} labelColor={COLORS.coral}
            />
            <SettingItem
              icon="🚪" iconBg={COLORS.coral + '15'} label="Sign Out" sub={user?.email}
              onPress={handleLogout} labelColor={COLORS.coral} last
            />
          </View>

          <Text style={styles.version}>HabitCost 2026</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={[styles.miniValue, { color }]}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

function SettingItem({ icon, iconBg, label, sub, right, onPress, labelColor, last }) {
  return (
    <TouchableOpacity
      style={[styles.settingItem, !last && styles.settingBorder]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingLabel, labelColor && { color: labelColor }]}>{label}</Text>
        {sub && <Text style={styles.settingSub}>{sub}</Text>}
      </View>
      {right || (!right && onPress && <Text style={styles.settingArrow}>›</Text>)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  profileHero: { alignItems: 'center', paddingTop: SPACING.lg, paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg },
  avatarLarge: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 14, ...SHADOW.lg },
  avatarText: { fontFamily: FONTS.bold, fontSize: 32, color: '#fff' },
  profileName: { fontFamily: FONTS.bold, fontSize: 24, color: COLORS.text, marginBottom: 4 },
  profileEmail: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text2, marginBottom: 16 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1 },
  badgeText: { fontFamily: FONTS.semibold, fontSize: 12 },
  miniStats: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, width: '100%', overflow: 'hidden' },
  miniValue: { fontFamily: FONTS.bold, fontSize: 17, marginBottom: 2 },
  miniLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.text2, textAlign: 'center' },
  miniDivider: { width: 1, height: '100%', backgroundColor: COLORS.border },

  streakCard: { backgroundColor: COLORS.card, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md },
  streakTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streakNum: { fontFamily: FONTS.display, fontSize: 48, color: COLORS.coral, lineHeight: 52 },
  streakLabel: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text2, marginTop: -4 },
  streakMilestones: { flexDirection: 'row', gap: 6 },
  milestone: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.border2 },
  milestoneActive: { backgroundColor: COLORS.coral, borderColor: COLORS.coralDark },
  milestoneNum: { fontFamily: FONTS.bold, fontSize: 11, color: COLORS.text2 },
  streakHint: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.text2, marginTop: 8 },

  achievGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: 12, marginBottom: SPACING.md },
  achievCard: { width: '47%', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  achievUnlocked: { borderColor: COLORS.yellow + '60', backgroundColor: '#FFFDF0' },
  achievIcon: { fontSize: 36, marginBottom: 8 },
  achievName: { fontFamily: FONTS.semibold, fontSize: 14, color: COLORS.text, marginBottom: 4, textAlign: 'center' },
  achievDesc: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.text2, textAlign: 'center', lineHeight: 17 },
  achievLock: { position: 'absolute', top: 8, right: 8, fontSize: 14, opacity: 0.5 },

  settingsList: { backgroundColor: COLORS.card, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  settingItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  settingText: { flex: 1 },
  settingLabel: { fontFamily: FONTS.semibold, fontSize: 15, color: COLORS.text, marginBottom: 2 },
  settingSub: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text2 },
  settingArrow: { fontFamily: FONTS.regular, fontSize: 20, color: COLORS.text3 },

  version: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.text3, textAlign: 'center', padding: SPACING.lg },
});
