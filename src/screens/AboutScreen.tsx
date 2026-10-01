import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import appConfig from "../../app.json";
import { ScreenContainer } from "../components/ScreenContainer";
import { categories } from "../data/categories";
import { colors, serif } from "../theme/colors";

const YOUTUBE_CHANNEL = "https://www.youtube.com/@aliflaameem2007";

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }[] = [
  { icon: "play-circle-outline", title: "Video lectures", text: "Watch lectures and gatherings right in the app." },
  { icon: "time-outline", title: "Prayer times", text: "Daily salah times for your current location." },
  { icon: "compass-outline", title: "Qibla direction", text: "A live compass pointing towards the Kaaba." },
  { icon: "calendar-outline", title: "Islamic events", text: "Upcoming dates from the Hijri calendar." },
];

export function AboutScreen() {
  return (
    <ScreenContainer title="About" arabicTitle="عن ألف لام ميم">
      <View style={styles.hero}>
        <Image source={require("../../assets/logo-seal-final.png")} style={styles.logo} accessibilityLabel="Aliflaameem seal" />
        <Text style={styles.arabic}>اَلٓمّٓ . اَلٓف لَامّٓ مِیّٓم</Text>
        <Text style={styles.name}>A L I F L A A M E E M</Text>
        <Text style={styles.tagline}>Islamic Knowledge Platform</Text>
      </View>

      <Section title="Who we are">
        <Text style={styles.body}>
          Aliflaameem is an Islamic knowledge platform dedicated to sharing the light of the Quran, the Sunnah
          and the rich heritage of Islamic scholarship. Through lectures, Quran learning classes and coverage of
          mahafil at masajid and madaris, we aim to make authentic Islamic learning accessible to everyone,
          wherever they are.
        </Text>
      </Section>

      <Section title="What you'll find">
        <View style={styles.topics}>
          {categories.map((c) => (
            <View key={c.id} style={styles.topic}>
              <Text style={styles.topicIcon}>{c.icon}</Text>
              <Text style={styles.topicText}>{c.title}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="In this app">
        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.feature}>
              <Ionicons name={f.icon} size={24} color={colors.gold} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureBody}>{f.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </Section>

      <Pressable
        onPress={() => Linking.openURL(YOUTUBE_CHANNEL)}
        style={({ pressed }) => [styles.youtube, pressed && styles.pressed]}
        accessibilityRole="link"
      >
        <Ionicons name="logo-youtube" size={22} color="#fff" />
        <Text style={styles.youtubeText}>Subscribe on YouTube</Text>
      </Pressable>

      <Text style={styles.version}>Version {appConfig.expo.version}</Text>
    </ScreenContainer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: 4, paddingVertical: 8 },
  logo: { width: 110, height: 110, resizeMode: "contain", marginBottom: 6 },
  arabic: { color: colors.cream, fontSize: 18, writingDirection: "rtl" },
  name: { color: colors.cream, fontSize: 20, fontWeight: "700", fontFamily: serif },
  tagline: { color: colors.creamSoft, fontSize: 12, letterSpacing: 4, fontStyle: "italic", textTransform: "uppercase", fontFamily: serif },
  section: {
    marginTop: 16,
    padding: 16,
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(15,74,34,0.45)",
  },
  sectionTitle: { color: colors.gold, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontFamily: serif },
  body: { color: colors.cream, fontSize: 14, lineHeight: 22, fontFamily: serif },
  topics: { gap: 8 },
  topic: { flexDirection: "row", alignItems: "center", gap: 10 },
  topicIcon: { fontSize: 18, width: 26, textAlign: "center" },
  topicText: { color: colors.cream, fontSize: 14, fontFamily: serif, flex: 1 },
  features: { gap: 12 },
  feature: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureText: { flex: 1 },
  featureTitle: { color: colors.cream, fontSize: 14, fontWeight: "600", fontFamily: serif },
  featureBody: { color: colors.mint, fontSize: 12, fontFamily: serif },
  youtube: {
    marginTop: 20,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#c4302b",
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 24,
  },
  pressed: { opacity: 0.75 },
  youtubeText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  version: { marginTop: 16, color: colors.mint, fontSize: 11, textAlign: "center", fontFamily: serif, opacity: 0.7 },
});
