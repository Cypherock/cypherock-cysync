import React from 'react';
import { SvgStyle as Svg, SvgProps } from './Svg';

export const MimDefaultWallet: React.FC<SvgProps> = ({
  stroke,
  fill,
  ...props
}) => (
  <Svg
    width={28}
    height={25}
    viewBox="0 0 28 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_2_2122)">
      <path
        d="M6.42114 7.44739H11.4738"
        stroke={stroke ?? 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
      <path
        d="M26.6317 10.6053C26.6317 10.508 26.6317 9.93205 26.6291 9.89162C26.5837 9.25878 26.0418 8.75478 25.3597 8.7131C25.3167 8.71057 25.2649 8.71057 25.1588 8.71057H21.8721C19.6161 8.71057 17.7896 10.407 17.7896 12.5C17.7896 14.5931 19.6173 16.2895 21.8695 16.2895H25.1576C25.2637 16.2895 25.3154 16.2895 25.3597 16.287C26.0418 16.2453 26.5849 15.7413 26.6291 15.1085C26.6317 15.068 26.6317 14.492 26.6317 14.3948"
        stroke={stroke ?? 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill={fill}
      />
      <path
        d="M21.5788 13.7633C22.2765 13.7633 22.842 13.1977 22.842 12.5001C22.842 11.8025 22.2765 11.2369 21.5788 11.2369C20.8812 11.2369 20.3157 11.8025 20.3157 12.5001C20.3157 13.1977 20.8812 13.7633 21.5788 13.7633Z"
        fill={stroke ?? 'white'}
        stroke={stroke}
      />
      <path
        d="M15.2631 2.39478C20.0265 2.39478 22.4088 2.39478 23.888 3.8752C24.9099 4.89583 25.2269 6.34593 25.3242 8.71057M11.4737 22.6053H15.2631C20.0265 22.6053 22.4088 22.6053 23.888 21.1249C24.9099 20.1043 25.2269 18.6541 25.3242 16.2895M10.2105 2.39478C6.27704 2.40741 4.19157 2.5312 2.84883 3.8752C1.36841 5.35435 1.36841 7.73667 1.36841 12.5C1.36841 17.2634 1.36841 19.6457 2.84883 21.1249C3.67367 21.951 4.77893 22.316 6.42104 22.4765"
        stroke={stroke ?? 'white'}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_2_2122">
        <rect
          width={27.7895}
          height={24}
          fill={fill ?? 'white'}
          transform="translate(0.105225 0.5)"
          stroke={stroke}
        />
      </clipPath>
    </defs>
  </Svg>
);
