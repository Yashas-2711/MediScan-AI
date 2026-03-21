import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useHistory } from '@/store/historyStore';
import { MedicineInfo } from '@/services/geminiService';

const CATEGORY_COLORS: Record<string, string> = {
  Analgesic: '#F59E0B',
  Antibiotic: '#EF4444',
  Antacid: '#3B82F6',
  Antiviral: '#8B5CF6',
  Antihistamine: '#EC4899',
  Antipyretic: '#F97316',
  Supplement: '#10B981',
  Default: '#00D4AA',
};

function getCategoryColor(category: string): string {
  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (category?.toLowerCase().includes(key.toLowerCase())) return CATEGORY_COLORS[key];
  }
  return CATEGORY_COLORS.Default;
}

function HistoryCard({
  medicine,
  scannedAt,
  id,
  onDelete,
}: {
  medicine: MedicineInfo;
  scannedAt: Date;
  id: string;
  onDelete: (id: string) => void;
}) {
  const color = getCategoryColor(medicine.category);
  const timeStr = new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(scannedAt));

  const confirmDelete = () => {
    Alert.alert('Remove Entry', 'Remove this scan from history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
    ]);
  };

  return (
    <View style={styles.historyCard}>
      <View style={[styles.categoryAccent, { backgroundColor: color }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.medicineNameRow}>
            <Text style={styles.medicineName} numberOfLines={1}>
              {medicine.name}
            </Text>
            {medicine.confidence === 'high' && (
              <Ionicons name="checkmark-circle" size={14} color="#00D4AA" />
            )}
          </View>
          <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <Text style={styles.genericName}>{medicine.genericName}</Text>

        <View style={styles.cardMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: `${color}18` }]}>
            <Text style={[styles.categoryText, { color }]}>{medicine.category}</Text>
          </View>
          {medicine.dosage !== 'Not visible' && (
            <View style={styles.dosageBadge}>
              <Ionicons name="flask-outline" size={11} color="#6B7280" />
              <Text style={styles.dosageText}>{medicine.dosage}</Text>
            </View>
          )}
        </View>

        {medicine.uses.length > 0 && (
          <Text style={styles.usesPreview} numberOfLines={1}>
            <Text style={styles.usesLabel}>Used for: </Text>
            {medicine.uses.slice(0, 2).join(' · ')}
          </Text>
        )}

        <Text style={styles.timeText}>
          <Ionicons name="time-outline" size={11} color="#6B7280" /> {timeStr}
        </Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { history, removeFromHistory, clearHistory } = useHistory();

  const confirmClear = () => {
    Alert.alert('Clear All History', 'This will remove all scan history. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0A0E1A', '#111827']} style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={confirmClear} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="time-outline" size={56} color="#374151" />
          </View>
          <Text style={styles.emptyTitle}>No Scans Yet</Text>
          <Text style={styles.emptySubtitle}>
            Medicines you scan will appear here for quick reference.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{history.length}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {history.filter(h => h.medicine.confidence === 'high').length}
              </Text>
              <Text style={styles.statLabel}>High Confidence</Text>
            </View>
          </View>

          <View style={styles.listSection}>
            {history.map((item) => (
              <HistoryCard
                key={item.id}
                medicine={item.medicine}
                scannedAt={item.scannedAt}
                id={item.id}
                onDelete={removeFromHistory}
              />
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  header: {
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  clearBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)',
  },
  clearBtnText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  scrollView: { flex: 1 },
  statsRow: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: 8 },
  statCard: {
    flex: 1, backgroundColor: '#111827',
    borderRadius: 16, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#1F2937',
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#00D4AA' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  listSection: { paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  historyCard: {
    backgroundColor: '#111827', borderRadius: 16, flexDirection: 'row',
    overflow: 'hidden', borderWidth: 1, borderColor: '#1F2937',
  },
  categoryAccent: { width: 4 },
  cardContent: { flex: 1, padding: 14 },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 2,
  },
  medicineNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  medicineName: { fontSize: 16, fontWeight: '700', color: '#F9FAFB', flex: 1 },
  deleteBtn: { padding: 4 },
  genericName: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  cardMeta: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  categoryText: { fontSize: 11, fontWeight: '700' },
  dosageBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#1F2937', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  dosageText: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  usesPreview: { fontSize: 12, color: '#9CA3AF', marginBottom: 6 },
  usesLabel: { color: '#6B7280', fontWeight: '600' },
  timeText: { fontSize: 11, color: '#6B7280' },
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40,
  },
  emptyIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#1F2937', marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
});
