import React from 'react';

import { Bullet } from './Bullet';
import { Container } from './Container';
import { Flex } from './Flex';
import { LangDisplay } from './LangDisplay';
import { Typography, TypographyColor } from './Typography';

import { OpenExternalLinkIcon } from '../../assets';
import { BgColor, UtilsProps } from '../utils';
import { useTheme } from '../../themes';

export type ExternalLinkVariantTypes = 'disabled' | 'golden';

export interface ExternalLinkProps extends UtilsProps {
  type?: ExternalLinkVariantTypes;
  icon?: React.ReactNode;
  text: string;
  href: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  type,
  icon,
  text,
  href,
  ...restProps
}) => {
  const theme = useTheme();
  let bgColor: BgColor = 'input';
  let textColor: TypographyColor = 'heading';
  if (type === 'golden') {
    bgColor = 'golden';
    textColor = 'black';
  } else if (type === 'disabled') {
    bgColor = 'slate';
    textColor = 'disabled';
  }

  return (
    <Container
      width="full"
      $borderRadius={8}
      px={3}
      py="10"
      $bgColor={bgColor}
      $borderWidth={1}
      {...restProps}
    >
      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={16}>
          {icon ?? <Bullet size="sm" />}
          <Typography variant="h6" color={textColor}>
            <LangDisplay text={text} />
          </Typography>
        </Flex>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          {(() => {
            if (type === 'golden') {
              return (
                <OpenExternalLinkIcon
                  height={12}
                  width={12}
                  fill={theme.palette.text.black}
                />
              );
            }
            if (type === 'disabled') {
              return (
                <OpenExternalLinkIcon
                  fill={theme.palette.text.disabled}
                  height={12}
                  width={12}
                />
              );
            }
            return (
              <OpenExternalLinkIcon
                height={12}
                width={12}
                fill={theme.palette.text.white}
              />
            );
          })()}
        </a>
      </Flex>
    </Container>
  );
};

ExternalLink.defaultProps = {
  type: undefined,
  icon: undefined,
};
