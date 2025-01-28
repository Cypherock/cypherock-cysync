import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const NearIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={33}
    viewBox="0 0 33 33"
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#fff"
        d="m25.645 1.637-6.677 9.92c-.462.676.426 1.494 1.065.925l6.57-5.725c.178-.142.427-.035.427.214v17.884c0 .25-.32.356-.462.178L6.679 1.211C6.039.429 5.116 0 4.086 0h-.71C1.529.002.002 1.532.002 3.416V28.59a3.412 3.412 0 0 0 3.41 3.413 3.424 3.424 0 0 0 2.912-1.636L13 20.446c.462-.675-.426-1.493-1.066-.924l-6.57 5.689c-.178.142-.426.035-.426-.214V7.15c0-.25.32-.356.461-.178l19.89 23.822a3.337 3.337 0 0 0 2.592 1.209h.71a3.412 3.412 0 0 0 3.41-3.414V3.416a3.412 3.412 0 0 0-3.41-3.413 3.438 3.438 0 0 0-2.947 1.635Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.002.002h32v32h-32z" />
      </ClipPath>
    </Defs>
  </Svg>
);
