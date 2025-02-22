import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
export const ChangePasswordIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    {...props}
  >
    <Path
      stroke="url(#b)"
      strokeWidth={0.818}
      d="M.545 6c0-2.058 0-3.086.64-3.725.639-.639 1.667-.64 3.724-.64h2.182c2.057 0 3.086 0 3.724.64.639.64.64 1.667.64 3.724 0 2.057 0 3.086-.64 3.725-.639.639-1.667.639-3.724.639H4.909c-2.057 0-3.086 0-3.724-.64C.546 9.085.545 8.057.545 6Z"
    />
    <Path fill="#272320" d="M6 0h6v6H6z" />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.03}
      d="M7.078 3h3.844m0 0-.766-.766m.766.766-.766.766"
    />
    <Path
      stroke="url(#b)"
      strokeLinecap="round"
      strokeWidth={0.536}
      d="M6 5.285v1.429m-.619-1.072 1.238.715m0-.715-1.238.715M3.12 5.285v1.429M2.5 5.642l1.237.715m0-.715L2.5 6.357m6.381-1.072v1.429m-.618-1.072 1.237.715m0-.715-1.238.715"
    />
    <Defs>
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
