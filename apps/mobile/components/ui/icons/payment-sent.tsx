import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
export const PaymentSentIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.fill ?? '#FF624C'}
      d="M1.956 4.75 6 .708l4.044 4.044-.143.141-2.947-2.948-.854-.853V11.3h5.4v.2H.5v-.2h5.4V1.091l-.854.853L2.1 4.892l-.143-.141Z"
    />
  </Svg>
);
