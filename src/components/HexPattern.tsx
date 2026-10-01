import { StyleSheet } from "react-native";
import Svg, { Circle, Defs, Pattern, Polygon, Rect } from "react-native-svg";

/** Hexagon-and-dot lattice used behind the banners and footer. */
export function HexPattern({ id, opacity }: { id: string; opacity: number }) {
  const patternId = `hex-dot-${id}`;
  return (
    <Svg style={[StyleSheet.absoluteFill, { opacity }]} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <Pattern id={patternId} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <Polygon points="12,0 24,6 24,18 12,24 0,18 0,6" fill="none" stroke="#c5a35a" strokeWidth="0.5" />
          <Circle cx="12" cy="12" r="3" fill="none" stroke="#c5a35a" strokeWidth="0.4" />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </Svg>
  );
}
