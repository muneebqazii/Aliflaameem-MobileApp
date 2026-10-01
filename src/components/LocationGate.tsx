import type { ReactNode } from "react";
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { type Coords, useLocation } from "../hooks/useLocation";
import { colors, serif } from "../theme/colors";

interface Props {
  /** Why the screen needs the location, shown when permission is denied. */
  reason: string;
  children: (coords: Coords, place: string | undefined) => ReactNode;
}

/** Resolves the device location, showing loading / permission / error states until it's ready. */
export function LocationGate({ reason, children }: Props) {
  const { state, retry } = useLocation();

  if (state.status === "ready") return <>{children(state.coords, state.place)}</>;

  if (state.status === "loading") {
    return (
      <View style={styles.box}>
        <ActivityIndicator color={colors.gold} size="large" />
        <Text style={styles.body}>Finding your location…</Text>
      </View>
    );
  }

  const denied = state.status === "denied";
  return (
    <View style={styles.box}>
      <Ionicons name="location-outline" size={40} color={colors.gold} />
      <Text style={styles.heading}>{denied ? "Location permission needed" : "Couldn't get your location"}</Text>
      <Text style={styles.body}>{denied ? reason : state.message}</Text>
      <View style={styles.buttons}>
        <Pressable onPress={retry} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
        {denied && Platform.OS !== "web" && (
          <Pressable onPress={() => Linking.openSettings()} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Open settings</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: "center", gap: 12, paddingVertical: 48, paddingHorizontal: 16 },
  heading: { color: colors.gold, fontSize: 17, fontWeight: "600", fontFamily: serif, textAlign: "center" },
  body: { color: colors.mint, fontSize: 14, lineHeight: 20, fontFamily: serif, textAlign: "center" },
  buttons: { flexDirection: "row", gap: 12, marginTop: 8 },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#c9a84c",
    backgroundColor: "rgba(201,168,76,0.15)",
  },
  pressed: { backgroundColor: "rgba(201,168,76,0.35)" },
  buttonText: { color: colors.gold, fontSize: 14, fontWeight: "600", fontFamily: serif },
});
