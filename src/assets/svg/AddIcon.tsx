import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const AddIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill="currentColor" d="M20 14h-6v6h-4v-6H4v-4h6V4h4v6h6z" />
  </Svg>
);
export default AddIcon;
