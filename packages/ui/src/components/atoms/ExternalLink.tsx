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

const bgColorMap: Record<string, BgColor> = {
  golden: 'golden',
  disabled: 'slate',
};

const textColorMap: Record<string, TypographyColor> = {
  golden: 'black',
  disabled: 'disabled',
};

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  type,
  icon,
  text,
  href,
  ...restProps
}) => {
  const theme = useTheme();
  const fillColorMap: Record<string, string> = {
    golden: theme.palette.text.black,
    disabled: theme.palette.text.disabled,
    default: theme.palette.text.white,
  };

  let bgColor: BgColor = 'input';
  let textColor: TypographyColor = 'heading';
  let fillColor = fillColorMap.default;

  if (type) {
    bgColor = bgColorMap[type] ?? 'input';
    textColor = textColorMap[type] ?? 'heading';
    fillColor = fillColorMap[type];
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
          <OpenExternalLinkIcon height={12} width={12} fill={fillColor} />
        </a>
      </Flex>
    </Container>
  );
};

ExternalLink.defaultProps = {
  type: undefined,
  icon: undefined,
};
