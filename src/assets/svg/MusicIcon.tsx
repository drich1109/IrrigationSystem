import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";
const MusicIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
  >
    <G
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0" />
      <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m-4 0a5 5 0 0 1 5-5m0 10a5 5 0 0 0 5-5" />
    </G>
  </Svg>
);
export default MusicIcon;
