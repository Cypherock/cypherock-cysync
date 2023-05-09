/* eslint-disable react/require-default-props */
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  margin,
  MarginProps,
  fontWeight,
  FontWeightProps,
  width,
  WidthProps,
  position,
  PositionProps,
  display,
  DisplayProps,
} from '../utils';

export interface HeadingProps
  extends MarginProps,
    FontWeightProps,
    WidthProps,
    PositionProps,
    DisplayProps {
  color?:
    | 'gold'
    | 'silver'
    | 'error'
    | 'success'
    | 'heading'
    | 'muted'
    | 'list';
  textAlign?: 'center' | 'left' | 'right';
}

export const baseStyle = css<HeadingProps>`
  ${props =>
    props.color === 'gold' &&
    css`
      background: ${({ theme }) => theme.palette.primary.primary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    `}

  ${props =>
    props.color === 'silver' &&
    css`
      background: ${({ theme }) => theme.palette.secondary.secondary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    `}

${props =>
    props.color === 'error' &&
    css`
      color: ${({ theme }) => theme.palette.warning.main};
    `}

  
${props =>
    props.color === 'success' &&
    css`
      color: ${({ theme }) => theme.palette.success.main};
    `}
  color: ${props => {
    if (props.color === 'heading') return props.theme.palette.text.heading;
    if (props.color === 'muted') return props.theme.palette.text.muted;
    if (props.color === 'list') return props.theme.palette.text.list;
    return '';
  }};

  text-align: ${props => {
    if (props.textAlign === 'right') return 'right';
    if (props.textAlign === 'left') return 'left';
    if (props.textAlign === 'center') return 'center';
    return '';
  }};

  max-width: 100%;
`;

export const HeadingOneStyle = styled.h1<HeadingProps>`
  font-size: 40px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
  ${width};
  ${position};
  ${display};
`;

export const HeadingTwoStyle = styled.h2`
  font-size: 32px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
  ${width};
  ${position};
  ${display};
`;

export const HeadingThreeStyle = styled.h3`
  font-size: 28px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${width};
  ${position};
  ${display};
`;

export const HeadingFourStyle = styled.h4`
  font-size: 24px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
  ${width};
  ${position};
  ${display};
`;

export const HeadingFiveStyle = styled.h5<HeadingProps>`
  font-size: 20px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
  ${width};
  ${position};
  ${display};
`;

export const HeadingSixStyle = styled.h6<HeadingProps>`
  font-size: 16px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
  ${width};
  ${position};
  ${display};
`;

export const HeadingSmallestStyle = styled.div`
  font-size: 14px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
  ${width};
  ${position};
  ${display};
`;

export const SpanStyle = styled.span`
  font-size: 16px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
  ${width};
  ${position};
  ${display};
`;

interface TypographyProps extends HeadingProps {
  src?: any;
  children?: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Typography = ({
  variant,
  children,
  ...props
}: TypographyProps) => {
  switch (variant) {
    case 'h1':
      return <HeadingOneStyle {...props}>{children}</HeadingOneStyle>;
    case 'h2':
      return <HeadingTwoStyle {...props}>{children}</HeadingTwoStyle>;
    case 'h3':
      return <HeadingThreeStyle {...props}>{children}</HeadingThreeStyle>;
    case 'h4':
      return <HeadingFourStyle {...props}>{children}</HeadingFourStyle>;
    case 'h5':
      return <HeadingFiveStyle {...props}>{children}</HeadingFiveStyle>;
    case 'h6':
      return <HeadingSixStyle {...props}>{children}</HeadingSixStyle>;
    default:
      return <HeadingSmallestStyle {...props}>{children}</HeadingSmallestStyle>;
  }
};
