/**
 * NJ Jewellers — Sparkline Chart
 * Minimal SVG sparkline for gold price trend
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { Colors, Fonts, FontSizes, Spacing } from '../constants/theme';
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

  const width = 300;
  const height = 50;
  const pad = 4;
  const cw = width - pad * 2;
  const ch = height - pad * 2;

  const pts = prices.map((p, i) => ({
    x: pad + (i / (prices.length - 1)) * cw,
    y: pad + ch - ((p - minPrice) / range) * ch,
  }));

  let line = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1].x + pts[i].x) / 2;
    line += ` C${cpx},${pts[i - 1].y} ${cpx},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  const area = `${line} L${pts[pts.length - 1].x},${height} L${pts[0].x},${height} Z`;
  const last = pts[pts.length - 1];

  return (
    <View style={s.wrap}>
      {/* Header */}
      <View style={s.head}>
        <Text style={s.title}>22K Gold Trend</Text>
        <View style={s.pills}>
          {([7, 30] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[s.pill, period === p && s.pillOn]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.7}
            >
              <Text style={[s.pillText, period === p && s.pillTextOn]}>
                {p}D
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chart */}
      <View style={s.chart}>
        <Svg
          width="100%"
          height={54}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.gold} stopOpacity={0.12} />
              <Stop offset="1" stopColor={Colors.gold} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={area} fill="url(#sg)" />
          <Path
            d={line}
            fill="none"
            stroke={Colors.gold}
            strokeWidth={1.5}
            strokeOpacity={0.45}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={last.x} cy={last.y} r={3} fill={Colors.gold} />
        </Svg>
      </View>

      {/* Range */}
      <View style={s.range}>
        <Text style={s.rangeText}>
          ₹{minPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </Text>
        <Text style={s.rangeText}>
          ₹{maxPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {},
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  pills: { flexDirection: 'row', gap: 4 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  pillOn: {
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  pillText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.2)',
  },
  pillTextOn: { color: Colors.gold },
  chart: {
    height: 54,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.015)',
    overflow: 'hidden',
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  rangeText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: 'rgba(255,255,255,0.1)',
  },
});
