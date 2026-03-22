// src/screens/SplashScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '../utils/theme';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '💰', title: 'Track Every Rupee',   desc: 'See exactly what your daily habits cost — daily, monthly, yearly.' },
  { icon: '📊', title: 'Smart Analytics',      desc: 'Beautiful charts show where your money really goes.' },
  { icon: '🔥', title: 'Streaks & Rewards',    desc: 'Stay motivated with daily streaks and achievement badges.' },
  { icon: '🔔', title: 'Daily Reminders',      desc: 'Get a nudge at your chosen time to stay on track.' },
];

const STATS = [
  { num: '₹2.1L', label: 'avg yearly\nspend' },
  { num: '847h',  label: 'time lost\nper year' },
  { num: '10x',   label: 'investment\nreturn' },
];

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E8F8F0', '#F0FDF8', '#FAFFFC']} style={StyleSheet.absoluteFill} />
      <View style={[styles.blob, styles.blobTeal]} />
      <View style={[styles.blob, styles.blobCoral]} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.hero}>
            <LinearGradient colors={COLORS.gradHero} style={styles.logo} start={{x:0,y:0}} end={{x:1,y:1}}>
              <Text style={styles.logoEmoji}>💸</Text>
            </LinearGradient>
            <Text style={styles.appName}>HabitCost</Text>
            <Text style={styles.tagline}>See the real cost of your{'\n'}everyday habits</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              {STATS.map((s, i) => (
                <View key={i} style={[styles.statItem, i < STATS.length - 1 && styles.statBorder]}>
                  <Text style={styles.statNum}>{s.num}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Feature cards */}
          <View style={styles.features}>
            {FEATURES.map((f, i) => (
              <View key={i} style={[styles.featureCard, SHADOW.sm]}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* CTA Buttons */}
          <View style={styles.cta}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.85}
            >
              <LinearGradient colors={COLORS.gradHero} style={styles.primaryBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Text style={styles.primaryBtnText}>Get Started — It's Free 🚀</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
              style={styles.outlineBtn}
            >
              <Text style={styles.outlineBtnText}>I already have an account</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              No credit card needed · 100% free · Your data stays on your device
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 48 },

  blob: { position: 'absolute', borderRadius: 999 },
  blobTeal: { width: 250, height: 250, backgroundColor: '#0CB8A418', top: -60, right: -80 },
  blobCoral: { width: 200, height: 200, backgroundColor: '#FF6B6B14', top: 200, left: -80 },

  hero: { alignItems: 'center', paddingTop: 48, paddingHorizontal: SPACING.xl },

  logo: {
    width: 90, height: 90, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, ...SHADOW.lg,
  },
  logoEmoji: { fontSize: 44 },

  appName: {
    fontSize: 42, fontWeight: '800', color: COLORS.text,
    letterSpacing: -1, marginBottom: 10,
  },
  tagline: {
    fontSize: 18, fontWeight: '400', color: COLORS.text2,
    textAlign: 'center', lineHeight: 26, marginBottom: 32,
  },

  statsRow: {
    flexDirection: 'row', width: '100%',
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden', ...SHADOW.sm,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statBorder: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statNum: { fontSize: 22, fontWeight: '700', color: COLORS.teal, marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.text2, textAlign: 'center', lineHeight: 15 },

  features: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, gap: 12 },
  featureCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 12,
  },
  featureIcon: { fontSize: 30, width: 44, textAlign: 'center' },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 3 },
  featureDesc: { fontSize: 13, color: COLORS.text2, lineHeight: 19 },

  cta: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },

  primaryBtn: {
    borderRadius: RADIUS.lg, paddingVertical: 17,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOW.coral,
  },
  primaryBtnText: { fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

  outlineBtn: {
    borderWidth: 2, borderColor: COLORS.teal, borderRadius: RADIUS.lg,
    paddingVertical: 15, alignItems: 'center', marginTop: SPACING.md,
  },
  outlineBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.teal },

  disclaimer: {
    fontSize: 12, color: COLORS.text3,
    textAlign: 'center', marginTop: 16, lineHeight: 18,
  },
});
