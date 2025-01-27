import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const XIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={11}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#E7E9EA"
        d="M9.122.625h1.654l-3.613 4.13 4.25 5.62H8.086L5.478 6.966l-2.983 3.409H.84l3.865-4.418L.627.625H4.04L6.397 3.74 9.122.625Zm-.58 8.76h.916L3.542 1.563h-.983l5.983 7.822Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h12v11H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
