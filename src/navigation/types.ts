import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/** Screens inside the Home tab (the tab bar stays visible on all of them). */
export type HomeStackParamList = {
  Home: undefined;
  Videos: { categoryId: string };
  HijriCalendar: undefined;
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Qibla: undefined;
  PrayerTimes: undefined;
  About: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, "Home">;
export type VideosScreenProps = NativeStackScreenProps<HomeStackParamList, "Videos">;
export type QiblaScreenProps = BottomTabScreenProps<RootTabParamList, "Qibla">;
export type PrayerTimesScreenProps = BottomTabScreenProps<RootTabParamList, "PrayerTimes">;
export type AboutScreenProps = BottomTabScreenProps<RootTabParamList, "About">;
