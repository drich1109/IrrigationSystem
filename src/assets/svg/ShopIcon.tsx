import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect, SvgProps } from "react-native-svg";

interface ShopIconProps extends SvgProps {
  isActive?: boolean; // Add the isActive prop
}

const ShopIcon: React.FC<ShopIconProps> = ({ isActive = false, ...props }) => {
  const strokeColor = isActive ? "#E8C58F" : "#000000";
  return (
    <Svg
    viewBox="0 0 15 14"
    fill="none"
    {...props}
  >
    <G clipPath="url(#clip0_1545_11621)">
      <Path
        d="M2 8.5V13C2 13.1326 2.05268 13.2598 2.14645 13.3536C2.24021 13.4473 2.36739 13.5 2.5 13.5H12.5C12.6326 13.5 12.7598 13.4473 12.8536 13.3536C12.9473 13.2598 13 13.1326 13 13V8.5"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 8.5V13.5"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 10H8.5"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 4L2.5 0.5H12.5L14 4H1Z"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.25 4V5C5.25 5.53043 5.03929 6.03914 4.66421 6.41421C4.28914 6.78929 3.78043 7 3.25 7H2.97C2.43957 7 1.93086 6.78929 1.55579 6.41421C1.18071 6.03914 0.97 5.53043 0.97 5V4"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.75 4V5C9.75 5.53043 9.53929 6.03914 9.16421 6.41421C8.78914 6.78929 8.28043 7 7.75 7H7.25C6.71957 7 6.21086 6.78929 5.83579 6.41421C5.46071 6.03914 5.25 5.53043 5.25 5V4"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 4V5C14 5.53043 13.7893 6.03914 13.4142 6.41421C13.0391 6.78929 12.5304 7 12 7H11.75C11.2196 7 10.7109 6.78929 10.3358 6.41421C9.96071 6.03914 9.75 5.53043 9.75 5V4"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1545_11621">
        <Rect width={14} height={14} fill="white" transform="translate(0.5)" />
      </ClipPath>
    </Defs>
  </Svg>
  );
};
export default ShopIcon;
