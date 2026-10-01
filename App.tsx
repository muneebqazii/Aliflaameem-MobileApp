import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DarkTheme, NavigationContainer, type Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { categories } from "./src/data/categories";
import type { HomeStackParamList, RootTabParamList } from "./src/navigation/types";
import { AboutScreen } from "./src/screens/AboutScreen";
import { HijriCalendarScreen } from "./src/screens/HijriCalendarScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { PrayerTimesScreen } from "./src/screens/PrayerTimesScreen";
import { QiblaScreen } from "./src/screens/QiblaScreen";
import { VideosScreen } from "./src/screens/VideosScreen";
import { colors } from "./src/theme/colors";

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const theme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.gold,
    background: colors.background,
    card: colors.bannerEnd,
    text: colors.gold,
    border: "rgba(197,163,90,0.3)",
  },
};

const TAB_ICONS: Record<keyof RootTabParamList, [focused: keyof typeof Ionicons.glyphMap, idle: keyof typeof Ionicons.glyphMap]> = {
  HomeTab: ["home", "home-outline"],
  Qibla: ["compass", "compass-outline"],
  PrayerTimes: ["time", "time-outline"],
  About: ["information-circle", "information-circle-outline"],
};

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bannerEnd },
        headerTintColor: colors.gold,
        headerTitleStyle: { fontFamily: "serif" },
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen
        name="Videos"
        component={VideosScreen}
        options={({ route }) => ({
          title: categories.find((c) => c.id === route.params.categoryId)?.title ?? "Videos",
        })}
      />
      <HomeStack.Screen name="HijriCalendar" component={HijriCalendarScreen} options={{ title: "Hijri Calendar" }} />
    </HomeStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={theme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.gold,
            tabBarInactiveTintColor: "rgba(116,198,157,0.75)",
            tabBarStyle: {
              backgroundColor: colors.footerBottom,
              borderTopColor: "rgba(197,163,90,0.35)",
              borderTopWidth: 1,
            },
            tabBarLabelStyle: { fontFamily: "serif", fontSize: 11 },
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
            ),
          })}
        >
          <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: "Home" }} />
          <Tab.Screen name="Qibla" component={QiblaScreen} options={{ title: "Qibla" }} />
          <Tab.Screen name="PrayerTimes" component={PrayerTimesScreen} options={{ title: "Prayer Times" }} />
          <Tab.Screen name="About" component={AboutScreen} options={{ title: "About" }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
