import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, serif } from "../theme/colors";

const SEAL = require("../../assets/logo-seal-final.png");

/** Scroll distance over which the large header collapses into the compact bar. */
export const HEADER_COLLAPSE_START = 60;
export const HEADER_COLLAPSE_END = 200;

/** Large header at the top of the home screen; shrinks and fades as `scrollY` grows. */
export function Header({ scrollY }: { scrollY: Animated.Value }) {
  const opacity = scrollY.interpolate({
    inputRange: [0, HEADER_COLLAPSE_END],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const scale = scrollY.interpolate({
    inputRange: [-100, 0, HEADER_COLLAPSE_END],
    outputRange: [1.1, 1, 0.75], // Slight grow on pull-down overscroll (iOS).
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.header, { opacity, transform: [{ scale }] }]}>
      <Image source={SEAL} style={styles.logo} accessibilityLabel="Aliflaameem seal" />
      <View style={styles.text}>
        <Text style={styles.arabic}>اَلٓمّٓ . اَلٓف لَامّٓ مِیّٓم</Text>
        <Text style={styles.title}>A L I F L A A M E E M</Text>
        <Text style={styles.subtitle}>Islamic Knowledge Platform</Text>
      </View>
    </Animated.View>
  );
}

/** Sticky bar (small seal + name side by side) that fades in once the large header scrolls away. */
export function CompactHeader({ scrollY }: { scrollY: Animated.Value }) {
  const opacity = scrollY.interpolate({
    inputRange: [HEADER_COLLAPSE_START, HEADER_COLLAPSE_END],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const translateY = scrollY.interpolate({
    inputRange: [HEADER_COLLAPSE_START, HEADER_COLLAPSE_END],
    outputRange: [-12, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.compact, { opacity, transform: [{ translateY }] }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <LinearGradient colors={["#0b2614", "#071a0e"]} style={StyleSheet.absoluteFill} />
      <Image source={SEAL} style={styles.compactLogo} />
      <View style={styles.compactText}>
        <Text style={styles.compactArabic}>اَلٓمّٓ . اَلٓف لَامّٓ مِیّٓم</Text>
        <Text style={styles.compactTitle}>A L I F L A A M E E M</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  logo: { width: 120, height: 120, resizeMode: "contain" },
  text: { alignItems: "center", gap: 4 },
  arabic: {
    color: colors.cream,
    fontSize: 18,
    writingDirection: "rtl",
  },
  title: {
    color: colors.cream,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: serif,
    textAlign: "center",
  },
  subtitle: {
    fontStyle: "italic",
    letterSpacing: 6,
    fontSize: 13,
    color: colors.creamSoft,
    textTransform: "uppercase",
    fontFamily: serif,
    textAlign: "center",
  },
  compact: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(197,163,90,0.35)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  compactLogo: { width: 44, height: 44, resizeMode: "contain" },
  compactText: { gap: 1 },
  compactArabic: { color: colors.cream, fontSize: 13, writingDirection: "rtl", textAlign: "left" },
  compactTitle: { color: colors.gold, fontSize: 17, fontWeight: "700", fontFamily: serif },
});
