import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeMedicineImage, ScanResult } from '@/services/geminiService';
import { historyStore } from '@/store/historyStore';
import ResultCard from '@/components/ResultCard';
import { useSpeech } from '@/hooks/useSpeech';

const { width } = Dimensions.get('window');

export default function ScannerScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { isSpeaking, isEnabled, speak, stop, setEnabled } = useSpeech();

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    scanAnim.stopAnimation();
    scanAnim.setValue(0);
  };

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const pickImage = async (fromCamera: boolean) => {
    let permResult;
    if (fromCamera) {
      permResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (!permResult.granted) {
      Alert.alert('Permission Required', 'Please grant permission to access your camera/gallery.');
      return;
    }

    const pickerResult = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.9,
          allowsEditing: true,
          aspect: [4, 3],
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.9,
          allowsEditing: true,
          aspect: [4, 3],
        });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      const uri = pickerResult.assets[0].uri;
      setImageUri(uri);
      setResult(null);
      await analyzeImage(uri);
    }
  };

  const analyzeImage = async (uri: string) => {
    setScanning(true);
    startPulse();

    const scanResult = await analyzeMedicineImage(uri);

    stopPulse();
    setScanning(false);
    setResult(scanResult);
    fadeIn();

    if (scanResult.success && scanResult.medicine) {
      historyStore.add({ imageUri: uri, medicine: scanResult.medicine });
      // Auto-speak the medicine name + primary use
      const med = scanResult.medicine;
      const speechText = `${med.name}. ${med.genericName}. Used for: ${med.uses.slice(0, 2).join(' and ')}.`;
      speak(speechText);
    }
  };

  const resetScan = () => {
    setImageUri(null);
    setResult(null);
  };

  const pulseStyle = {
    opacity: scanAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
    transform: [
      {
        scale: scanAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1.03],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

      {/* Header */}
      <LinearGradient colors={['#0A0E1A', '#111827']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="medical" size={20} color="#00D4AA" />
            </View>
            <Text style={styles.appTitle}>MediScan AI</Text>
          </View>
          {/* Voice mute toggle */}
          <TouchableOpacity
            style={[styles.muteBtn, isSpeaking && styles.muteBtnActive]}
            onPress={() => {
              if (isSpeaking) { stop(); } else { setEnabled(!isEnabled); }
            }}
          >
            <Ionicons
              name={isSpeaking ? 'volume-high' : isEnabled ? 'volume-medium-outline' : 'volume-mute-outline'}
              size={18}
              color={isSpeaking ? '#00D4AA' : isEnabled ? '#9CA3AF' : '#4B5563'}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        {!imageUri && (
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['rgba(0,212,170,0.08)', 'rgba(0,212,170,0.02)']}
              style={styles.heroGradient}
            >
              <View style={styles.heroIcon}>
                <Ionicons name="scan" size={64} color="#00D4AA" />
              </View>
              <Text style={styles.heroTitle}>Identify Any Medicine</Text>
              <Text style={styles.heroSubtitle}>
                Take a photo of a medicine strip, box, or tablet to instantly get detailed information powered by Google Gemini AI.
              </Text>
            </LinearGradient>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => pickImage(true)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#00D4AA', '#00B890']}
                  style={styles.primaryButtonGradient}
                >
                  <Ionicons name="camera" size={22} color="#fff" />
                  <Text style={styles.primaryButtonText}>Open Camera</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => pickImage(false)}
                activeOpacity={0.85}
              >
                <Ionicons name="images-outline" size={20} color="#00D4AA" />
                <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* Feature Pills */}
            <View style={styles.featurePills}>
              {['OCR Text Extraction', 'AI Analysis', 'Instant Results'].map((feat) => (
                <View key={feat} style={styles.pill}>
                  <Ionicons name="checkmark-circle" size={12} color="#00D4AA" />
                  <Text style={styles.pillText}>{feat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Image Preview */}
        {imageUri && (
          <View style={styles.imageSection}>
            <View style={styles.imageWrapper}>
              {scanning ? (
                <Animated.View style={[styles.imageContainer, pulseStyle]}>
                  <Image source={{ uri: imageUri }} style={styles.medicineImage} />
                  <View style={styles.scanOverlay}>
                    <View style={styles.scanFrame}>
                      <View style={[styles.corner, styles.topLeft]} />
                      <View style={[styles.corner, styles.topRight]} />
                      <View style={[styles.corner, styles.bottomLeft]} />
                      <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                    <View style={styles.scanningBadge}>
                      <ActivityIndicator size="small" color="#00D4AA" />
                      <Text style={styles.scanningText}>Analyzing with Gemini AI...</Text>
                    </View>
                  </View>
                </Animated.View>
              ) : (
                <Image source={{ uri: imageUri }} style={styles.medicineImage} />
              )}
            </View>

            {/* Rescan / New Scan Buttons */}
            {!scanning && (
              <View style={styles.imageActions}>
                <TouchableOpacity style={styles.rescanBtn} onPress={() => analyzeImage(imageUri)}>
                  <Ionicons name="refresh" size={16} color="#00D4AA" />
                  <Text style={styles.rescanText}>Re-analyze</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.newScanBtn} onPress={resetScan}>
                  <Ionicons name="add-circle-outline" size={16} color="#9CA3AF" />
                  <Text style={styles.newScanText}>New Scan</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Results */}
        {result && !scanning && (
          <Animated.View style={{ opacity: fadeAnim }}>
            {result.success && result.medicine ? (
              <ResultCard medicine={result.medicine} />
            ) : (
              <View style={styles.errorCard}>
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
                <Text style={styles.errorTitle}>Could Not Identify</Text>
                <Text style={styles.errorMessage}>{result.error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => pickImage(true)}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Camera FAB when image is loaded */}
      {imageUri && !scanning && (
        <View style={styles.fab}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => pickImage(true)}
          >
            <LinearGradient colors={['#00D4AA', '#00B890']} style={styles.fabGradient}>
              <Ionicons name="camera" size={26} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: { paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(0,212,170,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  appTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  appSubtitle: { fontSize: 12, color: '#00D4AA', fontWeight: '600', letterSpacing: 0.5 },
  muteBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#1F2937',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#374151',
  },
  muteBtnActive: {
    backgroundColor: 'rgba(0,212,170,0.15)',
    borderColor: 'rgba(0,212,170,0.4)',
  },
  scrollView: { flex: 1 },
  heroSection: { padding: 20 },
  heroGradient: { borderRadius: 20, padding: 32, alignItems: 'center', marginBottom: 24 },
  heroIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(0,212,170,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(0,212,170,0.2)',
  },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 10 },
  heroSubtitle: {
    fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10,
  },
  actionButtons: { gap: 12, marginBottom: 20 },
  primaryButton: { borderRadius: 16, overflow: 'hidden' },
  primaryButtonGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 16,
    borderWidth: 1.5, borderColor: 'rgba(0,212,170,0.4)',
    backgroundColor: 'rgba(0,212,170,0.05)',
  },
  secondaryButtonText: { color: '#00D4AA', fontSize: 15, fontWeight: '600' },
  featurePills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,212,170,0.08)',
    borderWidth: 1, borderColor: 'rgba(0,212,170,0.15)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  pillText: { fontSize: 12, color: '#6EE7D0', fontWeight: '500' },
  imageSection: { paddingHorizontal: 20, paddingTop: 10 },
  imageWrapper: { borderRadius: 20, overflow: 'hidden', marginBottom: 12 },
  imageContainer: { position: 'relative' },
  medicineImage: { width: '100%', height: 240, borderRadius: 20 },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 20,
  },
  scanFrame: { width: 180, height: 130, position: 'absolute' },
  corner: { position: 'absolute', width: 22, height: 22, borderColor: '#00D4AA', borderWidth: 3 },
  topLeft: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 4 },
  topRight: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 4 },
  bottomLeft: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 4 },
  bottomRight: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 4 },
  scanningBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 24, marginTop: 100,
  },
  scanningText: { color: '#00D4AA', fontSize: 13, fontWeight: '600' },
  imageActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  rescanBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 12,
    backgroundColor: 'rgba(0,212,170,0.1)', borderWidth: 1, borderColor: 'rgba(0,212,170,0.3)',
  },
  rescanText: { color: '#00D4AA', fontSize: 13, fontWeight: '600' },
  newScanBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#1F2937', borderWidth: 1, borderColor: '#374151',
  },
  newScanText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  errorCard: {
    margin: 20, padding: 28, backgroundColor: '#1A1A2E',
    borderRadius: 20, alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#EF4444' },
  errorMessage: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
  retryButton: {
    marginTop: 8, backgroundColor: 'rgba(239,68,68,0.15)',
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
  },
  retryButtonText: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
  fab: { position: 'absolute', bottom: 90, right: 20 },
  fabButton: { borderRadius: 30, overflow: 'hidden', elevation: 8, shadowColor: '#00D4AA', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  fabGradient: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
});
