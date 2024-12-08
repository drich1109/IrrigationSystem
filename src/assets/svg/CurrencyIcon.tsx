import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";
const CurrencyIcon = (props:SvgProps) => (
  <Svg
    viewBox="0 0 14 14"
    {...props}
  >
    <G
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M7 13.5c3.5 0 6-1.238 6-3.994c0-2.995-1.5-4.992-4.5-6.49l1.18-1.518A.658.658 0 0 0 9.12.5H4.88a.66.66 0 0 0-.56.998L5.5 3.026C2.5 4.534 1 6.531 1 9.526C1 12.262 3.5 13.5 7 13.5" />
      <Path d="M8.383 6.806a1.08 1.08 0 0 0-1.022-.723h-.838a.967.967 0 0 0-.207 1.912l1.277.28a1.084 1.084 0 0 1-.232 2.142H6.64c-.472 0-.873-.302-1.022-.722M7 6.083V5m0 6.5v-1.083" />
    </G>
  </Svg>
);
export default CurrencyIcon;
