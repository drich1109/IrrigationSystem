import * as React from "react";
import Svg, { Path, G, Defs, ClipPath, Rect, SvgProps } from "react-native-svg";
const CrownIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 39 39"
    fill="none"
    {...props}
  >
    <Path
      d="M17.4929 1.16429C18.7341 0.444284 20.2659 0.444285 21.5071 1.16429L27.9338 4.89232L34.3756 8.59395C35.6198 9.30886 36.3857 10.6354 36.3827 12.0703L36.3675 19.5L36.3827 26.9297C36.3857 28.3646 35.6198 29.6911 34.3756 30.4061L27.9338 34.1077L21.5071 37.8357C20.2659 38.5557 18.7341 38.5557 17.4929 37.8357L11.0662 34.1077L4.62436 30.4061C3.38021 29.6911 2.61432 28.3646 2.61726 26.9297L2.6325 19.5L2.61726 12.0703C2.61432 10.6354 3.38021 9.30886 4.62436 8.59395L11.0662 4.89232L17.4929 1.16429Z"
      fill="#E1E1E2"
    />
    <G clipPath="url(#clip0_2103_4405)">
      <Path
        d="M19.5 14.625L22.75 19.5L26.8125 16.25L25.1875 24.375H13.8125L12.1875 16.25L16.25 19.5L19.5 14.625Z"
        fill="white"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_2103_4405">
        <Rect
          width={19.5}
          height={19.5}
          fill="white"
          transform="translate(9.75 9.75)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default CrownIcon;
