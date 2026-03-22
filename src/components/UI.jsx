// src/components/UI.jsx
import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../utils/theme';

const { width } = Dimensions.get('window');

// ─── GRADIENT BUTTON ──────────────────────────────────────────────
export function GradientButton({ label, onPress, colors, style, textStyle, loading, icon, size = 'lg' }) {
  const gradColors = colors || COLORS.gradCoral;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} disabled={loading} style={style}>
      <LinearGradient
        colors={gradColors}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={[styles.gradBtn, size === 'sm' && styles.gradBtnSm, SHADOW.coral]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon && <Text style={styles.btnIcon}>{icon}</Text>}
            <Text style={[styles.gradBtnText, size === 'sm' && styles.gradBtnTextSm, textStyle]}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── OUTLINE BUTTON ───────────────────────────────────────────────
export function OutlineButton({ label, onPress, color, style, textStyle }) {
  const c = color || COLORS.teal;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.outlineBtn, { borderColor: c }, style]}
    >
      <Text style={[styles.outlineBtnText, { color: c }, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── GHOST BUTTON ─────────────────────────────────────────────────
export function GhostButton({ label, onPress, style, textStyle }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.ghostBtn, style]}>
      <Text style={[styles.ghostBtnText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── INPUT FIELD ──────────────────────────────────────────────────
export function InputField({
  label, placeholder, value, onChangeText,
  keyboardType, secureTextEntry, error, icon,
  autoCapitalize, style,
}) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={[styles.fieldWrap, style]}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View style={[
        styles.fieldRow,
        focused && styles.fieldFocused,
        error && styles.fieldError,
      ]}>
        {icon && <Text style={styles.fieldIcon}>{icon}</Text>}
        <TextInput
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text3}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────
export function Card({ children, style, onPress }) {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={[styles.card, SHADOW.sm, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, SHADOW.sm, style]}>{children}</View>;
}

// ─── BADGE ────────────────────────────────────────────────────────
export function Badge({ label, color, bg, style }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg || COLORS.bg2 }, style]}>
      <Text style={[styles.badgeText, { color: color || COLORS.teal }]}>{label}</Text>
    </View>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────
export function StatCard({ label, value, icon, gradColors, style }) {
  return (
    <LinearGradient
      colors={gradColors || ['#fff', '#fff']}
      style={[styles.statCard, SHADOW.md, style]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );
}

// ─── STREAK BADGE ─────────────────────────────────────────────────
export function StreakBadge({ count }) {
  return (
    <LinearGradient colors={COLORS.gradCoral} style={styles.streakBadge} start={{x:0,y:0}} end={{x:1,y:0}}>
      <Text style={styles.streakFire}>🔥</Text>
      <Text style={styles.streakCount}>{count}</Text>
      <Text style={styles.streakLabel}>day streak</Text>
    </LinearGradient>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────
export function ProgressBar({ progress, color, height = 8, style }) {
  const clamp = Math.min(1, Math.max(0, progress));
  return (
    <View style={[styles.progressTrack, { height }, style]}>
      <View style={[styles.progressFill, { width: `${clamp * 100}%`, backgroundColor: color || COLORS.teal, height }]} />
    </View>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────────────
export function Toggle({ value, onChange }) {
  return (
    <TouchableOpacity onPress={() => onChange(!value)} activeOpacity={0.9}>
      <LinearGradient
        colors={value ? COLORS.gradTeal : ['#D4EDDA', '#D4EDDA']}
        style={[styles.toggle, { justifyContent: value ? 'flex-end' : 'flex-start' }]}
        start={{x:0,y:0}} end={{x:1,y:0}}
      >
        <View style={styles.toggleThumb} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action, onAction }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyIcon}>{icon || '🌱'}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
      {action && (
        <GradientButton label={action} onPress={onAction} style={{ marginTop: SPACING.lg }} size="sm" />
      )}
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Gradient Button
  gradBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 17, paddingHorizontal: 24,
    borderRadius: RADIUS.lg, gap: 8,
  },
  gradBtnSm: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: RADIUS.md },
  gradBtnText: { fontFamily: FONTS.bold, fontSize: 17, color: '#fff', letterSpacing: 0.3 },
  gradBtnTextSm: { fontSize: 14 },
  btnIcon: { fontSize: 18 },

  // Outline Button
  outlineBtn: {
    borderWidth: 2, borderRadius: RADIUS.lg,
    paddingVertical: 15, paddingHorizontal: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  outlineBtnText: { fontFamily: FONTS.bold, fontSize: 16 },

  // Ghost Button
  ghostBtn: { alignItems: 'center', paddingVertical: 12 },
  ghostBtnText: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.teal },

  // Input
  fieldWrap: { marginBottom: SPACING.md },
  fieldLabel: {
    fontFamily: FONTS.semibold, fontSize: 12, color: COLORS.text2,
    marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: 16,
  },
  fieldFocused: { borderColor: COLORS.teal, backgroundColor: '#F0FFFE' },
  fieldError: { borderColor: COLORS.coral },
  fieldIcon: { fontSize: 18, marginRight: 10 },
  fieldInput: {
    flex: 1, paddingVertical: 15,
    fontFamily: FONTS.regular, fontSize: 16, color: COLORS.text,
  },
  errorText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.coral, marginTop: 5 },

  // Card
  card: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },

  // Badge
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  badgeText: { fontFamily: FONTS.semibold, fontSize: 12 },

  // Section Header
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.sm,
  },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text },
  sectionAction: { fontFamily: FONTS.semibold, fontSize: 14, color: COLORS.teal },

  // Stat Card
  statCard: { borderRadius: RADIUS.lg, padding: 16, alignItems: 'flex-start', flex: 1 },
  statIcon: { fontSize: 26, marginBottom: 8 },
  statValue: { fontFamily: FONTS.bold, fontSize: 22, color: '#fff', marginBottom: 3 },
  statLabel: { fontFamily: FONTS.regular, fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  // Streak
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
  },
  streakFire: { fontSize: 16 },
  streakCount: { fontFamily: FONTS.bold, fontSize: 18, color: '#fff' },
  streakLabel: { fontFamily: FONTS.regular, fontSize: 12, color: 'rgba(255,255,255,0.9)' },

  // Progress Bar
  progressTrack: { backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden' },
  progressFill: { borderRadius: RADIUS.full },

  // Toggle
  toggle: { width: 52, height: 28, borderRadius: 14, padding: 3 },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },

  // Empty State
  emptyWrap: { alignItems: 'center', paddingVertical: SPACING.xxl, paddingHorizontal: SPACING.xl },
  emptyIcon: { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  emptySub: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text2, textAlign: 'center', lineHeight: 22 },
});
