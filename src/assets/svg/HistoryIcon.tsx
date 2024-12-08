import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const HistoryIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 39 30"
    fill="none"
    {...props}
  >
    <Path
      d="M20 0C11.7167 0 5 6.71667 5 15H0L6.48333 21.4833L6.6 21.7167L13.3333 15H8.33333C8.33333 8.55 13.55 3.33333 20 3.33333C26.45 3.33333 31.6667 8.55 31.6667 15C31.6667 21.45 26.45 26.6667 20 26.6667C16.7833 26.6667 13.8667 25.35 11.7667 23.2333L9.4 25.6C12.1167 28.3167 15.85 30 20 30C28.2833 30 35 23.2833 35 15C35 6.71667 28.2833 0 20 0ZM18.3333 8.33333V16.6667L25.4667 20.9L26.6667 18.8833L20.8333 15.4167V8.33333H18.3333Z"
      fill="currentColor"
    />
  </Svg>
);
export default HistoryIcon;
