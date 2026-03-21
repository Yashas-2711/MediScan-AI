import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MedicineInfo } from '@/services/geminiService';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface SectionProps {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  items: string[];
  accentColor: string;
}

function ExpandableSection({ title, icon, iconColor, items, accentColor }: SectionProps) {
  const [expanded, setExpanded] = useState(true);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(e => !e);
  };

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggle} activeOpacity={0.7}>
        <View style={[styles.sectionIcon, { backgroundColor: `${iconColor}18` }]}>
          <Ionicons name={icon} size={14} color={iconColor} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color="#6B7280" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.sectionBody}>
          {items.map((item, i) => (
            <View key={i} style={styles.bullet}>
              <View style={[styles.bulletDot, { backgroundColor: accentColor }]} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const CONFIDENCE_LABELS: Record<string, { label: string; color: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  high: { label: 'High Confidence', color: '#00D4AA', icon: 'shield-checkmark' },
  medium: { label: 'Medium Confidence', color: '#F59E0B', icon: 'shield-half' },
  low: { label: 'Low Confidence', color: '#EF4444', icon: 'shield-outline' },
};

interface ResultCardProps {
  medicine: MedicineInfo;
}

export default function ResultCard({ medicine }: ResultCardProps) {
  const conf = CONFIDENCE_LABELS[medicine.confidence] || CONFIDENCE_LABELS.low;

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <LinearGradient
        colors={['rgba(0,212,170,0.12)', 'rgba(0,212,170,0.04)']}
        style={styles.topBanner}
      >
        <View style={styles.bannerLeft}>
          <Text style={styles.medicineName}>{medicine.name}</Text>
          <Text style={styles.genericName}>{medicine.genericName}</Text>
          <View style={styles.tagsRow}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{medicine.category}</Text>
            </View>
            <View style={[styles.confidenceTag, { borderColor: conf.color }]}>
              <Ionicons name={conf.icon} size={11} color={conf.color} />
              <Text style={[styles.confidenceText, { color: conf.color }]}>{conf.label}</Text>
            </View>
          </View>
        </View>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={28} color="#00D4AA" />
        </View>
      </LinearGradient>

      {/* Quick Info */}
      <View style={styles.quickInfoRow}>
        {medicine.dosage && medicine.dosage !== 'Not visible' && (
          <View style={styles.quickInfoCard}>
            <Ionicons name="flask" size={18} color="#60A5FA" />
            <Text style={styles.quickInfoLabel}>Dosage</Text>
            <Text style={styles.quickInfoValue}>{medicine.dosage}</Text>
          </View>
        )}
        {medicine.manufacturer && medicine.manufacturer !== 'Not visible' && (
          <View style={styles.quickInfoCard}>
            <Ionicons name="business" size={18} color="#A78BFA" />
            <Text style={styles.quickInfoLabel}>Manufacturer</Text>
            <Text style={styles.quickInfoValue} numberOfLines={2}>{medicine.manufacturer}</Text>
          </View>
        )}
      </View>

      {/* Expandable Sections */}
      <View style={styles.sections}>
        <ExpandableSection
          title="Uses & Indications"
          icon="medical"
          iconColor="#00D4AA"
          items={medicine.uses}
          accentColor="#00D4AA"
        />
        <View style={styles.sectionDivider} />
        <ExpandableSection
          title="Side Effects"
          icon="alert-circle"
          iconColor="#F59E0B"
          items={medicine.sideEffects}
          accentColor="#F59E0B"
        />
        <View style={styles.sectionDivider} />
        <ExpandableSection
          title="Warnings & Precautions"
          icon="warning"
          iconColor="#EF4444"
          items={medicine.warnings}
          accentColor="#EF4444"
        />
      </View>

      {/* Disclaimer Footer */}
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={13} color="#6B7280" />
        <Text style={styles.disclaimerText}>
          For informational purposes only. Always verify with a pharmacist.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: '#111827',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,212,170,0.15)',
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
  },
  bannerLeft: { flex: 1 },
  medicineName: { fontSize: 20, fontWeight: '800', color: '#F9FAFB', marginBottom: 4 },
  genericName: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  categoryTag: {
    backgroundColor: 'rgba(0,212,170,0.15)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  categoryTagText: { color: '#00D4AA', fontSize: 12, fontWeight: '700' },
  confidenceTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    backgroundColor: 'transparent',
  },
  confidenceText: { fontSize: 11, fontWeight: '600' },
  successIcon: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(0,212,170,0.1)',
    borderWidth: 2, borderColor: 'rgba(0,212,170,0.25)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 12,
  },
  quickInfoRow: { flexDirection: 'row', gap: 1, backgroundColor: '#0A0E1A' },
  quickInfoCard: {
    flex: 1, alignItems: 'center', gap: 4, padding: 14,
    backgroundColor: '#111827',
  },
  quickInfoLabel: { fontSize: 10, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  quickInfoValue: { fontSize: 12, color: '#E5E7EB', fontWeight: '600', textAlign: 'center' },
  sections: { padding: 16 },
  section: { marginVertical: 2 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10,
  },
  sectionIcon: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { flex: 1, fontSize: 13, fontWeight: '700', color: '#E5E7EB' },
  sectionBody: { paddingLeft: 12, paddingBottom: 8 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  bulletText: { fontSize: 13, color: '#9CA3AF', flex: 1, lineHeight: 20 },
  sectionDivider: { height: 1, backgroundColor: '#1F2937', marginVertical: 2 },
  disclaimer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    padding: 14, backgroundColor: '#0F1724',
  },
  disclaimerText: { flex: 1, fontSize: 11, color: '#6B7280', lineHeight: 16 },
});
