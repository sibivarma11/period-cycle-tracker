import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Calendar, Bell, Droplets } from 'lucide-react-native';

import { COLORS, SPACING } from '../../src/constants/AppTheme';
import { Card } from '../../src/components/Card';
import { ActionButton } from '../../src/components/ActionButton';
import * as Storage from '../../src/utils/storage';
import * as Prediction from '../../src/utils/prediction';
import { setupNotifications, scheduleReminder } from '../../src/hooks/useNotifications';

export default function HomeScreen() {
  const [lastPeriod, setLastPeriod] = useState<Date | null>(null);
  const [cycleLength, setCycleLength] = useState(28);
  const [history, setHistory] = useState<string[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [nextDate, setNextDate] = useState<Date | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const loadData = async () => {
    const loadedLastPeriod = await Storage.getLastPeriod();
    const loadedCycleLength = await Storage.getCycleLength();
    const loadedHistory = await Storage.getHistory();
    const loadedReminder = await Storage.getReminderEnabled();

    setLastPeriod(loadedLastPeriod);
    setHistory(loadedHistory);
    setReminderEnabled(loadedReminder);

    const avgLength = Prediction.calculateAverageCycleLength(loadedHistory, loadedCycleLength);
    setCycleLength(avgLength);
  };

  useEffect(() => {
    loadData();
    setupNotifications();
  }, []);

  useEffect(() => {
    if (lastPeriod) {
      const next = Prediction.calculateNextDate(lastPeriod, cycleLength);
      setNextDate(next);
      setDaysRemaining(Prediction.calculateDaysRemaining(next));
      
      if (reminderEnabled && next) {
        scheduleReminder(next);
      }
    }
  }, [lastPeriod, cycleLength, reminderEnabled]);

  const handleDateChange = async (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setLastPeriod(selectedDate);
      await Storage.saveLastPeriod(selectedDate);
      
      const dateStr = selectedDate.toISOString().split('T')[0];
      if (!history.includes(dateStr)) {
        const newHistory = [dateStr, ...history].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        setHistory(newHistory);
        await Storage.saveHistory(newHistory);
      }
      
      Alert.alert("Period Added", `Next cycle predicted based on ${format(selectedDate, 'MMM d, yyyy')}`);
    }
  };

  const markToday = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setLastPeriod(today);
    await Storage.saveLastPeriod(today);

    const dateStr = today.toISOString().split('T')[0];
    if (!history.includes(dateStr)) {
      const newHistory = [dateStr, ...history].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      setHistory(newHistory);
      await Storage.saveHistory(newHistory);
    }
    
    Alert.alert("Marked Today", "Your cycle has been updated to start today.");
  };

  const editCycleLength = () => {
      // In a real TS app we'd use a modal, but for simple/fast we stick to prompt if available
      // Alert.prompt is iOS only, we'll use a simple alert for generic
      if (Platform.OS === 'ios') {
          (Alert as any).prompt(
            "Cycle Length",
            "Enter your standard cycle length (days):",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "OK", 
                onPress: async (value: string) => {
                  const num = parseInt(value, 10);
                  if (!isNaN(num) && num > 0) {
                    setCycleLength(num);
                    await Storage.saveCycleLength(num);
                  }
                } 
              }
            ],
            "plain-text",
            cycleLength.toString()
          );
      } else {
          Alert.alert("Feature", "Automatic average calculation is used based on your history.");
      }
  };

  const toggleReminder = async () => {
    const newVal = !reminderEnabled;
    setReminderEnabled(newVal);
    await Storage.saveReminderEnabled(newVal);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Cycle Tracker</Text>
                <Text style={styles.subGreeting}>Listening to your body's rhythm.</Text>
            </View>
            <TouchableOpacity onPress={toggleReminder} style={[styles.iconButton, reminderEnabled && styles.iconActive]}>
                <Bell size={24} color={reminderEnabled ? COLORS.primary : COLORS.textLight} />
            </TouchableOpacity>
        </View>

        <Card style={styles.mainCard}>
          <Text style={styles.nextLabel}>YOUR NEXT CYCLE</Text>
          <Text style={styles.countdown}>{daysRemaining < 0 ? 0 : daysRemaining}</Text>
          <Text style={styles.remainingText}>Days remaining</Text>
          
          <View style={styles.progressBarBg}>
            <View 
                style={[
                    styles.progressBarFill, 
                    { width: `${Math.min(100, (1 - (daysRemaining / cycleLength)) * 100)}%` }
                ]} 
            />
          </View>
          
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>PHASE</Text>
              <Text style={styles.infoValue}>{daysRemaining > 14 ? 'Follicular' : 'Luteal'}</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.infoLabel}>CONCEPTION CHANCE</Text>
              <Text style={styles.infoValue}>{daysRemaining > 10 && daysRemaining < 16 ? 'High' : 'Medium'}</Text>
            </View>
          </View>
        </Card>

        <Card title="NEXT EXPECTED DATE">
           <View style={styles.row}>
              <Calendar size={20} color={COLORS.primary} />
              <Text style={styles.dateValue}>
                {nextDate ? format(nextDate, 'MMM d, yyyy') : 'No data yet'}
              </Text>
           </View>
        </Card>

        <Card title="CYCLE LENGTH">
            <View style={styles.rowBetween}>
                <View style={styles.row}>
                    <Text style={styles.cycleValue}>{cycleLength}</Text>
                    <Text style={styles.cycleUnit}> days (Avg)</Text>
                </View>
                <TouchableOpacity onPress={editCycleLength}>
                    <Text style={styles.editBtn}>Edit</Text>
                </TouchableOpacity>
            </View>
        </Card>

        <View style={styles.actions}>
            <ActionButton 
                onPress={markToday} 
                title="Mark as Period Started Today" 
                icon={Droplets} 
            />
            <ActionButton 
                onPress={() => setShowDatePicker(true)} 
                title="Add Last Period" 
                icon={Calendar} 
                secondary
            />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={lastPeriod || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  iconButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  mainCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  nextLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  countdown: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 80,
  },
  remainingText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  progressBarBg: {
    height: 12,
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  cycleValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  cycleUnit: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  editBtn: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  actions: {
    marginTop: SPACING.lg,
  }
});
