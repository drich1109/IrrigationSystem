import * as React from "react";
import Svg, { Defs, LinearGradient, Path, SvgProps, Stop } from "react-native-svg";

const SpeakerIcon2 = (props: SvgProps) => (
  <Svg
    viewBox="0 0 35 35" 
    fill="none"
    transform="translate(2, 2)" // Adjust these values to center the icon and shift it slightly
    {...props}
  >
    <Defs>
      <LinearGradient id="speakerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#6addd0" stopOpacity={1} />
        <Stop offset="100%" stopColor="#7fc188" stopOpacity={1} />
      </LinearGradient>
      <LinearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#7fc188" stopOpacity={1} />
        <Stop offset="100%" stopColor="#6addd0" stopOpacity={1} />
      </LinearGradient>
    </Defs>

    <Path
      d="M17.5 0C7.745 0 0 7.745 0 17.5S7.745 35 17.5 35 35 27.255 35 17.5 27.255 0 17.5 0z"
      fill="white"
    />

    <Path
      d="M21.4312 24.6377C20.9559 24.8599 20.644 25.3677 20.644 25.9153C20.644 26.3914 20.8668 26.8278 21.2381 27.0817C21.4534 27.2325 21.6985 27.3119 21.951 27.3119C22.1292 27.3119 22.3074 27.2722 22.4782 27.1928C27.0449 25.0345 30.0003 20.202 30.0003 14.8775C30.0003 9.55309 27.0449 4.72061 22.4782 2.56226C22.0772 2.37181 21.6094 2.41149 21.2455 2.66541C20.8742 2.92727 20.6515 3.3637 20.6515 3.83981C20.6515 4.38733 20.9559 4.88724 21.4386 5.11736C25.0549 6.83134 27.3939 10.664 27.3939 14.8775C27.3939 19.0911 25.0549 22.9237 21.4386 24.6377H21.4312Z"
      fill="url(#speakerGradient)"
    />
    <Path
      d="M24.7132 14.8934C24.7132 17.7342 23.0201 20.1465 20.6514 21.0431V8.74371C23.0201 9.64038 24.7132 12.0606 24.7132 14.9014V14.8934Z"
      fill="url(#waveGradient)"
    />
    <Path
      d="M16.1061 0.181885L6.41573 8.10905H1.8564C0.831668 8.10905 0 8.99778 0 10.0928V19.8927C0 20.9877 0.831668 21.8765 1.8564 21.8765H6.41573L16.1061 29.8036C16.6853 30.2797 17.5244 29.8354 17.5244 29.0577V0.943655C17.5244 0.158079 16.6853 -0.278353 16.1061 0.197753V0.181885Z"
      fill="url(#speakerGradient)"
    />
  </Svg>
);

export default SpeakerIcon2;
