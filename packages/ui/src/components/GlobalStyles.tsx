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
    </SvgStyle>
  </>
);
