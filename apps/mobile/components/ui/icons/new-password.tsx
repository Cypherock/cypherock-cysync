import * as React from 'react';
import Svg, {
  SvgProps,
  G,
  Path,
  Defs,
  ClipPath,
  LinearGradient,
  Stop,
} from 'react-native-svg';
export const NewPasswordIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={10}
    viewBox="0 0 12 10"
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke="url(#b)"
        strokeWidth={0.818}
        d="M.545 5c0-2.058 0-3.086.64-3.725.639-.639 1.667-.64 3.724-.64h2.182c2.057 0 3.086 0 3.724.64.639.64.64 1.667.64 3.724 0 2.057 0 3.086-.64 3.725-.639.638-1.667.639-3.724.639H4.909c-2.057 0-3.086 0-3.724-.64C.546 8.085.545 7.057.545 5Z"
      />
      <Path fill="#272320" d="M7-1h6v6H7z" />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.031}
        d="M11.375 2H10m0 0H8.625M10 2V.625M10 2v1.375"
      />
      <Path
        stroke="url(#b)"
        strokeLinecap="round"
        strokeWidth={0.536}
        d="M6 4.285v1.429m-.619-1.072 1.238.715m0-.715-1.238.715M3.12 4.285v1.429M2.5 4.642l1.237.715m0-.715L2.5 5.357m6.381-1.072v1.429m-.618-1.072 1.237.715m0-.715-1.238.715"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .09h12V9.91H0z" />
      </ClipPath>
      <LinearGradient
        id="b"
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
