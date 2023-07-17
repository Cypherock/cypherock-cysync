import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import { SvgStyle } from '../assets';

export const svgGradients = {
  gold: 'gold-gradient',
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
  background-color: #46403C;
  border-radius: 6px;
}`;

export const GlobalStyles: React.FC = () => (
  <>
    <Styles />
    <SvgStyle width={0} height={0} position="absolute" $zIndex={-50}>
      <defs>
        <linearGradient id={svgGradients.gold}>
          <stop stopColor="#E9B873" />
          <stop offset="0.369792" stopColor="#FEDD8F" />
          <stop offset="1" stopColor="#B78D51" />
        </linearGradient>
      </defs>
    </SvgStyle>
  </>
);
