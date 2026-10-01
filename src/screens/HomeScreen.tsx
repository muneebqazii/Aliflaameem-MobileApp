import { useRef, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryCard } from "../components/CategoryCard";
import { ComingSoonModal } from "../components/ComingSoonModal";
import { EventsFooter } from "../components/EventsFooter";
import { CompactHeader, Header } from "../components/Header";
import { type Category, categories } from "../data/categories";
import { videosByCategory } from "../data/videos";
import type { HomeScreenProps } from "../navigation/types";
import { colors } from "../theme/colors";

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [comingSoon, setComingSoon] = useState<Category | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handlePress = (category: Category) => {
    if (videosByCategory[category.id]) {
      navigation.navigate("Videos", { categoryId: category.id });
    } else {
      setComingSoon(category);
    }
  };

  return (
    <LinearGradient
      colors={[colors.bgTop, colors.bgMid, colors.bgBottom]}
      locations={[0, 0.55, 1]}
      style={styles.root}
    >
      <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
        <CompactHeader scrollY={scrollY} />
        <Animated.ScrollView
          contentContainerStyle={styles.scroll}
          scrollEventThrottle={16}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        >
          <Header scrollY={scrollY} />

          {/* Center image — shown above the cards, like the web's narrow layout */}
          <View style={styles.centerCol}>
            <Image
              source={require("../../assets/center-art.jpeg")}
              style={styles.centerImg}
              accessibilityLabel="Aliflaameem calligraphy"
            />
          </View>

          <View style={styles.column}>
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} delay={i * 0.1} onPress={handlePress} />
            ))}
          </View>

          <EventsFooter onOpenCalendar={() => navigation.navigate("HijriCalendar")} />
        </Animated.ScrollView>
      </SafeAreaView>

      <ComingSoonModal category={comingSoon} onClose={() => setComingSoon(null)} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  centerCol: { alignItems: "center", paddingVertical: 16 },
  centerImg: { width: 160, height: 360, resizeMode: "contain" },
  column: { paddingHorizontal: 16, gap: 12, marginBottom: 32 },
});
