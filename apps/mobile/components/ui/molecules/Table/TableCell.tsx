import { FC, ReactNode } from 'react';
import { Typography, TypographyProps } from '../../atoms';
import { TableCell } from './Table';
import styled from 'styled-components/native';
import { FlexStyle, TextStyle, View, ViewProps } from 'react-native';
import { ThemeType } from '../../themes';

type PrimaryTextType = 'heading' | 'body';

interface XTableCellProps extends ViewProps {
  leftIcon?: ReactNode;
  justifyContent?: FlexStyle['justifyContent'];
  primaryText: string;
  primaryTextType?: PrimaryTextType;
  secondaryText: string;
  primaryTextAlign?: TypographyProps['textAlign'];
  secondaryTextAlign?: TypographyProps['textAlign'];
  primaryLeftIcon?: ReactNode;
  secondaryLeftIcon?: ReactNode;
  primaryTextColor?: keyof ThemeType['palette'];
}

const XTableCellContainer = styled(TableCell)<{
  justifyContent: FlexStyle['justifyContent'];
}>`
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: center;
  gap: 16px;
`;

const XTableCellTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-items: space-between;
  gap: 8px;
`;

const XTablePrimaryText = styled.Text<{
  color: keyof ThemeType['palette'];
  textAlign?: TextStyle['textAlign'];
  textType?: PrimaryTextType;
}>`
  line-height: 18px;
  font-size: ${({ theme, textType }) =>
    textType === 'body'
      ? theme.typography.fontSize.base
      : theme.typography.fontSize.h5}px;
  font-weight: ${({ theme, textType }) =>
    textType === 'body'
      ? theme.typography.fontWeight.regular
      : theme.typography.fontWeight.medium};
  text-align: ${({ textAlign }) => textAlign ?? 'left'};
  color: ${({ theme, color }) =>
    theme.palette[color] ?? theme.palette.text.primary};
`;

export const XTableCell: FC<XTableCellProps> = ({
  leftIcon = undefined,
  justifyContent = 'flex-start',
  primaryText,
  secondaryText,
  primaryTextType = 'body',
  primaryTextAlign = 'left',
  secondaryTextAlign = 'left',
  primaryLeftIcon = undefined,
  secondaryLeftIcon = undefined,
  primaryTextColor = 'white',
  ...props
}) => {
  return (
    <XTableCellContainer justifyContent={justifyContent} {...props}>
      {leftIcon}
      {
        <View>
          <XTableCellTextContainer>
            {primaryLeftIcon}
            <XTablePrimaryText
              textAlign={primaryTextAlign}
              color={primaryTextColor}
              textType={primaryTextType}
              style={{ flexGrow: 1 }}
              numberOfLines={1}
            >
              {primaryText}
            </XTablePrimaryText>
          </XTableCellTextContainer>
          <XTableCellTextContainer>
            {secondaryLeftIcon}
            <Typography
              type="body"
              color="secondary"
              textAlign={secondaryTextAlign}
              style={{ flexGrow: 1 }}
              numberOfLines={1}
            >
              {secondaryText}
            </Typography>
          </XTableCellTextContainer>
        </View>
      }
    </XTableCellContainer>
  );
};
