import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  LAST_PERIOD: '@last_period',
  CYCLE_LENGTH: '@cycle_length',
  HISTORY: '@history',
  REMINDER_ENABLED: '@reminder_enabled',
};

export const saveLastPeriod = async (date: Date) => {
  try {
    await AsyncStorage.setItem(KEYS.LAST_PERIOD, date.toISOString());
  } catch (e) {
    console.error('Error saving last period', e);
  }
};

export const getLastPeriod = async (): Promise<Date | null> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.LAST_PERIOD);
    return value ? new Date(value) : null;
  } catch (e) {
    console.error('Error getting last period', e);
    return null;
  }
};

export const saveCycleLength = async (length: number) => {
  try {
    await AsyncStorage.setItem(KEYS.CYCLE_LENGTH, length.toString());
  } catch (e) {
    console.error('Error saving cycle length', e);
  }
};

export const getCycleLength = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.CYCLE_LENGTH);
    return value ? parseInt(value, 10) : 28;
  } catch (e) {
    console.error('Error getting cycle length', e);
    return 28;
  }
};

export const saveHistory = async (history: string[]) => {
  try {
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving history', e);
  }
};

export const getHistory = async (): Promise<string[]> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.HISTORY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('Error getting history', e);
    return [];
  }
};

export const saveReminderEnabled = async (enabled: boolean) => {
  try {
    await AsyncStorage.setItem(KEYS.REMINDER_ENABLED, JSON.stringify(enabled));
  } catch (e) {
    console.error('Error saving reminder status', e);
  }
};

export const getReminderEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.REMINDER_ENABLED);
    return value ? JSON.parse(value) : false;
  } catch (e) {
    console.error('Error getting reminder status', e);
    return false;
  }
};
