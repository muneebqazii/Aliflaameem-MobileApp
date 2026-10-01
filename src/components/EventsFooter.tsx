import { useEffect, useMemo, useState } from "react";
import { AppState, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { formatEventDate, getUpcomingEvents } from "../data/islamicEvents";
import { colors, serif } from "../theme/colors";
import { HexPattern } from "./HexPattern";

const todayKey = () => new Date().toDateString();

/** Current calendar day; updates when the app returns to the foreground on a new day. */
function useToday(): string {
  const [today, setToday] = useState(todayKey);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setToday(todayKey());
    });
    return () => sub.remove();
  }, []);
  return today;
}

/* ── Footer Events Bar ─────────────────────────────────────────── */
export function EventsFooter({ onOpenCalendar }: { onOpenCalendar?: () => void }) {
  const today = useToday();
  const events = useMemo(() => getUpcomingEvents(new Date(today)), [today]);

  return (
    <View style={styles.footer}>
      <LinearGradient colors={[colors.footerTop, colors.footerBottom]} style={StyleSheet.absoluteFill} />
      <HexPattern id="footer" opacity={0.08} />

      <View style={styles.inner}>
        <Text style={styles.label}>Upcoming Events</Text>
        <View style={styles.divider} />
        <View style={styles.events}>
          {events.map((event) => (
            <View key={event.name} style={styles.event}>
              <Text style={styles.date}>{formatEventDate(event.date)}</Text>
              <Text style={styles.name}>{event.name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>Dates may vary by a day depending on moon sighting</Text>
        {onOpenCalendar && (
          <Pressable
            onPress={onOpenCalendar}
            style={({ pressed }) => [styles.calendarButton, pressed && styles.calendarButtonPressed]}
            accessibilityRole="button"
          >
            <Ionicons name="calendar-outline" size={14} color={colors.gold} />
            <Text style={styles.calendarButtonText}>Hijri Calendar</Text>
            <Ionicons name="chevron-forward" size={13} color={colors.gold} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: "rgba(197,163,90,0.3)",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  inner: { alignItems: "center", gap: 12 },
  label: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: colors.goldMuted,
    fontFamily: serif,
  },
  // Horizontal on mobile since the bar stacks vertically.
  divider: { width: 48, height: 1, backgroundColor: "rgba(197,163,90,0.3)" },
  events: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 32,
    rowGap: 12,
  },
  event: { gap: 2, alignItems: "center" },
  date: { fontSize: 10, color: colors.goldMuted, letterSpacing: 1, fontFamily: serif },
  name: { fontSize: 13, color: colors.cream, fontFamily: serif, fontStyle: "italic" },
  note: { fontSize: 9, color: colors.mint, fontStyle: "italic", fontFamily: serif, opacity: 0.8 },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(201,168,76,0.1)",
  },
  calendarButtonPressed: { backgroundColor: "rgba(201,168,76,0.3)" },
  calendarButtonText: { color: colors.gold, fontSize: 12, letterSpacing: 1, fontFamily: serif },
});
