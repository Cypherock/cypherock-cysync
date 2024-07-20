/* eslint-disable react/no-array-index-key */
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

export type MessageBoxType = 'info' | 'warning' | 'danger';
const borderColorMap: Record<MessageBoxType, BorderColor> = {
  info: 'input',
  warning: 'warning',
  danger: 'danger',
};
const bgColorMap: Record<MessageBoxType, BgColor> = {
  info: 'input',
  warning: 'warning',
  danger: 'error',
};

interface StyledPathTextProps {
  pathText: string;
}

const StyledPathText: React.FC<StyledPathTextProps> = ({ pathText }) => {
  const parts = pathText.split(' -> ');
  return (
    <Flex direction="row">
      {parts.map((part, index) => (
        <React.Fragment key={`${part}-${index}`}>
          <Typography color="gold">{part}</Typography>
          {index < parts.length - 1 && (
            <Typography color="muted" mb="2px">
              {'->'}
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export const MessageBox: FC<{
  text: string;
  altText?: string;
  textColor?: TypographyColor;
  type: MessageBoxType;
  rightImage?: React.ReactNode;
  variables?: any;
  isTextDifferent?: boolean;
  pathText?: string;
  showIcon?: boolean;
  showQuestionmark?: boolean;
}> = ({
  text,
  altText,
  type,
  textColor,
  rightImage,
  variables,
  isTextDifferent,
  pathText,
  showIcon,
  showQuestionmark,
}) => {
  const theme = useTheme();
  const iconFillMap: Record<MessageBoxType, string> = {
    info: theme?.palette.bullet.white,
    warning: theme?.palette.info.main,
    danger: theme?.palette.background.danger,
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
    >
      <Flex>
        <InfoItalicsIcon width={16} fill={iconFillMap[type]} />
      </Flex>
      {showIcon && (
        <div>
          <InfoItalicsIcon width={16} fill={iconFillMap[type]} />
        </div>
      )}
      <Flex direction="column" gap={4}>
        <Typography variant="fineprint" color={textColor ?? 'muted'}>
          <LangDisplay text={text} variables={variables} />
          {!altText && rightImage && rightImage}
          {showQuestionmark && <GoldQuestionMark ml={1} />}
        </Typography>
        {altText && (
          <Container align="center" gap={5}>
            <Typography variant="fineprint">
              <LangDisplay text={altText} variables={variables} />
            </Typography>
            {rightImage && rightImage}
          </Container>
        )}
        {isTextDifferent && pathText && <StyledPathText pathText={pathText} />}
      </Flex>
    </Container>
  );
};

MessageBox.defaultProps = {
  rightImage: undefined,
  altText: undefined,
  textColor: undefined,
  variables: undefined,
  isTextDifferent: false,
  pathText: undefined,
  showIcon: true,
  showQuestionmark: false,
};
