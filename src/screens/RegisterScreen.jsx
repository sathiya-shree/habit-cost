// src/screens/RegisterScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { InputField, GradientButton, GhostButton, ProgressBar } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [income, setIncome] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function getPasswordStrength(pw) {
    if (pw.length < 4) return { score: 0, label: '', color: COLORS.border };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return { score: 0.25, label: 'Weak', color: COLORS.coral };
    if (s === 2) return { score: 0.5, label: 'Fair', color: COLORS.yellow };
    if (s === 3) return { score: 0.75, label: 'Good', color: COLORS.lime };
    return { score: 1, label: 'Strong 💪', color: COLORS.teal };
  }

  const strength = getPasswordStrength(password);

  function validate() {
    const e = {};
    if (name.trim().length < 2) e.name = 'Enter your full name (min. 2 chars)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, income: parseInt(income) || 50000 });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E8F8F0', COLORS.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
              <LinearGradient colors={COLORS.gradHero} style={styles.headerIcon} start={{x:0,y:0}} end={{x:1,y:1}}>
                <Text style={{ fontSize: 28 }}>🚀</Text>
              </LinearGradient>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join HabitCost and take control of your spending</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <InputField
                label="Full Name"
                icon="👤"
                placeholder="Alex Johnson"
                value={name}
                onChangeText={setName}
                error={errors.name}
                autoCapitalize="words"
              />

              <InputField
                label="Email Address"
                icon="✉️"
                placeholder="alex@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={errors.email}
              />

              <InputField
                label="Password"
                icon="🔒"
                placeholder="Min. 8 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
              />

              {password.length > 0 && (
                <View style={styles.strengthWrap}>
                  <ProgressBar progress={strength.score} color={strength.color} height={6} />
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                </View>
              )}

              <InputField
                label="Monthly Income (optional)"
                icon="💰"
                placeholder="₹50,000"
                value={income}
                onChangeText={setIncome}
                keyboardType="numeric"
              />
              <Text style={styles.hint}>Used to show % of income spent on habits</Text>

              {errors.submit && (
                <View style={styles.submitError}>
                  <Text style={styles.submitErrorText}>⚠️ {errors.submit}</Text>
                </View>
              )}

              <GradientButton
                label="Create My Account"
                onPress={handleRegister}
                loading={loading}
                colors={COLORS.gradHero}
                style={{ marginTop: SPACING.md }}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google */}
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85} onPress={() => {}}>
                <Text style={styles.socialIcon}>🔍</Text>
                <Text style={styles.socialText}>Continue with Google</Text>
              </TouchableOpacity>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.switchLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 48 },

  header: { alignItems: 'center', paddingTop: 20, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  backBtn: { alignSelf: 'flex-start', marginBottom: SPACING.md },
  backText: { fontFamily: FONTS.semibold, fontSize: 15, color: COLORS.teal },
  headerIcon: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...SHADOW.md },
  title: { fontFamily: FONTS.bold, fontSize: 30, color: COLORS.text, marginBottom: 8 },
  subtitle: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text2, textAlign: 'center', lineHeight: 22 },

  form: { paddingHorizontal: SPACING.lg },

  strengthWrap: { marginTop: -8, marginBottom: 16 },
  strengthLabel: { fontFamily: FONTS.semibold, fontSize: 12, marginTop: 5, textAlign: 'right' },

  hint: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.text3, marginTop: -8, marginBottom: 16 },

  submitError: { backgroundColor: COLORS.coral + '18', borderRadius: RADIUS.md, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.coral + '40' },
  submitErrorText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.coral },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.md, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text3 },

  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.lg, paddingVertical: 15 },
  socialIcon: { fontSize: 18 },
  socialText: { fontFamily: FONTS.semibold, fontSize: 15, color: COLORS.text },

  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.lg },
  switchText: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text2 },
  switchLink: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.teal },
});
