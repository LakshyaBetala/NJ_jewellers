/**
 * NJ Jewellers — Chennai Gold & Silver Prices
 *
 * Premium minimal dashboard.
 * Two-zone architecture: warm gold → cool silver.
 * Clear hierarchy: one hero price, secondary rates, then silver.
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
  Dimensions,
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

try { SplashScreen.preventAutoHideAsync(); } catch (e) {}

const { width: SCREEN_W } = Dimensions.get('window');

/* ── helpers ── */
function fmtPrice(v: number): string {
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtPriceShort(v: number): string {
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function fmtDate(): string {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtFullDate(): string {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── change badge component ── */
function ChangeBadge({ value, positive }: { value: number; positive: boolean }) {
  if (value === 0) return null;
  return (
    <View style={[s.changeBadge, { backgroundColor: positive ? 'rgba(92,184,92,0.1)' : 'rgba(231,76,60,0.1)' }]}>
      <Text style={[s.changeText, { color: positive ? '#5CB85C' : '#E74C3C' }]}>
        {positive ? '↑' : '↓'} ₹{Math.abs(value).toFixed(0)}
      </Text>
    </View>
  );
}

/* ── secondary rate row ── */
function RateRow({ label, sublabel, value, accent }: {
  label: string; sublabel?: string; value: string; accent: string;
}) {
  return (
    <View style={s.rateRow}>
      <View style={s.rateRowLeft}>
        <View style={[s.accentBar, { backgroundColor: accent }]} />
        <View>
          <Text style={s.rateLabel}>{label}</Text>
          {sublabel && <Text style={s.rateSublabel}>{sublabel}</Text>}
        </View>
      </View>
      <Text style={s.rateValue}>{value}</Text>
    </View>
  );
}

/* ════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════ */
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
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#0A0708' }} />;

  const gUp = (prices?.goldChange ?? 0) >= 0;
  const sUp = (prices?.silverChange ?? 0) >= 0;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0708" />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
            colors={[Colors.gold]}
            progressBackgroundColor="#110A0C"
          />
        }
      >
        {/* ════ HEADER ════ */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.headerBrand}
            onPress={() => setAboutVisible(true)}
            activeOpacity={0.7}
          >
            <View style={s.logoWrap}>
              <Image
                source={require('./assets/logo.png')}
                style={s.logoImg as ImageStyle}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={s.brandName}>NJ Jewellers</Text>
              <Text style={s.brandSub}>Sowcarpet, Chennai</Text>
            </View>
          </TouchableOpacity>
          <View style={s.headerRight}>
            <Text style={s.headerDate}>{fmtDate()}</Text>
          </View>
        </View>

        {/* ════ DATE LINE ════ */}
        <Text style={s.fullDate}>{fmtFullDate()}</Text>

        {loading && !prices ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={s.loadingText}>Fetching rates…</Text>
          </View>
        ) : prices ? (
          <>
            {/* ═══════════════════════════════
                GOLD ZONE — warm tones
               ═══════════════════════════════ */}
            <View style={s.sectionHeader}>
              <View style={s.sectionIcon}>
                <Text style={s.sectionEmoji}>✦</Text>
              </View>
              <Text style={s.sectionLabel}>Gold Rates</Text>
              <View style={s.sectionRule} />
              <ChangeBadge value={prices.goldChange} positive={gUp} />
            </View>

            {/* Hero: 22K — the rate that matters most */}
            <View style={s.heroCard}>
              <View style={s.heroInner}>
                <Text style={s.heroKarat}>22K</Text>
                <View style={s.heroPriceWrap}>
                  <Text style={s.heroPrice}>{fmtPrice(prices.gold22KPerGram)}</Text>
                  <Text style={s.heroUnit}>per gram</Text>
                </View>
              </View>
              <Text style={s.heroMeta}>
                Chennai Rate · {prices.lastUpdated}
              </Text>
            </View>

            {/* Secondary gold rates */}
            <View style={s.rateGroup}>
              <RateRow
                label="24 Karat"
                sublabel="per gram"
                value={fmtPrice(prices.gold24KPerGram)}
                accent={Colors.gold}
              />
              <RateRow
                label="22K Sovereign"
                sublabel="8 grams"
                value={fmtPriceShort(prices.gold22KSovereign)}
                accent={Colors.goldMuted}
              />
              <RateRow
                label="18 Karat"
                sublabel="per gram"
                value={fmtPrice(prices.gold18KPerGram)}
                accent="rgba(212,175,55,0.3)"
              />
            </View>

            {/* ═══════════════════════════════
                SILVER ZONE — cool tones
               ═══════════════════════════════ */}
            <View style={[s.sectionHeader, { marginTop: Spacing.xxl }]}>
              <View style={[s.sectionIcon, { backgroundColor: 'rgba(192,192,192,0.08)' }]}>
                <Text style={s.sectionEmoji}>◈</Text>
              </View>
              <Text style={[s.sectionLabel, { color: Colors.silver }]}>Silver Rates</Text>
              <View style={s.sectionRule} />
              <ChangeBadge value={prices.silverChange} positive={sUp} />
            </View>

            <View style={s.silverRow}>
              <View style={s.silverCard}>
                <Text style={s.silverCardLabel}>Per Gram</Text>
                <Text style={s.silverCardPrice}>{fmtPrice(prices.silverPerGram)}</Text>
              </View>
              <View style={s.silverDivider} />
              <View style={s.silverCard}>
                <Text style={s.silverCardLabel}>Per Kilogram</Text>
                <Text style={s.silverCardPrice}>{fmtPriceShort(prices.silverPerKg)}</Text>
              </View>
            </View>

            {/* ═══════════════════════════════
                TREND CHART
               ═══════════════════════════════ */}
            {history.length > 1 && (
              <View style={{ marginTop: Spacing.xxl }}>
                <SparklineChart history={history} />
              </View>
            )}

            {/* ═══════════════════════════════
                FOOTER
               ═══════════════════════════════ */}
            <View style={s.footer}>
              <View style={s.footerLine} />
              <Text style={s.footerText}>NJ Jewellers · Sowcarpet</Text>
              <View style={s.footerLine} />
            </View>
            <Text style={s.pullHint}>Pull down to refresh</Text>
          </>
        ) : error ? (
          <View style={s.errorWrap}>
            <Text style={s.errorTitle}>Unable to load prices</Text>
            <Text style={s.errorSub}>{error}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={onRefresh}>
              <Text style={s.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <AboutModal visible={aboutVisible} onClose={() => setAboutVisible(false)} />
    </View>
  );
}

/* ════════════════════════════════════════════════
   STYLES
   ════════════════════════════════════════════════ */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0708' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 48 : 58,
    paddingBottom: 50,
  },

  /* ── header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.maroon,
    overflow: 'hidden' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  logoImg: { width: 30, height: 30 },
  brandName: {
    fontFamily: Fonts.displaySemiBold,
    fontSize: 15,
    color: Colors.goldMuted,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.2)',
    marginTop: 1,
  },
  headerRight: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerDate: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },

  /* ── date ── */
  fullDate: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.15)',
    marginBottom: 28,
    marginLeft: 52,
  },

  /* ── section header ── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212,175,55,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionEmoji: {
    fontSize: 12,
    color: Colors.gold,
  },
  sectionLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.goldMuted,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  sectionRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  /* ── change badge ── */
  changeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
  },

  /* ── hero card ── */
  heroCard: {
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 16,
    marginBottom: 14,
    backgroundColor: 'rgba(123,31,31,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.08)',
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    marginBottom: 10,
  },
  heroKarat: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: 'rgba(212,175,55,0.2)',
    lineHeight: 32,
  },
  heroPriceWrap: {
    flex: 1,
  },
  heroPrice: {
    fontFamily: Fonts.bodyBold,
    fontSize: 36,
    color: Colors.gold,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  heroUnit: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: 'rgba(212,175,55,0.4)',
    marginTop: 2,
  },
  heroMeta: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.18)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.04)',
    paddingTop: 10,
  },

  /* ── rate rows ── */
  rateGroup: {
    gap: 6,
    marginBottom: 8,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rateRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accentBar: {
    width: 3,
    height: 28,
    borderRadius: 2,
  },
  rateLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  rateSublabel: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.2)',
    marginTop: 1,
  },
  rateValue: {
    fontFamily: Fonts.bodyBold,
    fontSize: 17,
    color: 'rgba(255,255,255,0.8)',
  },

  /* ── silver ── */
  silverRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(192,192,192,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.06)',
    overflow: 'hidden',
  },
  silverCard: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  silverDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(192,192,192,0.1)',
  },
  silverCardLabel: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: 'rgba(192,192,192,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  silverCardPrice: {
    fontFamily: Fonts.bodyBold,
    fontSize: 20,
    color: 'rgba(192,192,192,0.85)',
  },

  /* ── footer ── */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
  },
  footerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  footerText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: 'rgba(255,255,255,0.12)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  pullHint: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: 'rgba(255,255,255,0.08)',
    textAlign: 'center',
    marginTop: 12,
  },

  /* ── states ── */
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
  },
  loadingText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
    marginTop: 16,
  },
  errorWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  errorTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  errorSub: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  retryBtn: {
    backgroundColor: 'rgba(123,31,31,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(123,31,31,0.2)',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  retryText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.goldMuted,
  },
});
