/**
 * NJ Jewellers — Sparkline Chart Component
 * Minimal SVG sparkline for 7-day / 30-day gold price trend
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { Colors, Fonts, FontSizes, BorderRadius, Spacing } from '../constants/theme';
import { PriceData } from '../services/goldApi';

interface SparklineChartProps {
  history: PriceData[];
}

export function SparklineChart({ history }: SparklineChartProps) {
  const [period, setPeriod] = useState<7 | 30>(7);

  const data = history.slice(-period);
  if (data.length < 2) return null;

  const prices = data.map((d) => d.gold22KPerGram);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  // SVG dimensions
  const width = 300;
  const height = 55;
  const padding = 4;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Generate points
  const points = prices.map((price, i) => ({
    x: padding + (i / (prices.length - 1)) * chartWidth,
    y: padding + chartHeight - ((price - minPrice) / range) * chartHeight,
  }));

  // Create smooth path using catmull-rom-like curves
  let linePath = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    linePath += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }

  // Area path (close to bottom)
  const areaPath = `${linePath} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  const lastPoint = points[points.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {period === 7 ? '7-Day' : '30-Day'} Trend
        </Text>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodPill, period === 7 && styles.periodPillActive]}
            onPress={() => setPeriod(7)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodText,
                period === 7 && styles.periodTextActive,
              ]}
            >
              7D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodPill, period === 30 && styles.periodPillActive]}
            onPress={() => setPeriod(30)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodText,
                period === 30 && styles.periodTextActive,
              ]}
            >
              30D
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg width="100%" height={60} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.gold} stopOpacity={0.15} />
              <Stop offset="1" stopColor={Colors.gold} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={areaPath} fill="url(#sparkGradient)" />
          <Path
            d={linePath}
            fill="none"
            stroke={Colors.gold}
            strokeWidth={1.5}
            strokeOpacity={0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={3}
            fill={Colors.gold}
          />
        </Svg>
      </View>

      {/* Price range labels */}
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>
          ₹{minPrice.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
        </Text>
        <Text style={styles.rangeText}>
          ₹{maxPrice.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.micro,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  periodToggle: {
    flexDirection: 'row',
    gap: 5,
  },
  periodPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  periodPillActive: {
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderColor: 'rgba(212,175,55,0.12)',
  },
  periodText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.nano,
    color: Colors.textTertiary,
  },
  periodTextActive: {
    color: Colors.gold,
  },
  chartContainer: {
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.015)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeText: {
    fontFamily: Fonts.body,
    fontSize: 8,
    color: 'rgba(255,255,255,0.15)',
  },
});
