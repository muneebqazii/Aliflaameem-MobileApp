import { useState } from "react";
import { FlatList, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { YouTubePlayer } from "../components/YouTubePlayer";
import { CHANNEL_NAME, type Video, videosByCategory, youtubeThumbnailUrl, youtubeWatchUrl } from "../data/videos";
import type { VideosScreenProps } from "../navigation/types";
import { colors, serif } from "../theme/colors";

const openOnYouTube = (video: Video) => Linking.openURL(youtubeWatchUrl(video.id));

export function VideosScreen({ route }: VideosScreenProps) {
  const videos = videosByCategory[route.params.categoryId] ?? [];
  const [current, setCurrent] = useState<Video | undefined>(videos[0]);

  return (
    <LinearGradient colors={[colors.bgTop, colors.bgMid, colors.bgBottom]} locations={[0, 0.55, 1]} style={styles.root}>
      <SafeAreaView style={styles.root} edges={["left", "right"]}>
        {current && (
          <View style={styles.playerSection}>
            <YouTubePlayer videoId={current.id} />
            <View style={styles.nowPlaying}>
              <View style={styles.nowPlayingText}>
                <Text style={styles.nowPlayingTitle} numberOfLines={2}>{current.title}</Text>
                <Text style={styles.channel}>{CHANNEL_NAME}</Text>
              </View>
              <Pressable
                onPress={() => openOnYouTube(current)}
                style={({ pressed }) => [styles.youtubeButton, pressed && styles.pressed]}
                accessibilityRole="link"
                accessibilityLabel="Watch on YouTube"
              >
                <Ionicons name="logo-youtube" size={18} color="#fff" />
                <Text style={styles.youtubeButtonText}>YouTube</Text>
              </Pressable>
            </View>
          </View>
        )}

        <FlatList
          data={videos}
          keyExtractor={(v) => v.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No videos yet.</Text>}
          renderItem={({ item }) => {
            const active = item.id === current?.id;
            return (
              <Pressable
                onPress={() => setCurrent(item)}
                style={({ pressed }) => [styles.row, active && styles.rowActive, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Play ${item.title}`}
              >
                <View>
                  <Image source={{ uri: youtubeThumbnailUrl(item.id) }} style={styles.thumb} />
                  <View style={styles.thumbOverlay}>
                    <Ionicons name={active ? "volume-high" : "play"} size={20} color="#fff" />
                  </View>
                </View>
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, active && styles.rowTitleActive]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.channel}>{active ? "Now playing" : CHANNEL_NAME}</Text>
                </View>
                <Pressable
                  onPress={() => openOnYouTube(item)}
                  hitSlop={10}
                  style={({ pressed }) => [styles.rowYoutube, pressed && styles.pressed]}
                  accessibilityRole="link"
                  accessibilityLabel={`Open ${item.title} on YouTube`}
                >
                  <Ionicons name="logo-youtube" size={24} color="#ff3b30" />
                </Pressable>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  playerSection: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(197,163,90,0.3)",
  },
  nowPlaying: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nowPlayingText: { flex: 1, gap: 2 },
  nowPlayingTitle: { color: colors.gold, fontSize: 16, fontWeight: "600", fontFamily: serif },
  channel: { color: colors.mint, fontSize: 11, fontStyle: "italic", fontFamily: serif },
  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#c4302b",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  youtubeButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  list: { padding: 16, gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(15,74,34,0.45)",
  },
  rowActive: { borderColor: "#c9a84c", backgroundColor: "rgba(26,102,53,0.6)" },
  pressed: { opacity: 0.7 },
  thumb: { width: 112, height: 63, borderRadius: 8, backgroundColor: "#000" },
  thumbOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 8,
  },
  rowText: { flex: 1, gap: 4 },
  rowTitle: { color: colors.cream, fontSize: 14, fontFamily: serif },
  rowTitleActive: { color: colors.gold, fontWeight: "600" },
  rowYoutube: { padding: 4 },
  empty: { color: colors.cream, textAlign: "center", marginTop: 32, fontFamily: serif },
});
