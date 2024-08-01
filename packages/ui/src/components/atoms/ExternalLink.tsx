import React from 'react';

import { Bullet } from './Bullet';
import { Container } from './Container';
import { Flex } from './Flex';
import { Image } from './Image';
import { LangDisplay } from './LangDisplay';
import { Typography } from './Typography';

import { openExternalLink } from '../../assets';
import { UtilsProps } from '../utils';

export interface ExternalLinkProps extends UtilsProps {
  text: string;
  href: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  text,
  href,
  ...restProps
}) => (
  <Container
    width="full"
    $borderRadius={8}
    px={3}
    py="10"
    $bgColor="input"
    $borderWidth={1}
    {...restProps}
  >
    <Flex justify="space-between" align="center" width="full">
      <Flex align="center" gap={16}>
        <Bullet size="sm" />
        <Typography variant="h6" color="heading">
          <LangDisplay text={text} />
        </Typography>
      </Flex>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <Image src={openExternalLink} $width={12} $height={12} alt="openLink" />
      </a>
    </Flex>
  </Container>
);
