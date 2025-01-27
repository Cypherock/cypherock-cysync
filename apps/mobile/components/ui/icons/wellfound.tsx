import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const WellfoundIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={9}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#fff"
        d="M3.104 8.408.677.59h2.26l1.43 5.621L5.924.591h2.265l1.556 5.621L11.176.591h2.259L10.98 8.408H8.576L7.058 2.763 5.51 8.408H3.104Z"
      />
      <Path
        fill="#EC2E3A"
        d="M16.009 8.5a1.314 1.314 0 1 0 0-2.628 1.314 1.314 0 0 0 0 2.628ZM16.009 3.128a1.314 1.314 0 1 0 0-2.628 1.314 1.314 0 0 0 0 2.628Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.678.5h16.645v8H.678z" />
      </ClipPath>
    </Defs>
  </Svg>
);
