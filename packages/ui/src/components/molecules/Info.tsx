import React, { FC } from 'react';

import { InfoIcon } from '../../assets';
import { Container, Flex, LangDisplay, Typography } from '../atoms';

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
    $borderRadius={8}
    gap={18}
    p={1}
  >
    {showIcon && (
      <Flex>
        <InfoIcon color={iconVariant} width={20} height={16} />
      </Flex>
    )}
    <Typography
      variant="fineprint"
      $textAlign={showIcon ? 'left' : 'center'}
      color={textVariant === 'white' ? undefined : textVariant}
    >
      <LangDisplay text={text} />
    </Typography>
  </Container>
);
