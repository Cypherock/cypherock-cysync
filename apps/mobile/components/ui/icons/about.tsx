import * as React from 'react';
import Svg, {
  SvgProps,
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';
export const AboutIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <G strokeWidth={1.091} clipPath="url(#a)">
      <Path
        stroke="url(#b)"
        d="M6 11.454A5.455 5.455 0 1 0 6 .544a5.455 5.455 0 0 0 0 10.91Z"
      />
      <Path stroke="url(#c)" strokeLinecap="round" d="M6 3.272h.005" />
      <Path
        stroke="url(#d)"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.91 5.454H6v2.727m-1.09 0h2.18"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={0.566}
        x2={11.475}
        y1={5.999}
        y2={5.999}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E9B873" />
        <Stop offset={0.37} stopColor="#FEDD8F" />
        <Stop offset={1} stopColor="#B78D51" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={6}
        x2={6.005}
        y1={3.772}
        y2={3.772}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E9B873" />
        <Stop offset={0.37} stopColor="#FEDD8F" />
        <Stop offset={1} stopColor="#B78D51" />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1={4.913}
        x2={7.095}
        y1={6.818}
        y2={6.818}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E9B873" />
        <Stop offset={0.37} stopColor="#FEDD8F" />
        <Stop offset={1} stopColor="#B78D51" />
      </LinearGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
