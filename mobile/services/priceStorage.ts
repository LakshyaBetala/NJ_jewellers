/**
 * NJ Jewellers — Price Storage Service
 * AsyncStorage-based caching for price data and 30-day history
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PriceData } from './goldApi';

const KEYS = {
  LATEST_PRICES: '@nj_latest_prices',
  PRICE_HISTORY: '@nj_price_history',
  LAST_FETCH_TIME: '@nj_last_fetch_time',
};

const MAX_HISTORY_DAYS = 30;

/**
 * Save today's prices to cache
 */
export async function saveTodayPrices(prices: PriceData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LATEST_PRICES, JSON.stringify(prices));
    await AsyncStorage.setItem(KEYS.LAST_FETCH_TIME, Date.now().toString());

    // Also append to history
    const history = await getHistory();
    const existingIndex = history.findIndex((p) => p.date === prices.date);

    if (existingIndex >= 0) {
      history[existingIndex] = prices;
    } else {
      history.push(prices);
    }

    // Keep only last 30 days
    const trimmed = history.slice(-MAX_HISTORY_DAYS);
    await AsyncStorage.setItem(KEYS.PRICE_HISTORY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save prices:', error);
  }
}

/**
 * Get the latest cached prices
 */
export async function getLatestCached(): Promise<PriceData | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.LATEST_PRICES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to read cached prices:', error);
    return null;
  }
}

/**
 * Get price history (up to 30 days)
 */
export async function getHistory(): Promise<PriceData[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PRICE_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to read price history:', error);
    return [];
  }
}

/**
 * Save price history (used for initial sample data)
 */
export async function saveHistory(history: PriceData[]): Promise<void> {
  try {
    const trimmed = history.slice(-MAX_HISTORY_DAYS);
    await AsyncStorage.setItem(KEYS.PRICE_HISTORY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

/**
 * Check if cache is stale (older than 1 hour)
 */
export async function isCacheStale(): Promise<boolean> {
  try {
    const lastFetch = await AsyncStorage.getItem(KEYS.LAST_FETCH_TIME);
    if (!lastFetch) return true;

    const elapsed = Date.now() - parseInt(lastFetch, 10);
    const ONE_HOUR = 60 * 60 * 1000;
    return elapsed > ONE_HOUR;
  } catch {
    return true;
  }
}

/**
 * Get yesterday's prices from history (for change calculation)
 */
export async function getYesterdayPrices(): Promise<PriceData | null> {
  const history = await getHistory();
  if (history.length < 2) return null;
  return history[history.length - 2]; // second to last entry
}

/**
 * Clear all stored data
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      KEYS.LATEST_PRICES,
      KEYS.PRICE_HISTORY,
      KEYS.LAST_FETCH_TIME,
    ]);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}
