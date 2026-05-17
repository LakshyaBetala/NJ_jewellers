/**
 * NJ Jewellers — useGoldPrices Hook
 * 
 * Price loading strategy:
 * 1. If API key configured → fetch live from GoldAPI.io
 * 2. If no API key → use verified reference rates
 * 3. Always cache results in AsyncStorage for offline access
 * 4. Auto-refresh when cache is stale (>6 hours old)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  PriceData,
  fetchLivePrices,
  getReferencePrices,
  generatePriceHistory,
  hasApiKey,
} from '../services/goldApi';
import {
  saveTodayPrices,
  getLatestCached,
  getHistory,
  saveHistory,
  isCacheStale,
  clearAllData,
} from '../services/priceStorage';

interface UseGoldPricesReturn {
  prices: PriceData | null;
  history: PriceData[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  isLive: boolean; // true if prices are from live API
  onRefresh: () => Promise<void>;
}

export function useGoldPrices(): UseGoldPricesReturn {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [history, setHistory] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const loadPrices = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      setError(null);

      // Check for stale/incorrect cached data
      const cached = await getLatestCached();
      const cachedIsInvalid = cached && cached.gold22KPerGram < 10000;
      if (cachedIsInvalid) await clearAllData();

      // Load or generate history
      let priceHistory = await getHistory();
      if (!priceHistory.length || cachedIsInvalid) {
        priceHistory = generatePriceHistory(30);
        await saveHistory(priceHistory);
      }

      // Determine yesterday's prices for change calculation
      const yesterday = priceHistory.length > 0
        ? priceHistory[priceHistory.length - 1]
        : null;

      let todayPrices: PriceData;

      if (hasApiKey()) {
        // LIVE MODE: Fetch from GoldAPI.io
        try {
          todayPrices = await fetchLivePrices(
            yesterday?.gold24KPerGram,
            yesterday?.silverPerGram
          );
          setIsLive(true);
        } catch (apiError) {
          console.warn('Live API failed, using cached/reference:', apiError);
          // Fallback to cached data or reference rates
          if (cached && !cachedIsInvalid) {
            todayPrices = cached;
            setIsLive(cached.source === 'live');
          } else {
            todayPrices = getReferencePrices(
              yesterday?.gold24KPerGram,
              yesterday?.silverPerGram
            );
            setIsLive(false);
          }
        }
      } else {
        // REFERENCE MODE: Use verified hardcoded rates
        if (cached && !cachedIsInvalid && !isRefresh) {
          todayPrices = cached;
        } else {
          todayPrices = getReferencePrices(
            yesterday?.gold24KPerGram,
            yesterday?.silverPerGram
          );
        }
        setIsLive(false);
      }

      // Cache today's prices
      await saveTodayPrices(todayPrices);
      priceHistory = await getHistory();

      setPrices(todayPrices);
      setHistory(priceHistory);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load prices';
      setError(message);

      // Last resort: try cached data
      const cachedPrices = await getLatestCached();
      if (cachedPrices) {
        setPrices(cachedPrices);
        setHistory(await getHistory());
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const onRefresh = useCallback(async () => {
    await loadPrices(true);
  }, [loadPrices]);

  return {
    prices,
    history,
    loading,
    error,
    refreshing,
    isLive,
    onRefresh,
  };
}
