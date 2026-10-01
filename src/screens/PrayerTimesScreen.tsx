import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Madhab } from "adhan";
import { Ionicons } from "@expo/vector-icons";

import { LocationGate } from "../components/LocationGate";
import { ScreenContainer } from "../components/ScreenContainer";
import type { Coords } from "../hooks/useLocation";
import { formatHijri } from "../lib/hijri";
import {
  DEFAULT_SETTINGS,
  METHODS,
  PRAYERS,
  type PrayerKey,
  type PrayerSettings,
  computeTimes,
  formatTime,
  loadSettings,
  nextPrayer,
  prayerName,
  saveSettings,
} from "../lib/prayer";
import { colors, serif } from "../theme/colors";
import { refreshPrayerWidget } from "../widget";

const PRAYER_ICONS: Record<PrayerKey, keyof typeof Ionicons.glyphMap> = {
  fajr: "cloudy-night-outline",
  sunrise: "sunny-outline",
  dhuhr: "sunny",
  asr: "partly-sunny-outline",
  maghrib: "cloudy-night",
  isha: "moon",
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}h ${m}m ${String(s).padStart(2, "0")}s` : `${m}m ${String(s).padStart(2, "0")}s`;
}

function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Method/Asr choice, saved on the device and shared with the home-screen widget. */
function usePrayerSettings(): [PrayerSettings, (patch: Partial<PrayerSettings>) => void] {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);
  const update = (patch: Partial<PrayerSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next).then(refreshPrayerWidget);
  };
  return [settings, update];
}

function Times({ coords, place }: { coords: Coords; place?: string }) {
  const [settings, updateSettings] = usePrayerSettings();
  const now = useNow();
  const dayKey = now.toDateString();

  const times = useMemo(
    () => computeTimes(coords, new Date(dayKey), settings),
    [coords.latitude, coords.longitude, settings, dayKey],
  );
  const next = nextPrayer(times, now);
  // After Isha the next prayer is tomorrow's, so nothing in today's list is highlighted.
  const highlighted = next.isTomorrow ? null : next.key;

  return (
    <View style={styles.content}>
      <View style={styles.dateBlock}>
        <Text style={styles.date}>
          {WEEKDAYS[now.getDay()]}, {now.getDate()} {MONTHS[now.getMonth()]} {now.getFullYear()}
        </Text>
        <Text style={styles.hijri}>{formatHijri(now)}</Text>
        <View style={styles.placeRow}>
          <Ionicons name="location" size={13} color={colors.mint} />
          <Text style={styles.place}>{place ?? `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`}</Text>
        </View>
      </View>

      <View style={styles.nextCard}>
        <Text style={styles.nextLabel}>Next prayer</Text>
        <Text style={styles.nextName}>
          {prayerName(next.key, next.isTomorrow ? times.tomorrow.date : now)} · {PRAYERS.find((p) => p.key === next.key)!.arabic}
        </Text>
        <Text style={styles.nextTime}>{formatTime(next.time)}</Text>
        <Text style={styles.countdown}>in {formatCountdown(next.time.getTime() - now.getTime())}</Text>
      </View>

      <View style={styles.list}>
        {PRAYERS.map((p) => {
          const active = p.key === highlighted;
          const name = prayerName(p.key, now);
          return (
            <View key={p.key} style={[styles.row, active && styles.rowActive, p.key === "sunrise" && styles.rowMuted]}>
              <Ionicons name={PRAYER_ICONS[p.key]} size={20} color={active ? "#fff" : colors.gold} />
              <Text style={[styles.rowName, active && styles.rowNameActive]}>{name}</Text>
              <Text style={styles.rowArabic}>{p.arabic}</Text>
              <Text style={[styles.rowTime, active && styles.rowNameActive]}>{formatTime(times.today[p.key])}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.settingsLabel}>Asr calculation</Text>
      <View style={styles.chips}>
        {([Madhab.Hanafi, Madhab.Shafi] as const).map((m) => (
          <Chip key={m} label={m === Madhab.Hanafi ? "Hanafi" : "Shafi'i / Maliki / Hanbali"} active={settings.madhab === m} onPress={() => updateSettings({ madhab: m })} />
        ))}
      </View>

      <Text style={styles.settingsLabel}>Calculation method</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
        {METHODS.map((m) => (
          <Chip key={m.key} label={m.label} active={settings.method === m.key} onPress={() => updateSettings({ method: m.key })} />
        ))}
      </ScrollView>

      <Text style={styles.note}>Times are calculated for your current location. Check with your local masjid for jama'at times.</Text>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.chipPressed]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function PrayerTimesScreen() {
  return (
    <ScreenContainer title="Prayer Times" arabicTitle="أوقات الصلاة">
      <LocationGate reason="Allow location access so the app can calculate prayer times for where you are.">
        {(coords, place) => <Times coords={coords} place={place} />}
      </LocationGate>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { gap: 14, paddingTop: 8 },
  dateBlock: { alignItems: "center", gap: 3 },
  date: { color: colors.cream, fontSize: 15, fontFamily: serif },
  hijri: { color: colors.gold, fontSize: 14, fontFamily: serif, fontStyle: "italic" },
  placeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  place: { color: colors.mint, fontSize: 12, fontFamily: serif },
  nextCard: {
    alignItems: "center",
    gap: 2,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#c9a84c",
    backgroundColor: "rgba(26,102,53,0.55)",
  },
  nextLabel: { color: colors.mint, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: serif },
  nextName: { color: colors.gold, fontSize: 22, fontWeight: "700", fontFamily: serif, marginTop: 4 },
  nextTime: { color: colors.cream, fontSize: 30, fontWeight: "700", fontFamily: serif },
  countdown: { color: colors.mintLight, fontSize: 14, fontFamily: serif },
  list: { gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(15,74,34,0.45)",
  },
  rowActive: { borderColor: "#c9a84c", backgroundColor: "rgba(26,102,53,0.85)" },
  rowMuted: { opacity: 0.7 },
  rowName: { flex: 1, color: colors.cream, fontSize: 16, fontFamily: serif },
  rowNameActive: { color: "#fff", fontWeight: "700" },
  rowArabic: { color: colors.mint, fontSize: 15, writingDirection: "rtl" },
  rowTime: { minWidth: 78, textAlign: "right", color: colors.gold, fontSize: 16, fontWeight: "600", fontFamily: serif },
  settingsLabel: { color: colors.mint, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: serif, marginTop: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chipsScroll: { flexDirection: "row", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  chipActive: { borderColor: "#c9a84c", backgroundColor: "rgba(201,168,76,0.2)" },
  chipPressed: { opacity: 0.7 },
  chipText: { color: colors.mint, fontSize: 13, fontFamily: serif },
  chipTextActive: { color: colors.gold, fontWeight: "600" },
  note: { color: colors.mint, fontSize: 11, fontStyle: "italic", fontFamily: serif, textAlign: "center", opacity: 0.8 },
});
