import { Linking, StyleSheet, View } from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";

import { youtubeEmbedUrl } from "../data/videos";

// YouTube rejects embeds with no referrer (player error 153), so the embed is
// hosted in an HTML page with an https base URL that acts as the referrer.
// Swap this for the website's real domain once it has one.
const EMBED_ORIGIN = "https://aliflaameem.com";

const buildHtml = (videoId: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body { margin: 0; height: 100%; background: #000; overflow: hidden; }
      iframe { border: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <iframe
      src="${youtubeEmbedUrl(videoId)}"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </body>
</html>`;

/** In-app YouTube player (native). See YouTubePlayer.web.tsx for the browser version. */
export function YouTubePlayer({ videoId }: { videoId: string }) {
  // Keep the player page and the embed in the WebView; anything else
  // (e.g. the "Watch on YouTube" logo) opens in the YouTube app or browser.
  const handleNavigation = (request: WebViewNavigation & { isTopFrame?: boolean }) => {
    const { url, isTopFrame } = request;
    if (isTopFrame === false || url === "about:blank" || url.startsWith(EMBED_ORIGIN)) return true;
    Linking.openURL(url);
    return false;
  };

  return (
    <View style={styles.container}>
      <WebView
        key={videoId}
        source={{ html: buildHtml(videoId), baseUrl: EMBED_ORIGIN }}
        style={styles.webview}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={handleNavigation}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000" },
  webview: { flex: 1, backgroundColor: "#000" },
});
