# NJ Jewellers — Chennai Gold & Silver Price App

## Overview

A mobile app for NJ Jewellers (Sowcarpet, Chennai) that displays daily gold and silver prices for Chennai. Built with Expo React Native for both Android and iOS.

**Client**: NJ Jewellers — Vishal Parekh (Director)
**Location**: 24 Carat Gold, F1 1st flr, 107, Kalathi Pillai Street, Sowcarpet, Chennai-600001
**Contact**: 9884561992 / 9884834567 / njjewellerschennai@gmail.com

## Design Direction

**Dark Luxury Minimal** — Deep dark tones (#0D0708 base) with gold (#D4AF37) accents and the NJ Jewellers maroon (#7B1F1F) woven subtly into gradients. The brand identity is ambient — users always know whose app they're in, but prices lead.

### Color System
- Background: `#0D0708` → `#110A0C` gradient
- Gold accent: `#D4AF37`
- Brand maroon: `#7B1F1F` (subtle, gradients only)
- Warm gold text: `#C4956A` (labels)
- Silver accent: `#C0C0C0`
- Positive change: `#5CB85C`
- Negative change: `#E74C3C`
- Text primary: `rgba(255,255,255,0.85)`
- Text secondary: `rgba(255,255,255,0.45)`
- Text tertiary: `rgba(255,255,255,0.3)`

### Typography
- Display/Brand: Playfair Display (serif, for "NJ Jewellers" branding)
- Body/Numbers: DM Sans (clean, modern, excellent for price figures)

## Screens & Layout

### Single-Screen App (ScrollView)

The app is a single scrollable screen. No tabs, no navigation complexity.

#### Header
- NJ logo mark (maroon rounded square with "NJ" in gold)
- "NJ JEWELLERS" text in Playfair Display, subtle gold tone
- Date badge (today's date, right-aligned, pill shape)

#### Hero Card — 22K Gold Per Gram
- Largest element on screen
- Label: "22K GOLD · PER GRAM"
- Price: ₹X,XXX.XX in large gold text (2.4rem equivalent)
- Change indicator: green/red pill showing ₹ change from yesterday
- Sub-text: "Chennai Rate · Updated 10:30 AM"

#### Secondary Rate Rows
- 24 Karat / gram — single row with dot indicator + price
- 22K Sovereign (8 grams) — single row with label + price

#### Silver Section
- Minimal divider with silver dot + "SILVER" label + horizontal line
- Two cards side by side: Per Gram | Per Kilogram

#### 7-Day Trend Sparkline
- Minimal SVG sparkline showing gold price trend
- Soft gold gradient fill beneath the line
- Current price dot highlighted at the end
- Period toggle: 7D (active) | 30D pills

#### Footer
- Subtle: ◆ Sowcarpet, Chennai ◆
- Ambient brand presence, not an ad

### About / Contact (Accessible via tap on logo or subtle "About" link)
- Business name, director name
- Phone numbers (tap to call)
- Email (tap to email)
- Address (tap to open Maps)
- Extracted from back_side.png business card data

## Data Source & Pricing

### API Strategy
- Use a **free metals API** to fetch XAU (gold) and XAG (silver) spot prices in USD
- Convert to INR using a free forex rate
- Apply standard Indian gold pricing formulas:
  - 24K per gram = (XAU spot in USD × USD/INR rate) / 31.1035 (troy oz to grams)
  - 22K per gram = 24K × (22/24)
  - 18K per gram = 24K × (18/24)
  - 22K sovereign = 22K per gram × 8
  - Silver per gram = (XAG spot in USD × USD/INR rate) / 31.1035
  - Silver per kg = Silver per gram × 1000

### Update Schedule
- Fetch once daily at **10:30 AM IST** (after Indian bullion markets open)
- Cache locally using AsyncStorage
- Show "Last updated" timestamp
- Manual pull-to-refresh available

### Fallback
- If API fails, show cached data with "Last updated X hours ago" warning
- Prices accurate to 2 decimal places (₹X,XXX.XX)

### Price History
- Store 30 days of prices locally in AsyncStorage
- Used to render the 7D/30D sparkline trend
- Calculate daily change (₹ and %) from yesterday's cached price

## Tech Stack

- **Framework**: Expo SDK (React Native) — supports both Android & iOS from single codebase
- **Navigation**: None needed (single screen), or minimal for About modal
- **State**: React useState + useEffect
- **Storage**: AsyncStorage for price cache & history
- **Charts**: react-native-svg for sparkline rendering
- **Fonts**: expo-font for Playfair Display + DM Sans
- **API**: fetch() with free metals API endpoint

## Branding Integration

The NJ Jewellers brand is present but never dominant:

1. **Logo mark** in header — small, refined, always visible
2. **Brand maroon** woven into card gradient backgrounds — felt, not seen
3. **Footer location** — ambient, establishes trust
4. **About section** — accessible on demand, contains full business details
5. **App icon** — uses the logo.png asset directly
6. **Splash screen** — logo centered on dark background, brief

## UX Principles

1. **Glanceable**: User opens app, sees today's price in < 1 second
2. **No friction**: No login, no onboarding, no popups
3. **Trust signals**: "Chennai Rate", update timestamp, price change indicator
4. **Offline capable**: Cached prices always available
5. **Pull to refresh**: Familiar gesture to manually update
6. **Tap interactions**: Phone numbers callable, address opens maps
