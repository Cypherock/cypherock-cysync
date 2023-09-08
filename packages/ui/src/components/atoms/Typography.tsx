import React, { FC, ReactNode } from 'react';
import styled, { css, RuleSet } from 'styled-components';

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
import { border, BorderProps } from '../utils/border.styled';

export type TypographyColor =
  | 'gold'
  | 'silver'
  | 'error'
  | 'errorDark'
  | 'white'
  | 'success'
  | 'heading'
  | 'muted'
  | 'warn'
  | 'message'
  | 'list'
  | 'black'
  | 'info'
  | 'disabled'
  | 'normal'
  | 'divider';
interface HeadingProps
  extends SpacingProps,
    FontProps,
    WidthProps,
    PositionProps,
    BorderProps,
    DisplayProps,
    FlexProps {
  color?: TypographyColor;
  $textAlign?: 'center' | 'left' | 'right';
  $letterSpacing?: number;
  $userSelect?: 'all' | 'auto' | 'none' | 'text';
  $whiteSpace?: 'normal' | 'nowrap' | 'pre-wrap';
  $textOverflow?: 'clip' | 'ellipsis' | 'fade';
  $filter?: string;
}

const getColorCss = (color?: TypographyColor) => {
  if (!color) return css`color: ${({ theme }) => theme.palette.text.heading}}`;

  let colorCss: RuleSet<object>;

  if (['gold', 'silver'].includes(color)) {
    colorCss = css`
      background: ${({ theme }) => (theme.palette.text as any)[color]};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    `;
  } else {
    colorCss = css`
      color: ${({ theme }) => (theme.palette.text as any)[color]};
    `;
  }

  return colorCss;
};

const baseStyle = css<TypographyProps>`
  ${props =>
    props.$userSelect &&
    css`
      user-select: ${props.$userSelect};
    `}

  ${props => getColorCss(props.color)}

  ${props => props.$textAlign && `text-align: ${props.$textAlign};`}
    ${props => props.$textAlign && `text-align: ${props.$textAlign};`}

  ${props =>
    props.$letterSpacing !== undefined &&
    css`
      letter-spacing: ${props.$letterSpacing}em;
    `}
    
  ${props =>
    props.$whiteSpace !== undefined &&
    css`
      white-space: ${props.$whiteSpace};
    `}

    ${props =>
    props.$allowOverflow
      ? css`
          overflow: visible;
        `
      : props.$textOverflow !== undefined &&
        css`
          text-overflow: ${props.$textOverflow};
          overflow: hidden;
        `}

  ${props =>
    props.$filter !== undefined &&
    css`
      filter: ${props.$filter};
      -webkit-filter: ${props.$filter};
    `}

  max-width: 100%;
  ${border};
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
  font-size: 20px;
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
  font-size: 16px;
  font-weight: 300;
  ${baseStyle};
`;

const PStyle = styled.p<HeadingProps>`
  font-size: 16px;
  font-weight: 400;
  ${baseStyle};
`;

export interface TypographyProps extends HeadingProps {
  children?: ReactNode;
  $allowOverflow?: boolean;
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

export const Typography: FC<TypographyProps> = ({
  variant,
  children,
  ...props
}) => {
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
  $allowOverflow: false,
  $textAlign: 'left',
  $letterSpacing: 0,
  $userSelect: undefined,
  $whiteSpace: 'normal',
  $textOverflow: 'clip',
  $filter: undefined,
};
