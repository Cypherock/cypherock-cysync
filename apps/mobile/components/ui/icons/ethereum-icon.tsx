import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const EthereumIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={33}
    viewBox="0 0 33 33"
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <G clipPath="url(#b)">
        <Path
          fill="#00A6FB"
          d="M6.84 15.967 16.998.002l10.158 15.965-10.158 5.798L6.84 15.967Z"
        />
        <Path fill="#0074B0" d="m16.998.002 10.158 15.965-10.158 5.798V.002Z" />
        <Path
          fill="#00A6FB"
          d="m6.84 18.138 10.158 5.807 10.158-5.807-10.158 13.785L6.84 18.138Z"
        />
        <Path
          fill="#0074B0"
          d="m16.998 23.945 10.158-5.807-10.158 13.785v-7.978ZM6.84 15.967l10.158-4.351 10.158 4.351-10.158 5.807L6.84 15.967Z"
        />
        <Path
          fill="#004264"
          d="m16.998 11.607 10.158 4.36-10.158 5.798V11.607Z"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.998.002h32v32h-32z" />
      </ClipPath>
      <ClipPath id="b">
        <Path fill="#fff" d="M6.84.002h20.316v32H6.84z" />
      </ClipPath>
    </Defs>
  </Svg>
);
