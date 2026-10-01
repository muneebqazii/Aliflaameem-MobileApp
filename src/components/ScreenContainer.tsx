import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, serif } from "../theme/colors";

interface Props {
  title: string;
  arabicTitle?: string;
  children: ReactNode;
}

/** Themed background + title header shared by the tab screens. */
export function ScreenContainer({ title, arabicTitle, children }: Props) {
  return (
    <LinearGradient colors={[colors.bgTop, colors.bgMid, colors.bgBottom]} locations={[0, 0.55, 1]} style={styles.root}>
      <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            {arabicTitle && <Text style={styles.arabic}>{arabicTitle}</Text>}
            <Text style={styles.title}>{title}</Text>
            <View style={styles.divider} />
          </View>
          {children}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 24 },
  header: { alignItems: "center", paddingTop: 16, paddingBottom: 8, gap: 4 },
  arabic: { color: colors.cream, fontSize: 20, writingDirection: "rtl" },
  title: {
    color: colors.gold,
    fontSize: 15,
    letterSpacing: 4,
    textTransform: "uppercase",
    fontFamily: serif,
  },
  divider: { width: 64, height: 1, marginTop: 8, backgroundColor: "rgba(197,163,90,0.5)" },
});
