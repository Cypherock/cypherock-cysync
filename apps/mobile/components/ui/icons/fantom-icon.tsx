import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const FantomIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={33}
    viewBox="0 0 33 33"
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#13B5EC"
        d="M16.002 32.002c8.837 0 16-7.164 16-16 0-8.837-7.164-16-16-16-8.837 0-16 7.163-16 16 0 8.836 7.163 16 16 16Z"
      />
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="m17.202 12.902 3.6-2.1v4.2l-3.6-2.1Zm3.6 9-4.8 2.8-4.8-2.8v-4.9l4.8 2.8 4.8-2.8v4.9Zm-9.6-11.1 3.6 2.1-3.6 2.1v-4.2Zm5.4 3.1 3.6 2.1-3.6 2.1v-4.2Zm-1.2 4.2-3.6-2.1 3.6-2.1v4.2Zm4.8-8.3-4.2 2.4-4.2-2.4 4.2-2.5 4.2 2.5Zm-10.2-.4v13.1l6 3.4 6-3.4v-13.1l-6-3.4-6 3.4Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.002.002h32v32h-32z" />
      </ClipPath>
    </Defs>
  </Svg>
);
