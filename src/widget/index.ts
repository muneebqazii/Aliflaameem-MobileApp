import { Platform } from "react-native";

// The widget library's native module only exists in real Android builds. Loading it in
// Expo Go throws, so everything goes through guarded requires and becomes a no-op there.

/** Registers the widget's headless task. Call once at startup, before the app registers. */
export function registerWidget() {
  if (Platform.OS !== "android") return;
  try {
    const { registerWidgetTaskHandler } = require("react-native-android-widget");
    const { widgetTaskHandler } = require("./taskHandler");
    registerWidgetTaskHandler(widgetTaskHandler);
  } catch {
    // Expo Go — no widget support.
  }
}

/** Redraws any prayer widgets on the home screen (e.g. after location or settings change). */
export function refreshPrayerWidget() {
  if (Platform.OS !== "android") return;
  try {
    const { requestWidgetUpdate } = require("react-native-android-widget");
    const { PRAYER_WIDGET_NAME, renderPrayerWidget } = require("./PrayerWidget");
    requestWidgetUpdate({ widgetName: PRAYER_WIDGET_NAME, renderWidget: renderPrayerWidget }).catch(() => {});
  } catch {
    // Expo Go — no widget support.
  }
}
