// src/components/AddHabitSheet.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView,
  StyleSheet, Modal, Animated, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { HABIT_PRESETS, EMOJIS, FREQUENCY_OPTIONS } from '../data/habits';
import { GradientButton } from './UI';

const { height: SCREEN_H } = Dimensions.get('window');

const EMOJI_COLORS = [
  ['#FF6B6B','#FF9F43'], ['#0CB8A4','#3DD6C2'], ['#7ED321','#A4E84A'],
  ['#A29BFE','#FD79A8'], ['#FDCB6E','#E17055'], ['#74B9FF','#0984E3'],
];

export default function AddHabitSheet({ visible, onClose, onSave }) {
  const [step, setStep] = useState('presets'); // 'presets' | 'custom'
  const [emoji, setEmoji] = useState('☕');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [time, setTime] = useState('');
  const [freq, setFreq] = useState('daily');
  const [errors, setErrors] = useState({});
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    if (visible) {
      setStep('presets'); resetForm();
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 180 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SCREEN_H, duration: 260, useNativeDriver: true }).start();
    }
  }, [visible]);

  function resetForm() {
    setEmoji('☕'); setName(''); setCost(''); setTime(''); setFreq('daily'); setErrors({});
  }

  function applyPreset(preset) {
    setEmoji(preset.emoji); setName(preset.name); setCost(String(preset.cost));
    setTime(String(preset.time)); setFreq(preset.freq); setStep('custom');
  }

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Enter a habit name';
    if (!cost || parseFloat(cost) <= 0) e.cost = 'Enter a valid cost';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({ emoji, name: name.trim(), cost: parseFloat(cost), time: parseFloat(time) || 0, freq });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{step === 'presets' ? '✨ Add a Habit' : '🛠️ Customize'}</Text>
            {step === 'custom' && (
              <TouchableOpacity onPress={() => setStep('presets')}>
                <Text style={styles.backLink}>← Presets</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {step === 'presets' ? (
              <View style={styles.presetsWrap}>
                {HABIT_PRESETS.map((p, i) => (
                  <TouchableOpacity key={p.id} style={styles.presetChip} onPress={() => applyPreset(p)} activeOpacity={0.8}>
                    <LinearGradient colors={EMOJI_COLORS[i % EMOJI_COLORS.length]} style={styles.presetEmoji} start={{x:0,y:0}} end={{x:1,y:1}}>
                      <Text style={{ fontSize: 20 }}>{p.emoji}</Text>
                    </LinearGradient>
                    <Text style={styles.presetName}>{p.name}</Text>
                    <Text style={styles.presetCost}>₹{p.cost}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={[styles.presetChip, styles.customChip]} onPress={() => setStep('custom')} activeOpacity={0.8}>
                  <View style={[styles.presetEmoji, { backgroundColor: COLORS.bg2 }]}>
                    <Text style={{ fontSize: 20 }}>✏️</Text>
                  </View>
                  <Text style={styles.presetName}>Custom</Text>
                  <Text style={styles.presetCost}>+ Add</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.customWrap}>
                {/* Emoji picker */}
                <Text style={styles.fieldLabel}>Choose Emoji</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
                  {EMOJIS.map(e => (
                    <TouchableOpacity key={e} onPress={() => setEmoji(e)} style={[styles.emojiBubble, emoji === e && styles.emojiBubbleActive]} activeOpacity={0.8}>
                      <Text style={styles.emojiChar}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Name */}
                <Text style={styles.fieldLabel}>Habit Name</Text>
                <View style={[styles.input, errors.name && styles.inputError]}>
                  <Text style={styles.inputEmoji}>{emoji}</Text>
                  <TextInput
                    style={styles.inputText}
                    placeholder="e.g. Morning Coffee"
                    placeholderTextColor={COLORS.text3}
                    value={name} onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
                {errors.name && <Text style={styles.errText}>{errors.name}</Text>}

                {/* Cost & Time */}
                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Cost (₹)</Text>
                    <View style={[styles.input, errors.cost && styles.inputError]}>
                      <Text style={styles.inputEmoji}>💰</Text>
                      <TextInput
                        style={styles.inputText}
                        placeholder="150"
                        placeholderTextColor={COLORS.text3}
                        value={cost} onChangeText={setCost}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.cost && <Text style={styles.errText}>{errors.cost}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Time (mins)</Text>
                    <View style={styles.input}>
                      <Text style={styles.inputEmoji}>⏱️</Text>
                      <TextInput
                        style={styles.inputText}
                        placeholder="20"
                        placeholderTextColor={COLORS.text3}
                        value={time} onChangeText={setTime}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* Frequency */}
                <Text style={styles.fieldLabel}>How often?</Text>
                <View style={styles.freqRow}>
                  {FREQUENCY_OPTIONS.map(f => (
                    <TouchableOpacity
                      key={f.key}
                      style={[styles.freqBtn, freq === f.key && styles.freqBtnActive]}
                      onPress={() => setFreq(f.key)}
                      activeOpacity={0.8}
                    >
                      {freq === f.key ? (
                        <LinearGradient colors={COLORS.gradTeal} style={styles.freqBtnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
                          <Text style={[styles.freqText, { color: '#fff' }]}>{f.label}</Text>
                        </LinearGradient>
                      ) : (
                        <Text style={styles.freqText}>{f.label}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Preview */}
                {name && cost ? (
                  <View style={styles.preview}>
                    <Text style={styles.previewTitle}>💡 Cost Preview</Text>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Monthly</Text>
                      <Text style={styles.previewVal}>₹{Math.round(parseFloat(cost || 0) * ({ daily:30, weekdays:22, weekly:4.33, monthly:1 }[freq]))}</Text>
                    </View>
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Yearly</Text>
                      <Text style={[styles.previewVal, { color: COLORS.coral }]}>₹{Math.round(parseFloat(cost || 0) * ({ daily:30, weekdays:22, weekly:4.33, monthly:1 }[freq]) * 12)}</Text>
                    </View>
                  </View>
                ) : null}

                <GradientButton label="Save Habit ✓" onPress={handleSave} colors={COLORS.gradTeal} style={{ marginTop: SPACING.md }} />
                <View style={{ height: SPACING.xl }} />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(26,46,37,0.6)' },
  sheet: {
    backgroundColor: COLORS.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: SCREEN_H * 0.9, paddingBottom: 40,
    borderWidth: 1, borderColor: COLORS.border,
  },
  handle: { width: 44, height: 5, backgroundColor: COLORS.border2, borderRadius: 3, alignSelf: 'center', marginTop: 14, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sheetTitle: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.text },
  backLink: { fontFamily: FONTS.semibold, fontSize: 14, color: COLORS.teal },

  // Presets
  presetsWrap: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 10 },
  presetChip: { width: '30%', backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border },
  customChip: { borderStyle: 'dashed' },
  presetEmoji: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  presetName: { fontFamily: FONTS.semibold, fontSize: 12, color: COLORS.text, textAlign: 'center' },
  presetCost: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.text2 },

  // Custom
  customWrap: { padding: 20 },
  fieldLabel: { fontFamily: FONTS.semibold, fontSize: 12, color: COLORS.text2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.7 },
  emojiScroll: { marginBottom: 16 },
  emojiBubble: { width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 2, borderColor: 'transparent' },
  emojiBubbleActive: { borderColor: COLORS.teal, backgroundColor: COLORS.teal + '15' },
  emojiChar: { fontSize: 22 },
  input: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 14, marginBottom: 4 },
  inputError: { borderColor: COLORS.coral },
  inputEmoji: { fontSize: 17, marginRight: 10 },
  inputText: { flex: 1, paddingVertical: 14, fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text },
  errText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.coral, marginBottom: 8 },
  twoCol: { flexDirection: 'row', gap: 12 },
  freqRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  freqBtn: { flex: 1, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: COLORS.border, overflow: 'hidden' },
  freqBtnActive: { borderColor: COLORS.teal },
  freqBtnGrad: { paddingVertical: 11, alignItems: 'center' },
  freqText: { fontFamily: FONTS.semibold, fontSize: 12, color: COLORS.text2, paddingVertical: 11, textAlign: 'center' },
  preview: { backgroundColor: COLORS.teal + '10', borderRadius: RADIUS.md, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.teal + '30' },
  previewTitle: { fontFamily: FONTS.semibold, fontSize: 13, color: COLORS.teal, marginBottom: 10 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  previewLabel: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.text2 },
  previewVal: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.teal },
});
