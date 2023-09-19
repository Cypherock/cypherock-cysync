import React from 'react';

import { emailIcon } from '../../../assets/images';
import { Flex, Typography, Image } from '../../atoms';

export interface EmailDisplayProps {
  email: string;
}

export const EmailDisplay: React.FC<EmailDisplayProps> = ({ email }) => (
  <Flex
    gap={16}
    $bgColor="highlight"
    $borderRadius={10}
    pr={1}
    $borderWidth={0}
  >
    <Image src={emailIcon} $width={24} alt="Email Icon" />
    <Typography color="muted" $fontSize={14}>
      {email}
    </Typography>
  </Flex>
);
