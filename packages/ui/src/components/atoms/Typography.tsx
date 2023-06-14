import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import {
  spacing,
  SpacingProps,
  font,
  FontProps,
  width,
  WidthProps,
  position,
  PositionProps,
  flex,
  FlexProps,
  DisplayProps,
  display,
} from '../utils';

interface HeadingProps
  extends SpacingProps,
    FontProps,
    WidthProps,
    PositionProps,
    FlexProps,
    DisplayProps {
  color?:
    | 'gold'
    | 'silver'
    | 'error'
    | 'success'
    | 'heading'
    | 'muted'
    | 'info'
    | 'separator'
    | 'list';
  $textAlign?: 'center' | 'left' | 'right';
  $letterSpacing?: number;
}

const baseStyle = css<HeadingProps>`
  ${props =>
    props.color === 'gold' &&
    css`
      background: ${({ theme }) => theme.palette.golden};
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
    
    ${props =>
    props.color && `color: ${props.theme.palette.text[props.color]};`}
    
    ${props => props.$textAlign && `text-align: ${props.$textAlign};`}

${props =>
    props.$letterSpacing !== undefined &&
    css`
      letter-spacing: ${props.$letterSpacing}em;
    `}
    
    max-width: 100%;
  ${spacing};
  ${font};
  ${width};
  ${position};
  ${flex};
  ${display};
  ${flex};
`;

const HeadingOneStyle = styled.h1<HeadingProps>`
  font-size: 40px;
  font-weight: 400;
  ${baseStyle};
`;

const HeadingTwoStyle = styled.h2<HeadingProps>`
  font-size: 32px;
  font-weight: 400;
  ${baseStyle};
`;

const HeadingThreeStyle = styled.h3<HeadingProps>`
  font-size: 28px;
  font-weight: 400;
  ${baseStyle};
`;

const HeadingFourStyle = styled.h4<HeadingProps>`
  font-size: 24px;
  font-weight: 400;
  ${baseStyle};
`;

const HeadingFiveStyle = styled.h5<HeadingProps>`
  font-size: 18px;
  font-weight: 400;
  ${baseStyle};
`;

const HeadingSixStyle = styled.h6<HeadingProps>`
  font-size: 16px;
  font-weight: 400;
  ${baseStyle};
`;

const SpanStyle = styled.span<HeadingProps>`
  font-size: 16px;
  font-weight: 400;
  ${baseStyle};
`;
const FinePrintStyle = styled.span<HeadingProps>`
  font-size: 14px;
  font-weight: 300;
  ${baseStyle};
`;

const PStyle = styled.p<HeadingProps>`
  font-size: 16px;
  font-weight: 400;
  ${baseStyle};
`;

interface TypographyProps extends HeadingProps {
  children?: ReactNode;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'span'
    | 'fineprint';
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
    case 'span':
      return <SpanStyle {...props}>{children}</SpanStyle>;
    case 'fineprint':
      return <FinePrintStyle {...props}>{children}</FinePrintStyle>;

    case 'p':
    default:
      return <PStyle {...props}>{children}</PStyle>;
  }
};

Typography.defaultProps = {
  variant: 'p',
  children: null,
  color: 'heading',
  $textAlign: 'left',
  $letterSpacing: 0,
};
