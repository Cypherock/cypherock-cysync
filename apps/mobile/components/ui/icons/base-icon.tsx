import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const BaseIcon: React.FC<SvgProps> = ({
  fill = '#0000FF',
  ...props
}) => (
  <Svg width={23} height={24} viewBox="0 0 23 24" fill="none" {...props}>
    <Path
      d="M1.35433 23.24C0.451444 23.24 0 22.7899 0 21.8898V2.08683C0 1.1867 0.451444 0.736633 1.35433 0.736633H21.2178C22.1207 0.736633 22.5722 1.1867 22.5722 2.08683V21.8898C22.5722 22.7899 22.1207 23.24 21.2178 23.24H1.35433Z"
      fill={fill}
    />
  </Svg>
);
