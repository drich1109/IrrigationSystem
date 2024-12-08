import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const SearchIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 12 12"
    fill="none"
    {...props}
  >
    <Path
      d="M8.46342 8.52L10.2 10.2M5.69999 3.6C6.6941 3.6 7.49999 4.40589 7.49999 5.4M9.63999 5.72C9.63999 7.88496 7.88494 9.64 5.71999 9.64C3.55503 9.64 1.79999 7.88496 1.79999 5.72C1.79999 3.55505 3.55503 1.8 5.71999 1.8C7.88494 1.8 9.63999 3.55505 9.63999 5.72Z"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </Svg>
);
export default SearchIcon;
