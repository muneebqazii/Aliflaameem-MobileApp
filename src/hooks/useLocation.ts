import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

import { saveLocation } from "../lib/prayer";
import { refreshPrayerWidget } from "../widget";

export interface Coords {
  latitude: number;
  longitude: number;
}

export type LocationState =
  | { status: "loading" }
  | { status: "denied" }
  | { status: "error"; message: string }
  | { status: "ready"; coords: Coords; place?: string };

async function placeName({ latitude, longitude }: Coords): Promise<string | undefined> {
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (!address) return undefined;
    return [address.city ?? address.subregion ?? address.district, address.country].filter(Boolean).join(", ");
  } catch {
    return undefined; // Not available on every platform (e.g. web without an API key).
  }
}

/** Asks for foreground location permission and resolves the device's position. */
export function useLocation() {
  const [state, setState] = useState<LocationState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const update = (next: LocationState) => {
      if (!cancelled) setState(next);
    };

    (async () => {
      update({ status: "loading" });
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return update({ status: "denied" });

        // Show a cached fix immediately when there is one, then refine it.
        const last = await Location.getLastKnownPositionAsync().catch(() => null);
        if (last) update({ status: "ready", coords: last.coords });

        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        update({ status: "ready", coords: current.coords });
        const place = await placeName(current.coords);
        if (place) update({ status: "ready", coords: current.coords, place });

        // The home-screen widget can't ask for location itself, so it uses the last fix.
        const { latitude, longitude } = current.coords;
        await saveLocation({ latitude, longitude, place });
        refreshPrayerWidget();
      } catch (e) {
        // Keep a cached fix if we already have one.
        setState((prev) =>
          cancelled || prev.status === "ready"
            ? prev
            : { status: "error", message: e instanceof Error ? e.message : "Could not get your location." },
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { state, retry };
}
