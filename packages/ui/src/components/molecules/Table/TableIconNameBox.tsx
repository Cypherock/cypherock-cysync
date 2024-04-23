import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { TableMutedTextBox } from './TableMutedTextBox';

import { Container, Flex, Tag, Typography } from '../../atoms';
import { UtilsProps, utils } from '../../utils';

interface IconNameBoxProps extends UtilsProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  tag?: string;
  mutedSubtitle?: string;
  mutedBox?: string;
}

export const iconBoxStyles = css<{ size?: string }>`
  padding: ${({ size }) =>
    size === 'small' ? '16px 16px 16px 24px' : '16px 20px 16px 40px'};
  width: ${({ size }) => (size === 'small' ? '200px' : '300px')};
  gap: ${({ size }) => (size === 'small' ? '16px' : '24px')};
  display: flex;
  flex-direction: row;
  align-items: center;

  @media ${({ theme }) => theme.screens.lg} {
    padding: 16px 20px 16px 40px;
    width: 300px;
    gap: 24px;
  }
`;

export const IconNameBoxStyle = styled.div<IconNameBoxProps>`
  ${iconBoxStyles}
  ${utils}
`;

export const TableIconNameBox: FC<IconNameBoxProps> = props => {
  const { icon, title, subtitle, tag, mutedSubtitle, mutedBox } = props;

  return (
    <IconNameBoxStyle {...props}>
      <Flex width="24px" shrink={0} grow={0} p={0}>
        {icon}
      </Flex>
      <Container
        direction="column"
        gap={0}
        align="flex-start"
        $maxWidth="calc(100% - 30px)"
      >
        <Typography
          variant="p"
          $fontWeight="semibold"
          $textOverflow="ellipsis"
          $whiteSpace="nowrap"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="p"
            $fontWeight="semibold"
            $textOverflow="ellipsis"
            $whiteSpace="nowrap"
          >
            {subtitle}
          </Typography>
        )}
        {mutedSubtitle && (
          <Container
            gap={{ def: 4, mdlg: 8 }}
            display="flex"
            direction={{ def: 'column', mdlg: 'row' }}
            align={tag ? 'flex-start' : 'center'}
          >
            <Typography
              variant="p"
              $fontSize={12}
              color="muted"
              $textOverflow="ellipsis"
              $whiteSpace="nowrap"
            >
              {mutedSubtitle}
            </Typography>
            {mutedBox && (
              <TableMutedTextBox
                text={mutedBox}
                $textOverflow="ellipsis"
                $whiteSpace="nowrap"
              />
            )}
            {tag && <Tag>{tag}</Tag>}
          </Container>
        )}
        {tag && !mutedSubtitle && (
          <div>
            <Tag>{tag}</Tag>
          </div>
        )}
      </Container>
    </IconNameBoxStyle>
  );
};

TableIconNameBox.defaultProps = {
  subtitle: undefined,
  mutedSubtitle: undefined,
  mutedBox: undefined,
  tag: undefined,
};
