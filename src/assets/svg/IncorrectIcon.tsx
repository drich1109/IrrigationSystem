import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const IncorrectIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="currentColor"
      d="M8.8 6.4a1 1 0 1 0-1.6 1.2l3.3 4.4l-3.3 4.4a1 1 0 0 0 1.6 1.2l2.95-3.933L14.7 17.6a1 1 0 1 0 1.6-1.2L13 12l3.3-4.4a1 1 0 0 0-1.6-1.2l-2.95 3.933z"
    />
  </Svg>
);
export default IncorrectIcon;
