import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform, StatusBar as RNStatusBar, TouchableOpacity, Alert } from 'react-native';
import { format, parseISO } from 'date-fns';
import { History, Info, Trash2 } from 'lucide-react-native';

import { COLORS, SPACING } from '../../src/constants/AppTheme';
import { Card } from '../../src/components/Card';
import * as Storage from '../../src/utils/storage';
import * as Prediction from '../../src/utils/prediction';
import { CustomModal } from '../../src/components/CustomModal';

export default function HistoryScreen() {
  const [history, setHistory] = useState<string[]>([]);
  const [avgCycle, setAvgCycle] = useState(28);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadHistory = async () => {
    const data = await Storage.getHistory();
    const cycle = await Storage.getCycleLength();
    setHistory(data);
    setAvgCycle(Prediction.calculateAverageCycleLength(data, cycle));
  };

  const deleteHistoryItem = (dateStr: string) => {
    setItemToDelete(dateStr);
    setIsDeleteModalVisible(true);
  };

  const performDelete = async () => {
    if (!itemToDelete) return;
    
    const updatedHistory = history.filter(item => item !== itemToDelete);
    setHistory(updatedHistory);
    await Storage.saveHistory(updatedHistory);
    
    if (updatedHistory.length > 0) {
        await Storage.saveLastPeriod(new Date(updatedHistory[0]));
    }
    
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
    loadHistory();
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const renderItem = ({ item, index }: { item: string, index: number }) => {
    let gap = null;
    if (index < history.length - 1) {
      gap = Prediction.getGap(item, history[index + 1]);
    }

    return (
      <View style={styles.historyItem}>
        <TouchableOpacity 
            style={styles.dateCircle}
            onLongPress={() => deleteHistoryItem(item)}
        >
            <History size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.historyContent}>
            <View>
                <Text style={styles.historyLabel}>START DATE</Text>
                <Text style={styles.historyDate}>{format(parseISO(item), 'MMM d, yyyy')}</Text>
            </View>
            {gap && (
                <View style={styles.rightContent}>
                    <View style={styles.gapContainer}>
                        <Text style={styles.gapLabel}>GAP</Text>
                        <Text style={styles.gapValue}>{gap} <Text style={styles.daysText}>days</Text></Text>
                    </View>
                    <View style={[
                        styles.statusBadge, 
                        { backgroundColor: Prediction.getCycleStatus(gap) === 'Irregular' ? '#FFF0F0' : '#F0FFF4' }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: Prediction.getCycleStatus(gap) === 'Irregular' ? '#FF4D4D' : '#22C55E' }
                        ]}>
                            {Prediction.getCycleStatus(gap).toUpperCase()}
                        </Text>
                    </View>
                </View>
            )}
        </View>
        <TouchableOpacity 
            onPress={() => deleteHistoryItem(item)} 
            style={styles.deleteBtn}
        >
            <Trash2 size={18} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cycle History</Text>
        <Card style={styles.statsCard}>
            <Text style={styles.statsLabel}>AVERAGE CYCLE LENGTH</Text>
            <Text style={styles.statsValue}>{avgCycle} <Text style={styles.statsUnit}>Days</Text></Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>CONSISTENT</Text>
            </View>
        </Card>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Info size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>No history found yet.</Text>
          </View>
        }
      />

      <CustomModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={performDelete}
        title="Delete Record?"
        message="Are you sure you want to remove this cycle entry? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        icon={Trash2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + 10 : SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  statsCard: {
    marginVertical: 0,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textLight,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
  },
  statsUnit: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'android' ? 100 : 40,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    backgroundColor: '#FFF',
    padding: SPACING.md,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dateCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  historyContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  gapContainer: {
    alignItems: 'flex-end',
  },
  gapLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  gapValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  daysText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
    fontSize: 16,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  }
});
