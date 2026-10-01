import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ISLAMIC_EVENTS } from "../data/islamicEvents";
import { HIJRI_MONTHS, HIJRI_MONTHS_AR, addDays, hijriMonthDays, utcNoon, type HijriDay } from "../lib/hijri";
import { colors, serif } from "../theme/colors";

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime(); // Both are noon-UTC dates.
const eventsOn = (d: HijriDay) => ISLAMIC_EVENTS.filter((e) => e.month === d.hijri.month && e.day === d.hijri.day);

function gregorianRange(days: HijriDay[]): string {
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const fm = MONTHS[first.getUTCMonth()];
  const lm = MONTHS[last.getUTCMonth()];
  if (first.getUTCFullYear() !== last.getUTCFullYear()) {
    return `${fm} ${first.getUTCFullYear()} – ${lm} ${last.getUTCFullYear()}`;
  }
  return fm === lm ? `${fm} ${first.getUTCFullYear()}` : `${fm} – ${lm} ${first.getUTCFullYear()}`;
}

const formatGregorian = (d: Date) =>
  `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

export function HijriCalendarScreen() {
  const today = useMemo(() => utcNoon(new Date()), []);
  const [anchor, setAnchor] = useState(today);
  const [selected, setSelected] = useState(today);

  const days = useMemo(() => hijriMonthDays(anchor), [anchor]);
  const { month, year } = days[0].hijri;
  const leadingBlanks = days[0].date.getUTCDay();
  const selectedDay = days.find((d) => sameDay(d.date, selected)) ?? days[0];
  const monthEvents = days.flatMap((d) => eventsOn(d).map((e) => ({ ...e, date: d.date })));
  const showingToday = days.some((d) => sameDay(d.date, today));

  const goTo = (newAnchor: Date) => {
    setAnchor(newAnchor);
    setSelected(newAnchor);
  };

  return (
    <LinearGradient colors={[colors.bgTop, colors.bgMid, colors.bgBottom]} locations={[0, 0.55, 1]} style={styles.root}>
      <SafeAreaView style={styles.root} edges={["left", "right"]}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Month header */}
          <View style={styles.monthHeader}>
            <Pressable onPress={() => goTo(addDays(days[0].date, -1))} hitSlop={12} style={styles.arrow} accessibilityLabel="Previous month">
              <Ionicons name="chevron-back" size={26} color={colors.gold} />
            </Pressable>
            <View style={styles.monthTitle}>
              <Text style={styles.monthArabic}>{HIJRI_MONTHS_AR[month - 1]} {year}</Text>
              <Text style={styles.monthName}>{HIJRI_MONTHS[month - 1]} {year} AH</Text>
              <Text style={styles.monthGregorian}>{gregorianRange(days)}</Text>
            </View>
            <Pressable onPress={() => goTo(addDays(days[days.length - 1].date, 1))} hitSlop={12} style={styles.arrow} accessibilityLabel="Next month">
              <Ionicons name="chevron-forward" size={26} color={colors.gold} />
            </Pressable>
          </View>

          {!showingToday && (
            <Pressable onPress={() => goTo(today)} style={styles.todayButton}>
              <Ionicons name="today-outline" size={14} color={colors.gold} />
              <Text style={styles.todayButtonText}>Back to today</Text>
            </Pressable>
          )}

          {/* Grid */}
          <View style={styles.grid}>
            {WEEKDAYS_SHORT.map((w, i) => (
              <Text key={w} style={[styles.weekday, i === 5 && styles.friday]}>{w}</Text>
            ))}
            {Array.from({ length: leadingBlanks }, (_, i) => <View key={`blank-${i}`} style={styles.cell} />)}
            {days.map((d) => {
              const isToday = sameDay(d.date, today);
              const isSelected = sameDay(d.date, selectedDay.date);
              const hasEvent = eventsOn(d).length > 0;
              const gDay = d.date.getUTCDate();
              return (
                <Pressable key={d.date.getTime()} style={styles.cell} onPress={() => setSelected(d.date)}>
                  <View style={[styles.cellInner, isToday && styles.cellToday, isSelected && styles.cellSelected]}>
                    <Text style={[styles.hijriDay, isToday && styles.hijriDayToday]}>{d.hijri.day}</Text>
                    <Text style={styles.gregDay}>
                      {gDay === 1 || d.hijri.day === 1 ? `${gDay} ${MONTHS_SHORT[d.date.getUTCMonth()]}` : gDay}
                    </Text>
                    {hasEvent && <View style={styles.eventDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Selected day */}
          <View style={styles.dayCard}>
            <Text style={styles.dayHijri}>
              {selectedDay.hijri.day} {HIJRI_MONTHS[month - 1]} {year} AH
            </Text>
            <Text style={styles.dayArabic}>
              {selectedDay.hijri.day} {HIJRI_MONTHS_AR[month - 1]} {year} هـ
            </Text>
            <Text style={styles.dayGregorian}>{formatGregorian(selectedDay.date)}</Text>
            {eventsOn(selectedDay).map((e) => (
              <View key={e.name} style={styles.dayEvent}>
                <Ionicons name="star" size={14} color={colors.gold} />
                <Text style={styles.dayEventText}>{e.name}</Text>
              </View>
            ))}
            {sameDay(selectedDay.date, today) && <Text style={styles.todayTag}>Today</Text>}
          </View>

          {/* Events this month */}
          <Text style={styles.sectionTitle}>Events in {HIJRI_MONTHS[month - 1]}</Text>
          {monthEvents.length === 0 ? (
            <Text style={styles.noEvents}>No major events this month.</Text>
          ) : (
            monthEvents.map((e) => (
              <Pressable key={e.name} style={styles.eventRow} onPress={() => setSelected(e.date)}>
                <View style={styles.eventDate}>
                  <Text style={styles.eventDateDay}>{e.day}</Text>
                  <Text style={styles.eventDateMonth}>{HIJRI_MONTHS[e.month - 1].split(" ")[0]}</Text>
                </View>
                <View style={styles.eventText}>
                  <Text style={styles.eventName}>{e.name}</Text>
                  <Text style={styles.eventGregorian}>{formatGregorian(e.date)}</Text>
                </View>
              </Pressable>
            ))
          )}

          <Text style={styles.note}>
            Calculated dates — they may vary by a day depending on local moon sighting.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  monthHeader: { flexDirection: "row", alignItems: "center" },
  arrow: { padding: 8 },
  monthTitle: { flex: 1, alignItems: "center", gap: 2 },
  monthArabic: { color: colors.cream, fontSize: 22, writingDirection: "rtl" },
  monthName: { color: colors.gold, fontSize: 17, fontWeight: "700", fontFamily: serif },
  monthGregorian: { color: colors.mint, fontSize: 12, fontStyle: "italic", fontFamily: serif },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  todayButtonText: { color: colors.gold, fontSize: 12, fontFamily: serif },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    padding: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(15,74,34,0.4)",
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: "center",
    paddingVertical: 6,
    color: colors.mint,
    fontSize: 11,
    fontFamily: serif,
    textTransform: "uppercase",
  },
  friday: { color: colors.gold, fontWeight: "700" },
  cell: { width: `${100 / 7}%`, aspectRatio: 0.85, padding: 2 },
  cellInner: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  cellToday: { backgroundColor: "rgba(201,168,76,0.25)" },
  cellSelected: { borderWidth: 1.5, borderColor: "#c9a84c" },
  hijriDay: { color: colors.cream, fontSize: 17, fontWeight: "600", fontFamily: serif },
  hijriDayToday: { color: colors.gold },
  gregDay: { color: colors.mint, fontSize: 9, fontFamily: serif, marginTop: 1 },
  eventDot: { position: "absolute", bottom: 4, width: 5, height: 5, borderRadius: 3, backgroundColor: colors.gold },
  dayCard: {
    marginTop: 14,
    alignItems: "center",
    gap: 3,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#c9a84c",
    backgroundColor: "rgba(26,102,53,0.55)",
  },
  dayHijri: { color: colors.gold, fontSize: 18, fontWeight: "700", fontFamily: serif },
  dayArabic: { color: colors.cream, fontSize: 17, writingDirection: "rtl" },
  dayGregorian: { color: colors.mint, fontSize: 13, fontFamily: serif },
  dayEvent: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  dayEventText: { color: colors.cream, fontSize: 15, fontWeight: "600", fontFamily: serif },
  todayTag: { marginTop: 6, color: colors.gold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: serif },
  sectionTitle: { marginTop: 20, marginBottom: 8, color: colors.gold, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontFamily: serif },
  noEvents: { color: colors.mint, fontSize: 13, fontStyle: "italic", fontFamily: serif },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(15,74,34,0.45)",
  },
  eventDate: {
    width: 52,
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(201,168,76,0.18)",
  },
  eventDateDay: { color: colors.gold, fontSize: 18, fontWeight: "700", fontFamily: serif },
  eventDateMonth: { color: colors.mint, fontSize: 10, fontFamily: serif },
  eventText: { flex: 1, gap: 2 },
  eventName: { color: colors.cream, fontSize: 15, fontWeight: "600", fontFamily: serif },
  eventGregorian: { color: colors.mint, fontSize: 12, fontFamily: serif },
  note: { marginTop: 16, color: colors.mint, fontSize: 11, fontStyle: "italic", fontFamily: serif, textAlign: "center", opacity: 0.8 },
});
