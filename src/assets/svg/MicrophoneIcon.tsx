import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect, SvgProps } from "react-native-svg";
const MicrophoneIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 60 60"
    fill="none"
    {...props}
  >
    <G clipPath="url(#clip0_1316_9957)">
      <Path
        d="M42.5 27.5C42.5 34.4 36.9 40 30 40C23.1 40 17.5 34.4 17.5 27.5H12.5C12.5 36.325 19.025 43.575 27.5 44.8V52.5H32.5V44.8C40.975 43.575 47.5 36.325 47.5 27.5H42.5Z"
        fill="currentColor"
      />
      <Path
        d="M30 35C34.15 35 37.5 31.65 37.5 27.5V12.5C37.5 8.35 34.15 5 30 5C25.85 5 22.5 8.35 22.5 12.5V27.5C22.5 31.65 25.85 35 30 35ZM27.5 12.5C27.5 11.125 28.625 10 30 10C31.375 10 32.5 11.125 32.5 12.5V27.5C32.5 28.875 31.375 30 30 30C28.625 30 27.5 28.875 27.5 27.5V12.5Z"
        fill="currentColor"
      />
      <Path
        d="M30 35C34.15 35 37.5 31.65 37.5 27.5V12.5C37.5 8.35 34.15 5 30 5C25.85 5 22.5 8.35 22.5 12.5V27.5C22.5 31.65 25.85 35 30 35Z"
        fill="currentColor"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1316_9957">
        <Rect width={60} height={60} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default MicrophoneIcon;
