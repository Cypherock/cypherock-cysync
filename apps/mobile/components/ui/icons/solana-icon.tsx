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
export const SolanaIcon = (props: SvgProps) => (
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
          fill="url(#c)"
          d="M6.259 22.57c.192-.192.457-.305.738-.305h25.455c.465 0 .698.562.37.89l-5.03 5.03a1.044 1.044 0 0 1-.737.304H1.599a.521.521 0 0 1-.369-.89L6.26 22.57Z"
        />
        <Path
          fill="url(#d)"
          d="M6.259 3.795c.2-.192.465-.304.738-.304h25.455c.465 0 .698.561.37.89l-5.03 5.028a1.044 1.044 0 0 1-.737.305H1.599a.521.521 0 0 1-.369-.89L6.26 3.795Z"
        />
        <Path
          fill="url(#e)"
          d="M27.793 13.123a1.044 1.044 0 0 0-.738-.305H1.599a.521.521 0 0 0-.369.89l5.029 5.029c.192.192.457.305.738.305h25.455a.521.521 0 0 0 .37-.89l-5.03-5.03Z"
        />
      </G>
    </G>
    <Defs>
      <LinearGradient
        id="c"
        x1={30.02}
        x2={12.403}
        y1={0.487}
        y2={34.231}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00FFA3" />
        <Stop offset={1} stopColor="#DC1FFF" />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1={22.317}
        x2={4.7}
        y1={-3.535}
        y2={30.209}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00FFA3" />
        <Stop offset={1} stopColor="#DC1FFF" />
      </LinearGradient>
      <LinearGradient
        id="e"
        x1={26.144}
        x2={8.527}
        y1={-1.537}
        y2={32.207}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00FFA3" />
        <Stop offset={1} stopColor="#DC1FFF" />
      </LinearGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M.998.002h32v32h-32z" />
      </ClipPath>
      <ClipPath id="b">
        <Path fill="#fff" d="M.998 3.49h32v25.024h-32z" />
      </ClipPath>
    </Defs>
  </Svg>
);
