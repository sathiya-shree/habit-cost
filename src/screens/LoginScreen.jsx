// src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, register } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    const e = {};
    if (!email.trim())  e.email    = 'Enter your email';
    if (!password)      e.password = 'Enter your password';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    setLoading(true);
    try {
      // Create/login a guest account automatically
      const guestEmail = 'guest@habitcost.app';
      const guestPass  = 'guest123456';
      try {
        await login({ email: guestEmail, password: guestPass });
      } catch {
        // Guest account doesn't exist yet, create it
        await register({
          name: 'Guest User',
          email: guestEmail,
          password: guestPass,
          income: 50000,
        });
      }
    } catch (err) {
      setErrors({ submit: 'Guest login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E8F8F0', COLORS.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
              <LinearGradient colors={COLORS.gradCoral} style={styles.headerIcon}>
                <Text style={{ fontSize: 28 }}>👋</Text>
              </LinearGradient>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue tracking{'\n'}your habits</Text>
            </View>

            <View style={styles.form}>

              {/* Email */}
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputRow, errors.email && styles.inputError]}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="alex@example.com"
                  placeholderTextColor={COLORS.text3}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errText}>{errors.email}</Text>}

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your password"
                  placeholderTextColor={COLORS.text3}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              {errors.password && <Text style={styles.errText}>{errors.password}</Text>}

              <TouchableOpacity style={styles.forgot}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              {errors.submit && (
                <View style={styles.submitError}>
                  <Text style={styles.submitErrorText}>⚠️ {errors.submit}</Text>
                </View>
              )}

              {/* Sign In Button */}
              <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
                <LinearGradient colors={COLORS.gradCoral} style={styles.primaryBtn}>
                  <Text style={styles.primaryBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.divLine} />
                <Text style={styles.divText}>or</Text>
                <View style={styles.divLine} />
              </View>

              {/* Guest Login — replaces Google */}
              <TouchableOpacity onPress={handleGuestLogin} disabled={loading} style={styles.guestBtn} activeOpacity={0.85}>
                <Text style={styles.guestIcon}>🚀</Text>
                <View>
                  <Text style={styles.guestTitle}>Try as Guest</Text>
                  <Text style={styles.guestSub}>No account needed — explore the app instantly</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.switchLink}>Sign up free</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// Need to import TextInput
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.bg },
  scroll:     { paddingBottom: 48 },
  header:     { alignItems: 'center', paddingTop: 20, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  backBtn:    { alignSelf: 'flex-start', marginBottom: SPACING.md },
  backText:   { fontSize: 15, fontWeight: '600', color: COLORS.teal },
  headerIcon: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...SHADOW.md },
  title:      { fontSize: 30, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle:   { fontSize: 15, color: COLORS.text2, textAlign: 'center', lineHeight: 22 },
  form:       { paddingHorizontal: SPACING.lg },
  label:      { fontSize: 12, fontWeight: '600', color: COLORS.text2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 },
  inputRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 14, marginBottom: 4 },
  inputError: { borderColor: COLORS.coral },
  inputIcon:  { fontSize: 17, marginRight: 10 },
  input:      { flex: 1, paddingVertical: 14, fontSize: 16, color: COLORS.text },
  errText:    { fontSize: 12, color: COLORS.coral, marginBottom: 8 },
  forgot:     { alignSelf: 'flex-end', marginBottom: SPACING.md, marginTop: 4 },
  forgotText: { fontSize: 14, fontWeight: '600', color: COLORS.teal },
  submitError:     { backgroundColor: COLORS.coral + '18', borderRadius: RADIUS.md, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.coral + '40' },
  submitErrorText: { fontSize: 14, color: COLORS.coral },
  primaryBtn:     { borderRadius: RADIUS.lg, paddingVertical: 17, alignItems: 'center', ...SHADOW.coral },
  primaryBtnText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  divider:  { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.md, gap: 12 },
  divLine:  { flex: 1, height: 1, backgroundColor: COLORS.border },
  divText:  { fontSize: 14, color: COLORS.text3 },
  guestBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.card, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: 16 },
  guestIcon:  { fontSize: 28 },
  guestTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  guestSub:   { fontSize: 12, color: COLORS.text2 },
  switchRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.lg },
  switchText: { fontSize: 15, color: COLORS.text2 },
  switchLink: { fontSize: 15, fontWeight: '700', color: COLORS.coral },
});
