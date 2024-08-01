import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { TooltipStyles } from './atoms';

import { SvgStyle } from '../assets';

export const svgGradients = {
  gold: 'gold-gradient',
  silver: 'silver-gradient',
};

export const CssClassNames = {
  tableScrollbar: 'tableScrollbar',
};

export const Styles = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
  font-family: 'Poppins';
}


::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 6px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #8B8682;
  border-radius: 6px;
}
`;

export const GlobalStyles: React.FC = () => (
  <>
    <Styles />
    <TooltipStyles />
    <SvgStyle width={0} height={0} position="absolute" $zIndex={-50}>
      <defs>
        <linearGradient id={svgGradients.gold}>
          <stop stopColor="#E9B873" />
          <stop offset="0.369792" stopColor="#FEDD8F" />
          <stop offset="1" stopColor="#B78D51" />
        </linearGradient>

        <linearGradient id={svgGradients.silver}>
          <stop stopColor="#A2ADB3" />
          <stop offset="0.348958" stopColor="#F3F1F2" />
          <stop offset="0.65625" stopColor="#BCC3C9" />
          <stop offset="1" stopColor="#DCDFE4" />
        </linearGradient>
      </defs>

      {/* For Many In Many Component */}
      <linearGradient
        id="paint0_linear_410_28220"
        x1={6.43072}
        y1={7.94736}
        x2={11.4834}
        y2={7.94736}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E9B873" />
        <stop offset={0.369792} stopColor="#FEDD8F" />
        <stop offset={1} stopColor="#B78D51" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_410_28220"
        x1={17.8064}
        y1={12.5}
        x2={26.6485}
        y2={12.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E9B873" />
        <stop offset={0.369792} stopColor="#FEDD8F" />
        <stop offset={1} stopColor="#B78D51" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_410_28220"
        x1={20.3207}
        y1={12.5}
        x2={22.847}
        y2={12.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E9B873" />
        <stop offset={0.369792} stopColor="#FEDD8F" />
        <stop offset={1} stopColor="#B78D51" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_410_28220"
        x1={1.41419}
        y1={12.5}
        x2={25.37}
        y2={12.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E9B873" />
        <stop offset={0.369792} stopColor="#FEDD8F" />
        <stop offset={1} stopColor="#B78D51" />
      </linearGradient>
      <clipPath id="clip0_410_28220">
        <rect
          width={27.7895}
          height={24}
          fill="white"
          transform="translate(0.105286 0.5)"
        />
      </clipPath>
    </SvgStyle>
  </>
);
