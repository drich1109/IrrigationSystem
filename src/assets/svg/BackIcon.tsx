import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const BackIcon = (props: SvgProps) => (
  <Svg 
    viewBox="0 0 24 24" 
    {...props}>
    <Path
      fill="currentColor"
      d="M3.636 11.293a1 1 0 000 1.414l5.657 5.657a1 1 0 001.414-1.414L6.757 13H20a1 1 0 100-2H6.757l3.95-3.95a1 1 0 00-1.414-1.414z"
    />
  </Svg>
);
export default BackIcon;
