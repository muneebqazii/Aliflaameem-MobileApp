import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import type { Category } from "../data/categories";
import { colors, serif } from "../theme/colors";
import { HexPattern } from "./HexPattern";
import { Medallion } from "./Medallion";

interface Props {
  /** Category to announce; the modal is hidden when null. */
  category: Category | null;
  onClose: () => void;
}

/** Shown for categories whose content hasn't been added yet. */
export function ComingSoonModal({ category, onClose }: Props) {
  return (
    <Modal visible={category !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close">
        {category && (
          // Inner Pressable swallows taps so only the backdrop closes the modal.
          <Pressable style={styles.card} onPress={() => {}} accessible={false}>
            <LinearGradient
              colors={[colors.bannerStart, colors.bannerMid, colors.bannerEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <HexPattern id="coming-soon" opacity={0.1} />
            <LinearGradient
              colors={["transparent", colors.goldLine, "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.goldLine}
            />

            <View style={styles.content}>
              <Medallion icon={category.icon} id={`coming-soon-${category.id}`} />
              <Text style={styles.category}>{category.title}</Text>

              <View style={styles.divider} />

              <Text style={styles.arabicTitle}>المحتوى قادم قريباً</Text>
              <Text style={styles.arabicBody}>نعمل على إعداد هذا القسم، ترقبوه قريباً إن شاء الله</Text>

              <Text style={styles.englishTitle}>Content Coming Soon</Text>
              <Text style={styles.englishBody}>
                We are preparing this section. Please check back soon, In shā’ Allāh.
              </Text>

              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>OK · حسناً</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(3,10,5,0.78)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#c9a84c",
    overflow: "hidden",
    shadowColor: "#c4a64c",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  goldLine: { position: "absolute", top: 0, left: 0, right: 0, height: 1 },
  content: { alignItems: "center", paddingHorizontal: 24, paddingTop: 24, paddingBottom: 22 },
  category: {
    marginTop: 10,
    color: colors.gold,
    fontSize: 17,
    fontWeight: "600",
    fontFamily: serif,
    textAlign: "center",
  },
  divider: {
    width: 64,
    height: 1,
    marginVertical: 16,
    backgroundColor: "rgba(197,163,90,0.5)",
  },
  arabicTitle: {
    color: colors.cream,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "rtl",
  },
  arabicBody: {
    marginTop: 6,
    color: colors.mintLight,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    writingDirection: "rtl",
  },
  englishTitle: {
    marginTop: 18,
    color: colors.gold,
    fontSize: 13,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontFamily: serif,
    textAlign: "center",
  },
  englishBody: {
    marginTop: 6,
    color: colors.mint,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: "italic",
    fontFamily: serif,
    textAlign: "center",
  },
  button: {
    marginTop: 22,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#c9a84c",
    backgroundColor: "rgba(201,168,76,0.15)",
  },
  buttonPressed: { backgroundColor: "rgba(201,168,76,0.35)" },
  buttonText: { color: colors.gold, fontSize: 14, fontWeight: "600", fontFamily: serif, letterSpacing: 1 },
});
