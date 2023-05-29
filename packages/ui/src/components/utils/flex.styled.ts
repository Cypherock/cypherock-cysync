import { ReactNode } from 'react';
import { css } from 'styled-components';

export interface FlexProps {
  children?: ReactNode;
  wrapReverse?: boolean;
  noWrap?: boolean;
  justify?:
    | 'flex-start'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'flex-end'
    | 'evenly';
  align?: 'flex-start' | 'center' | 'baseline' | 'flex-end' | 'stretch';
  content?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  direction?: 'row' | 'column';
  gap?: number;
  grow?: number;
}

const justifyContent = css<FlexProps>`
  ${props => props.justify && `justify-content: ${props.justify};`}
`;

const align = css<FlexProps>`
  ${props => props.align && `align-items: ${props.align};`}
`;

const direction = css<FlexProps>`
  ${props => props.direction && `flex-direction: ${props.direction};`}
`;

const gap = css<FlexProps>`
  ${props => props.gap !== undefined && `gap: ${props.gap}px;`}
`;
const grow = css<FlexProps>`
  ${props => props.grow !== undefined && `flex-grow: ${props.grow};`}
`;

const content = css<FlexProps>`
  ${props => props.content && `align-content: ${props.content};`}
`;

export const flex = css<FlexProps>`
  ${justifyContent}
  ${align}
  ${content}
  ${direction}
  ${gap}
  ${grow}
`;
