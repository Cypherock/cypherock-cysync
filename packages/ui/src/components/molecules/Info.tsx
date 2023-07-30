import React, { FC } from 'react';

import { InfoIcon } from '../../assets';
import { Container, LangDisplay, Typography } from '../atoms';

export const Info: FC<{
  showIcon: boolean;
  iconVariant: 'white' | 'yellow';
  text: string;
  textVariant: 'warn' | 'muted' | 'white';
}> = ({ showIcon, text, iconVariant, textVariant }) => (
  <Container
    $borderColor={textVariant === 'warn' ? 'warning' : 'input'}
    $bgColor="input"
    align="center"
    width="full"
    $borderRadius={8}
    gap={16}
    p={1}
  >
    {showIcon && <InfoIcon color={iconVariant} width={20} height={18} />}
    <Typography
      variant="fineprint"
      $textAlign={showIcon ? 'left' : 'center'}
      color={textVariant === 'white' ? undefined : textVariant}
    >
      <LangDisplay text={text} />
    </Typography>
  </Container>
);
