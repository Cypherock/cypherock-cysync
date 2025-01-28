import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const DogeIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={33}
    viewBox="0 0 33 33"
    fill="none"
    {...props}
  >
    <G fill="#C2A633" clipPath="url(#a)">
      <Path d="M16.387 10.546H14.1v4.507h3.596v1.887h-3.596v4.507h2.398c.616 0 5.058.07 5.051-5.244-.006-5.313-4.308-5.657-5.163-5.657Z" />
      <Path d="M16.002.002c-8.836 0-16 7.163-16 16s7.164 16 16 16c8.837 0 16-7.164 16-16 0-8.837-7.163-16-16-16Zm.63 24.642h-5.795V16.94H8.794v-1.887h2.042V7.35h4.974c1.176 0 8.969-.244 8.969 8.792 0 9.185-8.148 8.503-8.148 8.503Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.002.002h32v32h-32z" />
      </ClipPath>
    </Defs>
  </Svg>
);
