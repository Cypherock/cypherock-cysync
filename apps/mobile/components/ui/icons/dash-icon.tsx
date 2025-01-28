import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const DashIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={33}
    viewBox="0 0 33 33"
    fill="none"
    {...props}
  >
    <G fill="#008DE4" clipPath="url(#a)">
      <Path d="M20.96 3.013H9.31L8.346 8.41l10.514.013c5.18 0 6.707 1.882 6.663 4.998-.025 1.596-.717 4.301-1.016 5.18-.798 2.337-2.437 4.998-8.582 4.992l-10.222-.006-.963 5.404h11.624c4.101 0 5.84-.48 7.691-1.328 4.095-1.9 6.532-5.94 7.51-11.212 1.45-7.854-.358-13.438-10.604-13.438Z" />
      <Path d="M4.284 13.29c-3.054 0-3.49 1.989-3.777 3.192-.38 1.57-.505 2.212-.505 2.212h11.93c3.054 0 3.49-1.988 3.777-3.19.38-1.571.505-2.213.505-2.213H4.284Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.002.002h32v32h-32z" />
      </ClipPath>
    </Defs>
  </Svg>
);
