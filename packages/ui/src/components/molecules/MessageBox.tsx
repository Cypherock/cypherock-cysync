import React, { FC } from 'react';
import { useTheme } from 'styled-components';

import { GoldQuestionMark, InfoItalicsIcon } from '../../assets';
import {
  Container,
  Flex,
  LangDisplay,
  Typography,
  TypographyColor,
} from '../atoms';
import { BgColor, BorderColor } from '../utils';

export type MessageBoxType = 'info' | 'warning' | 'danger' | 'infoGreen';
const borderColorMap: Record<MessageBoxType, BorderColor> = {
  info: 'input',
  warning: 'warning',
  danger: 'danger',
  infoGreen: 'infoGreen',
};
const bgColorMap: Record<MessageBoxType, BgColor> = {
  info: 'input',
  warning: 'warning',
  danger: 'error',
  infoGreen: 'infoGreenBg',
};
export const MessageBox: FC<{
  text: string;
  altText?: string;
  textColor?: TypographyColor;
  type: MessageBoxType;
  icon?: React.ReactNode;
  rightImage?: React.ReactNode;
  variables?: any;
  showIcon?: boolean;
  showQuestionmark?: boolean;
  actionButton?: React.ReactNode;
  $width?: string;
  $textAlign?: 'left' | 'right' | 'center';
}> = ({
  text,
  altText,
  type,
  textColor,
  rightImage,
  variables,
  showIcon,
  icon,
  showQuestionmark,
  actionButton,
  $width,
  $textAlign,
}) => {
  const theme = useTheme();
  const iconFillMap: Record<MessageBoxType, string> = {
    info: theme?.palette.bullet.white,
    warning: theme?.palette.info.main,
    danger: theme?.palette.background.danger,
    infoGreen: theme?.palette.success.main,
  };

  return (
    <Container
      $borderColor={borderColorMap[type]}
      $bgColor={bgColorMap[type]}
      align="center"
      $borderRadius={8}
      gap={18}
      p={1}
      px={2}
      justify="flex-start"
      $alignSelf="stretch"
      {...($width ? { $width } : {})}
    >
      {showIcon && (
        <Container>
          {icon ?? <InfoItalicsIcon width={16} fill={iconFillMap[type]} />}
        </Container>
      )}
      <Flex direction="column" $flex={1}>
        <Typography
          variant="fineprint"
          color={textColor ?? 'muted'}
          $textAlign={$textAlign ?? 'left'}
        >
          <LangDisplay text={text} variables={variables} $allowMarkdown />
          {!altText && rightImage && rightImage}
          {showQuestionmark && <GoldQuestionMark ml={1} />}
        </Typography>
        {altText && (
          <Container align="center" justify="flex-start" gap={5}>
            <Typography variant="fineprint">
              <LangDisplay text={altText} variables={variables} />
            </Typography>
            {rightImage}
          </Container>
        )}
      </Flex>
      {actionButton && <Container justify="flex-end">{actionButton}</Container>}
    </Container>
  );
};

MessageBox.defaultProps = {
  rightImage: undefined,
  altText: undefined,
  textColor: undefined,
  variables: undefined,
  showIcon: true,
  showQuestionmark: false,
  actionButton: undefined,
  icon: undefined,
  $width: undefined,
  $textAlign: undefined,
};
