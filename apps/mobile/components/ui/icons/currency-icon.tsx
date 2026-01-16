import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
export const CurrencyIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 20 20"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M10.5 0a10 10 0 1 0 10 10 10.01 10.01 0 0 0-10-10Zm0 17.778A7.778 7.778 0 1 1 18.278 10a7.787 7.787 0 0 1-7.778 7.778Zm4.074-5.926a2.972 2.972 0 0 1-2.963 2.963v.37a1.111 1.111 0 0 1-2.222 0v-.37H8.278a1.111 1.111 0 0 1 0-2.222h3.333a.74.74 0 0 0 0-1.482H9.39a2.963 2.963 0 0 1 0-5.926v-.37a1.111 1.111 0 1 1 2.222 0v.37h1.111a1.111 1.111 0 0 1 0 2.222H9.39a.74.74 0 1 0 0 1.482h2.222a2.972 2.972 0 0 1 2.963 2.963Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={0.172}
        x2={11.871}
        y1={5.999}
        y2={5.999}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E9B873" />
        <Stop offset={0.37} stopColor="#FEDD8F" />
        <Stop offset={1} stopColor="#B78D51" />
      </LinearGradient>
    </Defs>
  </Svg>
);
