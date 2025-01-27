import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const WalletIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={10}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.727 2.818H4.91"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        d="M11.454 4.181v-.308c-.02-.273-.254-.49-.549-.509H9.4c-.974 0-1.763.732-1.763 1.636 0 .903.79 1.636 1.762 1.636h1.42l.087-.001c.295-.018.53-.236.548-.509.002-.017.002-.266.002-.308"
      />
      <Path
        fill="#fff"
        d="M9.273 5.545a.545.545 0 1 0 0-1.09.545.545 0 0 0 0 1.09Z"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        d="M6.545.636c2.057 0 3.086 0 3.725.64.441.44.578 1.066.62 2.088m-5.98 6h1.635c2.057 0 3.086 0 3.725-.64.441-.44.578-1.067.62-2.088m-6.526-6c-1.699.006-2.6.06-3.18.64C.546 1.913.546 2.942.546 5c0 2.057 0 3.085.64 3.724.356.357.833.515 1.542.584"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h12v10H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
