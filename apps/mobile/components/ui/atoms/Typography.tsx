import { TextProps, TextStyle } from 'react-native';
import styled, { css } from 'styled-components/native';
import { ThemeType } from '../themes';

type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'para'
  | 'body'
  | 'label'
  | 'tag';

type TextColor = keyof ThemeType['palette']['text'];

export interface TypographyProps extends TextProps {
  type: TextVariant;
  color?: TextColor;
  textAlign?: TextStyle['textAlign'];
}

const HeadingTypeStyle = css`
  font-weight: ${({ theme }) => theme.typography.heading.shared.fontWeight};
`;

const BodyTypeStyle = css`
  font-weight: ${({ theme }) => theme.typography.body.shared.fontWeight};
`;

const TypeStyleMap: Record<TextVariant, any> = {
  display: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.display.fontSize}px;
    line-height: ${({ theme }) =>
      theme.typography.heading.display.lineHeight}px;
  `,
  h1: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h1.fontSize}px;
    line-height: ${({ theme }) => theme.typography.heading.h1.lineHeight}px;
    letter-spacing: 1.4px;
  `,
  h2: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h2.fontSize}px;
    line-height: ${({ theme }) => theme.typography.heading.h2.lineHeight}px;
    letter-spacing: 1.2px;
  `,
  h3: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h3.fontSize}px;
    line-height: ${({ theme }) => theme.typography.heading.h3.lineHeight}px;
  `,
  h4: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h4.fontSize}px;
    line-height: ${({ theme }) => theme.typography.heading.h4.lineHeight}px;
  `,
  h5: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h5.fontSize}px;
    line-height: ${({ theme }) => theme.typography.heading.h5.lineHeight}px;
  `,
  h6: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h6.fontSize}px;
    line-height: ${({ theme }) => theme.typography.heading.h6.lineHeight}px;
  `,

  para: css`
    ${BodyTypeStyle}
    font-size: ${({ theme }) => theme.typography.body.para.fontSize}px;
    line-height: ${({ theme }) => theme.typography.body.para.lineHeight}px;
    color: ${({ theme }) => theme.palette.text.secondary};
  `,
  body: css`
    ${BodyTypeStyle}
    font-size: ${({ theme }) => theme.typography.body.body.fontSize}px;
    line-height: ${({ theme }) => theme.typography.body.body.lineHeight}px;
  `,
  label: css`
    ${BodyTypeStyle}
    font-size: ${({ theme }) => theme.typography.body.label.fontSize}px;
    line-height: ${({ theme }) => theme.typography.body.label.lineHeight}px;
  `,
  tag: css`
    ${BodyTypeStyle}
    font-size: ${({ theme }) => theme.typography.body.tag.fontSize}px;
    line-height: ${({ theme }) => theme.typography.body.tag.lineHeight}px;
  `,
};

const TypeColorStyle = css<TypographyProps>`
  ${({ color, theme }) => color && `color: ${theme.palette.text[color]};`}
`;

const TypeAlignStyle = css<TypographyProps>`
  text-align: ${({ textAlign }) => textAlign || 'center'};
`;

const StyledText = styled.Text<TypographyProps>`
  flex-shrink: 1;
  font-family: ${({ theme }) => theme.typography.shared.fontFamily};
  color: ${({ theme }) => theme.palette.text.primary};

  ${({ type }) => TypeStyleMap[type]}
  ${TypeColorStyle}
  ${TypeAlignStyle}
`;

export function Typography(props: TypographyProps) {
  return <StyledText {...props} />;
}
