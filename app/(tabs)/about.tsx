import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface InfoRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  color?: string;
}

function InfoRow({ icon, label, value, color = '#9CA3AF' }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color="#00D4AA" />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const FEATURES = [
  { icon: 'camera' as const, title: 'Camera Capture', desc: 'Take instant photos of medicine strips or boxes' },
  { icon: 'images-outline' as const, title: 'Gallery Import', desc: 'Import from your photo library for analysis' },
  { icon: 'sparkles' as const, title: 'Gemini AI', desc: 'Google\'s multimodal AI understands images and text' },
  { icon: 'text-outline' as const, title: 'OCR Extraction', desc: 'Reads medicine names, dosage, and manufacturer details' },
  { icon: 'alert-circle-outline' as const, title: 'Safety Warnings', desc: 'Highlights important precautions and side effects' },
  { icon: 'time-outline' as const, title: 'Scan History', desc: 'Keeps a log of all your previous scans' },
];

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E1A', '#111827']} style={styles.header}>
        <Text style={styles.headerTitle}>About</Text>
        <Text style={styles.headerSubtitle}>MediScan AI v1.0.0</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(0,212,170,0.1)', 'rgba(0,212,170,0.03)']}
            style={styles.heroCard}
          >
            <View style={styles.appIconLarge}>
              <Ionicons name="medical" size={44} color="#00D4AA" />
            </View>
            <Text style={styles.appName}>MediScan AI</Text>
            <Text style={styles.appDesc}>
              An AI-powered medicine identification app. Point your camera at any medicine strip, blister pack, or box to instantly identify it using Google Gemini's multimodal intelligence.
            </Text>
          </LinearGradient>
        </View>

        {/* Technology Stack */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <View style={styles.card}>
            <InfoRow icon="phone-portrait-outline" label="Framework" value="React Native (Expo)" color="#60A5FA" />
            <View style={styles.divider} />
            <InfoRow icon="sparkles" label="AI Engine" value="Google Gemini 2.5 Flash" color="#00D4AA" />
            <View style={styles.divider} />
            <InfoRow icon="camera-outline" label="Camera" value="expo-image-picker" color="#F59E0B" />
            <View style={styles.divider} />
            <InfoRow icon="navigate" label="Navigation" value="Expo Router (File-based)" color="#A78BFA" />
          </View>
        </View> */}

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feat) => (
              <View key={feat.title} style={styles.featureCard}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={feat.icon} size={20} color="#00D4AA" />
                </View>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.card}>
            {[
              { step: '1', text: 'Take or select a photo of any medicine' },
              { step: '2', text: 'Image is converted to base64 and sent to Gemini API' },
              { step: '3', text: 'Gemini reads text, identifies the medicine, and returns structured data' },
              { step: '4', text: 'Results are displayed with usage, warnings, and side effects' },
            ].map((item, idx) => (
              <View key={item.step} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumText}>{item.step}</Text>
                </View>
                <Text style={styles.stepText}>{item.text}</Text>
                {idx < 3 && (
                  <View style={styles.stepConnector} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.section}>
          <View style={styles.disclaimerCard}>
            <Ionicons name="warning-outline" size={20} color="#F59E0B" />
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              This app is for informational purposes only. Always consult a licensed healthcare professional or pharmacist before taking any medicine. Do not rely solely on AI-generated results for medical decisions.
            </Text>
          </View>
        </View>

        {/* Links */}
      

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  scrollView: { flex: 1 },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1F2937' },
  heroCard: { borderRadius: 20, padding: 28, alignItems: 'center' },
  appIconLarge: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(0,212,170,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(0,212,170,0.25)', marginBottom: 16,
  },
  appName: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 10 },
  appDesc: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  infoIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: 'rgba(0,212,170,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '600', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#1F2937', marginVertical: 4 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: {
    width: '47%', backgroundColor: '#111827',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#1F2937',
  },
  featureIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(0,212,170,0.1)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  featureTitle: { fontSize: 13, fontWeight: '700', color: '#F9FAFB', marginBottom: 4 },
  featureDesc: { fontSize: 11, color: '#6B7280', lineHeight: 16 },
  stepRow: { paddingVertical: 10, paddingLeft: 8, position: 'relative' },
  stepNumber: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(0,212,170,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#00D4AA', marginBottom: 6,
  },
  stepNumText: { color: '#00D4AA', fontSize: 12, fontWeight: '800' },
  stepText: { fontSize: 13, color: '#9CA3AF', lineHeight: 18 },
  stepConnector: {
    position: 'absolute', left: 20, top: 52, width: 1.5, height: 20,
    backgroundColor: 'rgba(0,212,170,0.3)',
  },
  disclaimerCard: {
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)',
    borderRadius: 16, padding: 18, alignItems: 'center', gap: 10,
  },
  disclaimerTitle: { fontSize: 15, fontWeight: '700', color: '#F59E0B' },
  disclaimerText: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8,
  },
  linkText: { flex: 1, fontSize: 14, color: '#E5E7EB', fontWeight: '500' },
});
