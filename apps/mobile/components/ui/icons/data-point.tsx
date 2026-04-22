import * as React from 'react';
import Svg, {
  SvgProps,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '../themes/color.styled';
export const DataPointIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={11}
    viewBox="0 0 11 11"
    fill="none"
    {...props}
  >
    <Circle
      cx={5.5}
      cy={5.5}
      r={4.5}
      fill={colors.background.dark}
      stroke="url(#a)"
      strokeWidth={2}
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={0.021}
        x2={11.021}
        y1={5.5}
        y2={5.5}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor={colors.gradient.gold[0]} />
        <Stop offset={0.37} stopColor={colors.gradient.gold[1]} />
        <Stop offset={1} stopColor={colors.gradient.gold[2]} />
      </LinearGradient>
    </Defs>
  </Svg>
);
