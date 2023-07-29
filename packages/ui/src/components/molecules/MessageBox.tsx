import React, { FC } from 'react';
import { useTheme } from 'styled-components';

import { InfoItalicsIcon } from '../../assets';
import { Container, LangDisplay, Typography } from '../atoms';
import { BgColor, BorderColor } from '../utils';

export type MessageBoxType = 'info' | 'warning';
const borderColorMap: Record<MessageBoxType, BorderColor> = {
  info: 'input',
  warning: 'warning',
};
const bgColorMap: Record<MessageBoxType, BgColor> = {
  info: 'input',
  warning: 'warning',
};
// const iconVariantMap: Record<MessageBoxType, string> = {};
export const MessageBox: FC<{
  text: string;
  type: MessageBoxType;
}> = ({ text, type }) => {
  const theme = useTheme();
  const iconFillMap: Record<MessageBoxType, string> = {
    info: theme?.palette.bullet.white,
    warning: theme?.palette.info.main,
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
    >
      <div>
        <InfoItalicsIcon width={16} fill={iconFillMap[type]} />
      </div>
      <Typography variant="fineprint" color="muted">
        <LangDisplay text={text} />
      </Typography>
    </Container>
  );
};
