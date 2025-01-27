import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';
export const TelegramIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={11}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#1C94D0"
        d="m12.695 1.401-1.76 8.302c-.133.586-.48.732-.971.456L7.28 8.182 5.987 9.427c-.143.144-.263.263-.54.263l.194-2.731 4.971-4.492c.216-.193-.047-.3-.336-.107L4.13 6.23l-2.645-.828c-.576-.18-.586-.576.12-.852L11.953.563c.48-.18.899.106.742.839Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.958.5h12.083v10H.958z" />
      </ClipPath>
    </Defs>
  </Svg>
);
