import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const QRIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <G
      stroke="#8B8682"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      clipPath="url(#a)"
    >
      <Path d="M3.966.728H1.543a.808.808 0 0 0-.808.807v2.423c0 .446.362.808.808.808h2.423a.808.808 0 0 0 .808-.808V1.535a.808.808 0 0 0-.808-.807ZM14.465.728h-2.423a.808.808 0 0 0-.807.807v2.423c0 .446.361.808.807.808h2.423a.808.808 0 0 0 .808-.808V1.535a.808.808 0 0 0-.808-.807ZM3.966 11.227H1.543a.808.808 0 0 0-.808.807v2.423c0 .446.362.808.808.808h2.423a.808.808 0 0 0 .808-.808v-2.423a.808.808 0 0 0-.808-.807ZM15.273 11.227H12.85a1.615 1.615 0 0 0-1.615 1.615v2.423m4.038 0v.008M8.004 3.958v2.423A1.615 1.615 0 0 1 6.39 7.996H3.966m-3.23 0h.007M8.004.728h.008m-.008 10.499v.008m3.23-3.239h.808m3.23 0v.008m-7.268 7.26v-.807" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
