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
  `,
  h1: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h1.fontSize}px;
    letter-spacing: 1.4px;
  `,
  h2: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h2.fontSize}px;
    letter-spacing: 1.2px;
  `,
  h3: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h3.fontSize}px;
  `,
  h4: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h4.fontSize}px;
  `,
  h5: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h5.fontSize}px;
  `,
  h6: css`
    ${HeadingTypeStyle}
    font-size: ${({ theme }) => theme.typography.heading.h6.fontSize}px;
  `,
  para: css`
    ${BodyTypeStyle}
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: ${({ theme }) => theme.typography.body.para.fontSize}px;
  `,
  body: css`
    ${BodyTypeStyle}
    font-size: ${({ theme }) => theme.typography.body.body.fontSize}px;
  `,
  label: css`
    ${BodyTypeStyle}
    font-size: ${({ theme }) => theme.typography.body.label.fontSize}px;
  `,
  tag: css`
    ${BodyTypeStyle}
    font-size: ${({ theme }) => theme.typography.body.tag.fontSize}px;
  `,
};

const TypeColorStyle = css<TypographyProps>`
  ${({ color, theme }) => color && `color: ${theme.palette.text[color]};`}
`;

const TypeAlignStyle = css<TypographyProps>`
  ${({ textAlign }) => textAlign && `text-align: ${textAlign}`}
`;

const StyledText = styled.Text<TypographyProps>`
  line-hieght: 18px;
  text-align: center;
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
