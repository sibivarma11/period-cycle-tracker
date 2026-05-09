import { addDays, differenceInDays, parseISO } from 'date-fns';

/**
 * Calculates the next expected period date
 */
export const calculateNextDate = (lastDate: Date | null, cycleLength: number): Date | null => {
  if (!lastDate) return null;
  return addDays(new Date(lastDate), cycleLength);
};

/**
 * Calculates days remaining until the next period
 */
export const calculateDaysRemaining = (nextDate: Date | null): number => {
  if (!nextDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next = new Date(nextDate);
  next.setHours(0, 0, 0, 0);
  
  return differenceInDays(next, today);
};

/**
 * Calculates average cycle length from history
 */
export const calculateAverageCycleLength = (history: string[], defaultLength = 28): number => {
  if (history.length < 2) return defaultLength;

  let totalDays = 0;
  let count = 0;

  for (let i = 0; i < history.length - 1; i++) {
    const current = parseISO(history[i]);
    const previous = parseISO(history[i + 1]);
    const diff = differenceInDays(current, previous);
    
    // Simple filter for outlier cycles if needed, but per requirements we use all
    totalDays += diff;
    count++;
  }

  return count > 0 ? Math.round(totalDays / count) : defaultLength;
};

/**
 * Calculates the gap between two dates in days
 */
export const getGap = (dateStr1: string, dateStr2: string): number => {
  return differenceInDays(parseISO(dateStr1), parseISO(dateStr2));
};

/**
 * Determines if a cycle is normal or irregular based on user's 28-35 day rule
 */
export const getCycleStatus = (gap: number): 'Normal' | 'Irregular' => {
  if (gap < 28 || gap > 35) return 'Irregular';
  return 'Normal';
};

/**
 * Calculates variation between actual and predicted date
 */
export const calculateVariation = (actualDate: Date, expectedDate: Date | null): number => {
  if (!expectedDate) return 0;
  
  const actual = new Date(actualDate);
  actual.setHours(0, 0, 0, 0);
  
  const expected = new Date(expectedDate);
  expected.setHours(0, 0, 0, 0);
  
  return differenceInDays(actual, expected);
};
