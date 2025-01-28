import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const LitecoinIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#fff"
        d="M12 22.701c5.91 0 10.701-4.791 10.701-10.701S17.911 1.299 12 1.299c-5.91 0-10.701 4.79-10.701 10.7 0 5.91 4.79 10.702 10.701 10.702Z"
      />
      <Path
        fill="#345D9D"
        d="M12 0a12 12 0 1 0 12 12A11.964 11.964 0 0 0 12.07 0H12Zm.203 12.407-1.249 4.213h6.683a.339.339 0 0 1 .348.325v.11l-.58 2.006a.433.433 0 0 1-.437.32H6.741l1.714-5.841-1.917.581.435-1.337 1.918-.58 2.412-8.194a.439.439 0 0 1 .435-.32h2.586a.337.337 0 0 1 .35.326v.11l-2.035 6.915 1.918-.581-.407 1.395-1.947.552Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
