import { ReactNode } from 'react';
import { css } from 'styled-components';

export interface FlexProps {
  children?: ReactNode;
  wrapReverse?: boolean;
  noWrap?: boolean;
  justify?: 'start' | 'center' | 'around' | 'between' | 'end' | 'evenly';
  align?: 'start' | 'center' | 'baseline' | 'end' | 'stretch';
  content?: 'start' | 'end' | 'center' | 'between' | 'around';
  direction?: 'row' | 'column';
  gap?: '2' | '1' | '0';
}

const justifyContent = css<FlexProps>`
  ${props => {
    if (props.justify === 'center')
      return css`
        justify-content: center;
      `;
    if (props.justify === 'around')
      return css`
        justify-content: space-around;
      `;
    if (props.justify === 'between')
      return css`
        justify-content: space-between;
      `;
    if (props.justify === 'end')
      return css`
        justify-content: flex-end;
      `;
    if (props.justify === 'start')
      return css`
        justify-content: flex-start;
      `;
    if (props.justify === 'evenly')
      return css`
        justify-content: flex-end;
      `;
    return '';
  }}
`;

const align = css<FlexProps>`
  ${props => {
    if (props.align === 'start')
      return css`
        align-items: flex-start;
      `;
    if (props.align === 'end')
      return css`
        align-items: flex-end;
      `;
    if (props.align === 'center')
      return css`
        align-items: center;
      `;
    if (props.align === 'baseline')
      return css`
        align-items: baseline;
      `;
    if (props.align === 'stretch')
      return css`
        align-items: stretch;
      `;
    return '';
  }}
`;

const direction = css<FlexProps>`
  ${props => {
    if (props.direction === 'column')
      return css`
        flex-direction: column;
      `;
    return css`
      flex-direction: row;
    `;
  }}
`;

const gap = css<FlexProps>`
  ${props => {
    if (props.gap === '0')
      return css`
        gap: 0px;
      `;
    if (props.gap === '1')
      return css`
        gap: 8px;
      `;
    if (props.gap === '2')
      return css`
        gap: 16px;
      `;
    return '';
  }}
`;

const content = css<FlexProps>`
  ${props => {
    if (props.content === 'center')
      return css`
        align-content: center;
      `;
    if (props.content === 'around')
      return css`
        align-content: space-around;
      `;
    if (props.content === 'between')
      return css`
        align-content: space-between;
      `;
    if (props.content === 'end')
      return css`
        align-content: flex-end;
      `;
    if (props.content === 'start')
      return css`
        align-content: start;
      `;
    return '';
  }}
`;

export const flex = css<FlexProps>`
  display: flex;

  ${justifyContent}
  ${align}
  ${content}
  ${direction}
  ${gap}
`;
