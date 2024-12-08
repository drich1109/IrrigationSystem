import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";
const UnitIcon = (props: SvgProps) => (
    <Svg
    viewBox="0 0 24 24"
    {...props}
  >
    <G fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={2}>
      <Path d="m4 8l8-4l8 4l-8 4z" />
      <Path strokeLinecap="round" d="m4 12l8 4l8-4M4 16l8 4l8-4" />
    </G>
  </Svg>
);
export default UnitIcon;
