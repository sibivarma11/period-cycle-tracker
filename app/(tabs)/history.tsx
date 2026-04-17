import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { format, parseISO } from 'date-fns';
import { History, Info } from 'lucide-react-native';

import { COLORS, SPACING } from '../../src/constants/AppTheme';
import { Card } from '../../src/components/Card';
import * as Storage from '../../src/utils/storage';
import * as Prediction from '../../src/utils/prediction';

export default function HistoryScreen() {
  const [history, setHistory] = useState<string[]>([]);
  const [avgCycle, setAvgCycle] = useState(28);

  const loadHistory = async () => {
    const data = await Storage.getHistory();
    const cycle = await Storage.getCycleLength();
    setHistory(data);
    setAvgCycle(Prediction.calculateAverageCycleLength(data, cycle));
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
        <View style={styles.dateCircle}>
            <History size={20} color={COLORS.primary} />
        </View>
        <View style={styles.historyContent}>
            <View>
                <Text style={styles.historyLabel}>START DATE</Text>
                <Text style={styles.historyDate}>{format(parseISO(item), 'MMM d, yyyy')}</Text>
            </View>
            {gap && (
                <View style={styles.gapContainer}>
                    <Text style={styles.gapLabel}>GAP</Text>
                    <Text style={styles.gapValue}>{gap} <Text style={styles.daysText}>days</Text></Text>
                </View>
            )}
        </View>
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
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
    fontSize: 16,
  }
});
