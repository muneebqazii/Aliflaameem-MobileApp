import { FlexWidget, ImageWidget, TextWidget } from "react-native-android-widget";

import { formatHijri } from "../lib/hijri";
import {
  PRAYERS,
  computeTimes,
  formatTime,
  loadLocation,
  loadSettings,
  nextPrayer,
  prayerName,
} from "../lib/prayer";

export const PRAYER_WIDGET_NAME = "PrayerTimes";

const GOLD = "#d4af5a";
const CREAM = "#e8d5a3";
const MINT = "#74c69d";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const root = {
  height: "match_parent",
  width: "match_parent",
  padding: 14,
  borderRadius: 22,
  borderWidth: 1,
  borderColor: "#9a7d2a",
  backgroundGradient: { from: "#14532a", to: "#061410", orientation: "TL_BR" },
} as const;

/** Builds the widget from the location/settings the app last saved. */
export async function renderPrayerWidget() {
  const now = new Date();
  const [location, settings] = await Promise.all([loadLocation(), loadSettings()]);
  const hijri = formatHijri(now);

  if (!location) {
    return (
      <FlexWidget clickAction="OPEN_APP" style={{ ...root, justifyContent: "center", alignItems: "center", flexGap: 6 }}>
        <TextWidget text={hijri} style={{ color: GOLD, fontSize: 16, fontFamily: "serif", fontWeight: "700" }} />
        <TextWidget
          text="Open Prayer Times in the app to set your location"
          style={{ color: MINT, fontSize: 12, fontFamily: "serif", textAlign: "center" }}
        />
      </FlexWidget>
    );
  }

  const times = computeTimes(location, now, settings);
  const next = nextPrayer(times, now);
  const subtitle = `${WEEKDAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}${location.place ? ` · ${location.place}` : ""}`;

  return (
    <FlexWidget clickAction="OPEN_APP" accessibilityLabel="Aliflaameem prayer times" style={{ ...root, flexDirection: "column", justifyContent: "space-between" }}>
      {/* Hijri date */}
      <FlexWidget style={{ flexDirection: "row", alignItems: "center", width: "match_parent", flexGap: 10 }}>
        <ImageWidget image={require("../../assets/logo-seal-final.png")} imageWidth={34} imageHeight={34} />
        <FlexWidget style={{ flexDirection: "column", flex: 1 }}>
          <TextWidget text={hijri} maxLines={1} truncate="END" style={{ color: GOLD, fontSize: 15, fontFamily: "serif", fontWeight: "700" }} />
          <TextWidget text={subtitle} maxLines={1} truncate="END" style={{ color: MINT, fontSize: 11, fontFamily: "serif" }} />
        </FlexWidget>
      </FlexWidget>

      {/* Next prayer */}
      <FlexWidget style={{ flexDirection: "row", alignItems: "center", width: "match_parent", justifyContent: "space-between" }}>
        <FlexWidget style={{ flexDirection: "column" }}>
          <TextWidget text={next.isTomorrow ? "NEXT · TOMORROW" : "NEXT PRAYER"} style={{ color: MINT, fontSize: 10, letterSpacing: 0.15, fontFamily: "serif" }} />
          <TextWidget
            text={`${prayerName(next.key, next.isTomorrow ? times.tomorrow.date : now)}  ${PRAYERS.find((p) => p.key === next.key)!.arabic}`}
            style={{ color: CREAM, fontSize: 18, fontFamily: "serif", fontWeight: "700" }}
          />
        </FlexWidget>
        <TextWidget text={formatTime(next.time)} style={{ color: GOLD, fontSize: 24, fontFamily: "serif", fontWeight: "700" }} />
      </FlexWidget>

      {/* All five prayers */}
      <FlexWidget style={{ flexDirection: "row", width: "match_parent", justifyContent: "space-between" }}>
        {PRAYERS.filter((p) => p.key !== "sunrise").map((p) => {
          const active = p.key === next.key && !next.isTomorrow;
          const time = formatTime(times.today[p.key]).replace(" AM", "").replace(" PM", "");
          return (
            <FlexWidget
              key={p.key}
              style={{
                flexDirection: "column",
                alignItems: "center",
                paddingHorizontal: 6,
                paddingVertical: 3,
                borderRadius: 8,
                backgroundColor: active ? "rgba(212, 175, 90, 0.25)" : "rgba(0, 0, 0, 0)",
              }}
            >
              <TextWidget text={p.name} style={{ color: active ? "#ffffff" : MINT, fontSize: 10, fontFamily: "serif" }} />
              <TextWidget text={time} style={{ color: active ? GOLD : CREAM, fontSize: 12, fontFamily: "serif", fontWeight: "700" }} />
            </FlexWidget>
          );
        })}
      </FlexWidget>
    </FlexWidget>
  );
}
