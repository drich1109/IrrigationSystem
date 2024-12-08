import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const HexagonIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="currentColor"
      d="M11.036 1.53a2 2 0 0 1 1.928 0l8 4.4A2 2 0 0 1 22 7.683v8.635a2 2 0 0 1-1.036 1.752l-8 4.4a2 2 0 0 1-1.928 0l-8-4.4A2 2 0 0 1 2 16.317V7.683A2 2 0 0 1 3.036 5.93z"
    />
  </Svg>
);
export default HexagonIcon;
