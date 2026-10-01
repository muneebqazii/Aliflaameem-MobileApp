import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import type { Category } from "../data/categories";
import { colors, serif } from "../theme/colors";
import { HexPattern } from "./HexPattern";
import { Medallion } from "./Medallion";

interface Props {
  category: Category;
  delay: number;
  onPress?: (category: Category) => void;
}

// On mobile every card uses the web's left-column layout (medallion on the left).
export function CategoryCard({ category, delay, onPress }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  // Mirrors the web's IntersectionObserver fade/slide-in with a staggered delay.
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 550,
      delay: delay * 1000,
      useNativeDriver: true,
    }).start();
  }, [delay, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-28, 0],
  });

  return (
    <Animated.View style={{ opacity: progress, transform: [{ translateX }] }}>
      <Pressable
        onPress={() => onPress?.(category)}
        accessibilityRole="button"
        accessibilityLabel={category.title}
        accessibilityHint={category.description}
      >
        {({ pressed }) => (
          <View style={styles.row}>
            <View style={styles.medallion}>
              <Medallion icon={category.icon} id={category.id} glow={pressed} />
            </View>

            {/* Banner */}
            <View style={[styles.banner, pressed && styles.bannerPressed]}>
              <LinearGradient
                colors={[colors.bannerStart, colors.bannerMid, colors.bannerEnd]}
                start={{ x: 0, y: 0.4 }}
                end={{ x: 1, y: 0.6 }}
                style={StyleSheet.absoluteFill}
              />
              <HexPattern id={category.id} opacity={0.13} />
              <LinearGradient
                colors={["transparent", colors.goldLine, "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.goldLine}
              />
              <View style={styles.content}>
                <Text numberOfLines={1} style={[styles.title, pressed && styles.titlePressed]}>
                  {category.title}
                </Text>
                <Text numberOfLines={1} style={[styles.desc, pressed && styles.descPressed]}>
                  {category.description}
                </Text>
              </View>
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
  },
  medallion: { marginRight: -30, zIndex: 2 },
  banner: {
    flex: 1,
    height: 56,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.goldBorder,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  bannerPressed: { borderColor: "#c9a84c" },
  goldLine: { position: "absolute", top: 0, left: 0, right: 0, height: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
    // Extra 30 clears the overlapping medallion.
    paddingLeft: 22 + 30,
    paddingRight: 18,
  },
  title: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: serif,
    letterSpacing: 0.25,
    marginBottom: 2,
  },
  titlePressed: { color: "#fff" },
  desc: {
    color: colors.mint,
    fontSize: 11,
    fontStyle: "italic",
    fontFamily: serif,
  },
  descPressed: { color: colors.mintLight },
});
