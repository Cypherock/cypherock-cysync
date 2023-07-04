import React, { FC } from 'react';

import { InfoIcon } from '../../assets';
import { Container, LangDisplay, Typography } from '../atoms';

export const Info: FC<{
  showInfoIcon: boolean;
  text: string;
  variant: 'white' | 'yellow';
}> = ({ showInfoIcon, text, variant }) => (
  <Container
    $borderColor={variant === 'white' ? 'input' : 'warning'}
    $bgColor="input"
    align="center"
    $borderRadius={8}
    gap={18}
    p={1}
  >
    {showInfoIcon && (
      <InfoIcon
        color={variant === 'white' ? 'white' : 'yellow'}
        width={36}
        height={36}
      />
    )}
    <Typography
      variant="fineprint"
      $textAlign={showInfoIcon ? 'left' : 'center'}
      color={variant === 'white' ? undefined : 'warn'}
    >
      <LangDisplay text={text} />
    </Typography>
  </Container>
);
