import React from 'react';
import { Flex, Typography, Image } from '../../atoms';
import { emailIcon } from '../../../assets/images';

export interface EmailDisplayProps {
  email: string;
}

export const EmailDisplay: React.FC<EmailDisplayProps> = ({ email }) => (
  <Flex gap={16} $bgColor="highlight" rounded={10} pr={1}>
    <Image src={emailIcon} width={24} alt="Email Icon" />
    <Typography color="muted" $fontSize={14}>
      {email}
    </Typography>
  </Flex>
);
