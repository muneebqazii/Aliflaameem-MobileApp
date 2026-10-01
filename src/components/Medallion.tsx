import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, G, Path, Polygon, RadialGradient, Stop } from "react-native-svg";

const STAR_PATH =
  "M0,-40 C5,-24 24,-5 40,0 C24,5 5,24 0,40 C-5,24 -24,5 -40,0 C-24,-5 -5,-24 0,-40 Z";

/* ── Medallion SVG — green theme ───────────────────────────────── */
export function Medallion({ icon, id, glow }: { icon: string; id: string; glow?: boolean }) {
  const mgId = `mg-${id}`;
  const ogId = `og-${id}`;
  return (
    <View style={[styles.wrap, glow && styles.glow]}>
      <Svg viewBox="0 0 88 88" width={80} height={80}>
        <Defs>
          {/* Green fill gradient */}
          <RadialGradient id={mgId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#1a6e32" />
            <Stop offset="100%" stopColor="#072e12" />
          </RadialGradient>
          {/* Gold star gradient */}
          <RadialGradient id={ogId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#e8c96e" />
            <Stop offset="100%" stopColor="#9a6f0a" />
          </RadialGradient>
        </Defs>
        <G transform="translate(44,44)">
          {/* 8-pointed gold star */}
          <Path d={STAR_PATH} fill={`url(#${ogId})`} />
          <Path d={STAR_PATH} fill={`url(#${ogId})`} transform="rotate(45)" />
          {/* Green fill */}
          <Circle r="27" fill={`url(#${mgId})`} />
          {/* Rings */}
          <Circle r="27" fill="none" stroke="#c9a84c" strokeWidth="1.4" />
          <Circle r="22" fill="none" stroke="#9a7d2a" strokeWidth="0.7" strokeDasharray="3 2" />
          {/* Decorative centre star */}
          <Polygon
            points="0,-14 2,-10 6,-10 3,-7 4,-3 0,-6 -4,-3 -3,-7 -6,-10 -2,-10"
            fill="#d4af5a"
            opacity={0.5}
          />
        </G>
      </Svg>
      {/* Emoji on top */}
      <View style={styles.iconWrap} pointerEvents="none">
        <Text style={styles.icon}>{icon}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 80,
    height: 80,
    zIndex: 2,
    shadowColor: "#000",
    shadowOpacity: 0.65,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  glow: {
    shadowColor: "#c4a64c",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  iconWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22, lineHeight: 28 },
});
