import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { Coordinates, Qibla } from "adhan";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";

import { LocationGate } from "../components/LocationGate";
import { ScreenContainer } from "../components/ScreenContainer";
import type { Coords } from "../hooks/useLocation";
import { colors, serif } from "../theme/colors";

const KAABA = { latitude: 21.4225, longitude: 39.8262 };
const DIAL = 300;
const C = DIAL / 2;
const ALIGNED_DEGREES = 5;

const COMPASS_POINTS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const compassPoint = (deg: number) => COMPASS_POINTS[Math.round(deg / 22.5) % 16];

/** Great-circle distance in km. */
function distanceKm(a: Coords, b: Coords): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Signed difference a − b in (−180, 180]. */
const angleDiff = (a: number, b: number) => ((a - b + 540) % 360) - 180;

interface Heading {
  degrees: number;
  accuracy: number;
}

/** Live compass heading, or null where the device has no compass (e.g. web). */
function useHeading(): Heading | null {
  const [heading, setHeading] = useState<Heading | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return;
    let cancelled = false;
    let sub: Location.LocationSubscription | undefined;

    Location.watchHeadingAsync((h) => {
      const degrees = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
      setHeading({ degrees, accuracy: h.accuracy });
    })
      .then((s) => (cancelled ? s.remove() : (sub = s)))
      .catch(() => setHeading(null));

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  return heading;
}

function Compass({ coords, place }: { coords: Coords; place?: string }) {
  const heading = useHeading();
  const qibla = Qibla(new Coordinates(coords.latitude, coords.longitude));
  const facing = heading?.degrees ?? 0; // No compass: draw the dial with North up.
  const offset = angleDiff(qibla, facing); // Where the Qibla is relative to the top of the phone.
  const aligned = heading !== null && Math.abs(offset) <= ALIGNED_DEGREES;

  // Kaaba marker position on the ring (screen coordinates, rotates with the dial).
  const markerRad = ((qibla - facing) * Math.PI) / 180;
  const markerR = C - 28;
  const marker = { left: C + markerR * Math.sin(markerRad) - 16, top: C - markerR * Math.cos(markerRad) - 16 };

  let instruction: string;
  if (heading === null) instruction = `Face ${Math.round(qibla)}° from North (${compassPoint(qibla)})`;
  else if (aligned) instruction = "You are facing the Qibla";
  else instruction = `Turn ${offset > 0 ? "right" : "left"} ${Math.round(Math.abs(offset))}°`;

  return (
    <View style={styles.content}>
      <Text style={[styles.instruction, aligned && styles.instructionAligned]}>{instruction}</Text>

      <View style={styles.dialWrap}>
        <Svg width={DIAL} height={DIAL}>
          {/* Fixed pointer showing which way the phone is facing */}
          <Path d={`M${C - 10},4 L${C + 10},4 L${C},22 Z`} fill={aligned ? "#7dffb0" : colors.gold} />

          <G transform={`rotate(${-facing} ${C} ${C})`}>
            <Circle cx={C} cy={C} r={C - 26} fill="rgba(8,46,20,0.85)" stroke="#c9a84c" strokeWidth={2} />
            <Circle cx={C} cy={C} r={C - 40} fill="none" stroke="#9a7d2a" strokeWidth={0.8} strokeDasharray="3 3" />
            {Array.from({ length: 72 }, (_, i) => {
              const major = i % 6 === 0;
              const r1 = C - 26;
              const r2 = r1 - (major ? 12 : 6);
              const a = (i * 5 * Math.PI) / 180;
              return (
                <Line
                  key={i}
                  x1={C + r1 * Math.sin(a)}
                  y1={C - r1 * Math.cos(a)}
                  x2={C + r2 * Math.sin(a)}
                  y2={C - r2 * Math.cos(a)}
                  stroke={major ? colors.gold : "rgba(212,175,90,0.5)"}
                  strokeWidth={major ? 2 : 1}
                />
              );
            })}
            {(["N", "E", "S", "W"] as const).map((label, i) => {
              const a = (i * 90 * Math.PI) / 180;
              const r = C - 58;
              return (
                <SvgText
                  key={label}
                  x={C + r * Math.sin(a)}
                  y={C - r * Math.cos(a) + 7}
                  fill={label === "N" ? "#ff6b5b" : colors.cream}
                  fontSize={20}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              );
            })}
            {/* Qibla needle */}
            <G transform={`rotate(${qibla} ${C} ${C})`}>
              <Path d={`M${C},${C - 92} L${C + 9},${C} L${C - 9},${C} Z`} fill={aligned ? "#7dffb0" : colors.gold} />
              <Path d={`M${C},${C + 60} L${C + 6},${C} L${C - 6},${C} Z`} fill="rgba(212,175,90,0.35)" />
            </G>
            <Circle cx={C} cy={C} r={8} fill="#072e12" stroke="#c9a84c" strokeWidth={2} />
          </G>
        </Svg>
        <Text style={[styles.kaaba, marker]}>🕋</Text>
      </View>

      {heading !== null && heading.accuracy < 2 && (
        <Text style={styles.calibrate}>Low compass accuracy — move your phone in a figure-8 to calibrate.</Text>
      )}
      {heading === null && (
        <Text style={styles.calibrate}>
          {Platform.OS === "web"
            ? "A live compass is only available in the mobile app."
            : "Compass not available on this device."}
        </Text>
      )}

      <View style={styles.cards}>
        <InfoCard label="Qibla direction" value={`${Math.round(qibla)}° ${compassPoint(qibla)}`} />
        <InfoCard label="Distance to Kaaba" value={`${Math.round(distanceKm(coords, KAABA)).toLocaleString()} km`} />
      </View>
      <Text style={styles.place}>
        {place ?? `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`}
      </Text>
      <Text style={styles.note}>Keep the phone flat and away from metal or magnets for best accuracy.</Text>
    </View>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

export function QiblaScreen() {
  return (
    <ScreenContainer title="Qibla Direction" arabicTitle="اتجاه القبلة">
      <LocationGate reason="Allow location access so the app can calculate the Qibla direction from where you are.">
        {(coords, place) => <Compass coords={coords} place={place} />}
      </LocationGate>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", gap: 14, paddingTop: 8 },
  instruction: { color: colors.cream, fontSize: 18, fontFamily: serif, fontWeight: "600", textAlign: "center" },
  instructionAligned: { color: "#7dffb0" },
  dialWrap: { width: DIAL, height: DIAL },
  kaaba: { position: "absolute", width: 32, height: 32, fontSize: 24, lineHeight: 32, textAlign: "center" },
  calibrate: { color: colors.mint, fontSize: 12, fontStyle: "italic", fontFamily: serif, textAlign: "center" },
  cards: { flexDirection: "row", gap: 12, alignSelf: "stretch" },
  card: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(15,74,34,0.45)",
  },
  cardLabel: { color: colors.mint, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontFamily: serif },
  cardValue: { color: colors.gold, fontSize: 18, fontWeight: "600", fontFamily: serif },
  place: { color: colors.cream, fontSize: 13, fontFamily: serif },
  note: { color: colors.mint, fontSize: 11, fontStyle: "italic", fontFamily: serif, textAlign: "center", opacity: 0.8 },
});
