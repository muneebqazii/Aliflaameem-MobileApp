import { StyleSheet, View } from "react-native";

import { youtubeEmbedUrl } from "../data/videos";

/** In-app YouTube player (web) — react-native-webview has no web support, so use a plain iframe. */
export function YouTubePlayer({ videoId }: { videoId: string }) {
  return (
    <View style={styles.container}>
      <iframe
        key={videoId}
        src={youtubeEmbedUrl(videoId)}
        title="YouTube video player"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{ border: 0, width: "100%", height: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" },
});
