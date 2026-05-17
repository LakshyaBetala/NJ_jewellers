/**
 * NJ Jewellers — Chennai Gold & Silver Prices
 * Main Application Screen
 *
 * Dark Luxury Minimal aesthetic with ambient brand presence.
 * Single scrollable screen showing today's gold/silver rates.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  ImageStyle,
} from 'react-native';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { Colors, Fonts, FontSizes, BorderRadius, Spacing } from './constants/theme';
import { useGoldPrices } from './hooks/useGoldPrices';
import { SparklineChart } from './components/SparklineChart';
import { AboutModal } from './components/AboutModal';

// Keep splash screen visible while fonts load
try {
  SplashScreen.preventAutoHideAsync();
} catch (e) {
  // Ignore on web
}

function formatPrice(value: number): string {
  return '₹' + value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return now.toLocaleDateString('en-IN', options);
}

function formatFullDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return now.toLocaleDateString('en-IN', options);
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const [aboutVisible, setAboutVisible] = useState(false);
  const { prices, history, loading, error, refreshing, isLive, onRefresh } = useGoldPrices();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }} />;
  }

  const isPositiveGold = (prices?.goldChange ?? 0) >= 0;
  const isPositiveSilver = (prices?.silverChange ?? 0) >= 0;

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
            colors={[Colors.gold]}
            progressBackgroundColor={Colors.bgSecondary}
          />
        }
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => setAboutVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.logoMark}>
              <Image
                source={require('./assets/logo.png')}
                style={styles.logoImage as ImageStyle}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandText}>NJ Jewellers</Text>
          </TouchableOpacity>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>
        </View>

        {/* Full date line */}
        <Text style={styles.fullDate}>{formatFullDate()}</Text>

        {loading && !prices ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.loadingText}>Loading prices...</Text>
          </View>
        ) : prices ? (
          <>
            {/* ===== HERO: 22K GOLD PER GRAM ===== */}
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <Text style={styles.heroLabel}>22K Gold · Per Gram</Text>
                <View
                  style={[
                    styles.changeBadge,
                    { backgroundColor: isPositiveGold ? Colors.positiveBg : Colors.negativeBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.changeText,
                      { color: isPositiveGold ? Colors.positive : Colors.negative },
                    ]}
                  >
                    {isPositiveGold ? '▲' : '▼'} ₹{Math.abs(prices.goldChange).toFixed(2)}
                  </Text>
                </View>
              </View>
              <Text style={styles.heroPrice}>
                {formatPrice(prices.gold22KPerGram)}
              </Text>
              <Text style={styles.heroUnit}>
                Chennai Rate · Updated {prices.lastUpdated}
              </Text>
            </View>

            {/* ===== 24K RATE ROW ===== */}
            <View style={styles.rateRow}>
              <View style={styles.rateRowLeft}>
                <View style={styles.goldDot} />
                <Text style={styles.rateLabel}>24 Karat / gram</Text>
              </View>
              <Text style={styles.rateValue}>{formatPrice(prices.gold24KPerGram)}</Text>
            </View>

            {/* ===== SOVEREIGN ROW ===== */}
            <View style={styles.rateRow}>
              <View style={styles.rateRowLeft}>
                <View style={styles.goldDot} />
                <View>
                  <Text style={styles.rateLabel}>22K Sovereign</Text>
                  <Text style={styles.rateSublabel}>8 grams</Text>
                </View>
              </View>
              <Text style={styles.rateValue}>{formatPrice(prices.gold22KSovereign)}</Text>
            </View>

            {/* ===== 18K ROW ===== */}
            <View style={[styles.rateRow, { marginBottom: Spacing.xl }]}>
              <View style={styles.rateRowLeft}>
                <View style={[styles.goldDot, { opacity: 0.4 }]} />
                <Text style={styles.rateLabel}>18 Karat / gram</Text>
              </View>
              <Text style={styles.rateValue}>{formatPrice(prices.gold18KPerGram)}</Text>
            </View>

            {/* ===== SILVER SECTION ===== */}
            <View style={styles.sectionDivider}>
              <View style={styles.silverDot} />
              <Text style={styles.sectionTitle}>Silver</Text>
              <View style={styles.sectionLine} />
              {prices.silverChange !== 0 && (
                <Text
                  style={[
                    styles.sectionChange,
                    { color: isPositiveSilver ? Colors.positive : Colors.negative },
                  ]}
                >
                  {isPositiveSilver ? '▲' : '▼'} ₹{Math.abs(prices.silverChange).toFixed(2)}
                </Text>
              )}
            </View>

            <View style={styles.silverGrid}>
              <View style={styles.silverCard}>
                <Text style={styles.silverCardLabel}>Per Gram</Text>
                <Text style={styles.silverCardValue}>
                  {formatPrice(prices.silverPerGram)}
                </Text>
              </View>
              <View style={styles.silverCard}>
                <Text style={styles.silverCardLabel}>Per Kilogram</Text>
                <Text style={styles.silverCardValue}>
                  {formatPrice(prices.silverPerKg)}
                </Text>
              </View>
            </View>

            {/* ===== SPARKLINE CHART ===== */}
            {history.length > 1 && (
              <SparklineChart history={history} />
            )}

            {/* ===== FOOTER ===== */}
            <View style={styles.footer}>
              <Text style={styles.footerDiamond}>◆</Text>
              <Text style={styles.footerText}>Sowcarpet, Chennai</Text>
              <Text style={styles.footerDiamond}>◆</Text>
            </View>

            {/* Pull to refresh hint */}
            <Text style={styles.refreshHint}>Pull down to refresh</Text>
          </>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load prices</Text>
            <Text style={styles.errorSubtext}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      {/* About Modal */}
      <AboutModal
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'android' ? 48 : 56,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.maroon,
    overflow: 'hidden' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    ...Platform.select({
      ios: {
        shadowColor: Colors.maroon,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  brandText: {
    fontFamily: Fonts.displaySemiBold,
    fontSize: 13,
    color: 'rgba(196,149,106,0.7)',
    letterSpacing: 1.5,
  },
  dateBadge: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSizes.micro,
    color: 'rgba(255,255,255,0.35)',
  },

  // Full date
  fullDate: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    color: 'rgba(255,255,255,0.2)',
    marginBottom: Spacing.xxl,
    marginLeft: 46,
  },

  // Hero card
  heroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(123,31,31,0.1)',
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heroLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.micro,
    color: Colors.goldMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  changeText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.micro,
  },
  heroPrice: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSizes.heroPrice,
    color: Colors.gold,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  heroUnit: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    color: Colors.textTertiary,
  },

  // Rate rows
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    marginBottom: Spacing.sm,
  },
  rateRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gold,
    opacity: 0.6,
  },
  rateLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  rateSublabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.nano,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  rateValue: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSizes.sectionPrice,
    color: Colors.textPrimary,
  },

  // Silver section
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  silverDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.silver,
  },
  sectionTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.micro,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  sectionChange: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.nano,
  },
  silverGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  silverCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  silverCardLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.nano,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  silverCardValue: {
    fontFamily: Fonts.bodyBold,
    fontSize: FontSizes.sectionPrice,
    color: Colors.silverMuted,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  footerDiamond: {
    fontSize: 6,
    color: 'rgba(123,31,31,0.5)',
  },
  footerText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.nano,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  refreshHint: {
    fontFamily: Fonts.body,
    fontSize: 8,
    color: 'rgba(255,255,255,0.1)',
    textAlign: 'center',
    marginTop: Spacing.lg,
  },

  // Loading state
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textTertiary,
    marginTop: Spacing.md,
  },

  // Error state
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  errorText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.bodyLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  errorSubtext: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.maroonSubtle,
    borderWidth: 1,
    borderColor: 'rgba(123,31,31,0.25)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  retryText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.body,
    color: Colors.goldMuted,
  },
});
