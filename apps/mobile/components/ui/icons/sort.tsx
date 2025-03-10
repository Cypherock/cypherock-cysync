import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
export const SortIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={8}
    viewBox="0 0 8 8"
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M2.103 3.75a.222.222 0 0 1-.203-.118.208.208 0 0 1 .006-.235L3.803.36A.22.22 0 0 1 4 .25a.22.22 0 0 1 .197.11l1.897 3.037c.05.077.052.155.006.235a.222.222 0 0 1-.202.118H2.103ZM2.103 4.25a.222.222 0 0 0-.203.118.208.208 0 0 0 .006.235L3.803 7.64A.22.22 0 0 0 4 7.75a.22.22 0 0 0 .197-.11l1.897-3.037a.208.208 0 0 0 .006-.235.222.222 0 0 0-.202-.118H2.103Z"
    />
  </Svg>
);
