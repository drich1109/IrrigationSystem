import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";
const EditIcon = (props: SvgProps) => (
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
      <Path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <Path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </G>
  </Svg>
);
export default EditIcon;
