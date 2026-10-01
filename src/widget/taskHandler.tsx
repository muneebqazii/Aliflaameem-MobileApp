import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { PRAYER_WIDGET_NAME, renderPrayerWidget } from "./PrayerWidget";

/** Runs headless when Android adds, resizes or periodically refreshes the widget. */
export async function widgetTaskHandler({ widgetInfo, widgetAction, renderWidget }: WidgetTaskHandlerProps) {
  if (widgetInfo.widgetName !== PRAYER_WIDGET_NAME) return;
  if (widgetAction === "WIDGET_ADDED" || widgetAction === "WIDGET_UPDATE" || widgetAction === "WIDGET_RESIZED") {
    renderWidget(await renderPrayerWidget());
  }
}
