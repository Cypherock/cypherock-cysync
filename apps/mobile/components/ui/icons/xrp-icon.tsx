import * as React from 'react';
import Svg, { SvgProps, G, Path } from 'react-native-svg';
export const XrpIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={28}
    viewBox="0 0 32 28"
    fill="none"
    {...props}
  >
    <G fill="#fff" opacity={0.9}>
      <Path
        d="M26.888 1.952h4.447l-9.267 8.685a9.043 9.043 0 0 1-12.135 0L.665 1.952h4.447l7.023 6.566a5.685 5.685 0 0 0 7.688 0l7.065-6.566ZM5.07 26.056H.623l9.31-8.728a8.956 8.956 0 0 1 12.134 0l9.31 8.728H26.93l-7.065-6.65a5.685 5.685 0 0 0-7.689 0l-7.106 6.65Z"
        opacity={0.9}
      />
    </G>
  </Svg>
);
