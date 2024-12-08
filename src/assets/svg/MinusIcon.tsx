import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const MinusIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill="currentColor" d="M20 14H4v-4h16" />
  </Svg>
);
export default MinusIcon;
