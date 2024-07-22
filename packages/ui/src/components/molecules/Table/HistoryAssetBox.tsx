import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { WalletIcon } from '../../../assets';
import { useTheme } from '../../../themes';
import { Container, Flex, Tag, Typography } from '../../atoms';
import { UtilsProps, utils } from '../../utils';
import { ImageContainer } from '../LeanBox';

interface HistoryAssetBoxProps extends UtilsProps {
  size?: 'big';
  $assetIcon: ReactNode;
  $assetName: string;
  wallet?: string;
  $tag?: string;
}

export const HistoryAssetBoxStyle = styled.div<HistoryAssetBoxProps>`
  display: flex;
  ${({ size }) => size === 'big' && 'max-width: 425px;'};
  width: 100%;
  padding: 16px;
  align-items: center;
  gap: 10px;
  ${utils}
`;

export const HistoryAssetBox: FC<HistoryAssetBoxProps> = props => {
  const { wallet, $assetIcon, $assetName, $tag } = props;
  const theme = useTheme();

  return (
    <HistoryAssetBoxStyle {...props}>
      {!wallet ? (
        <ImageContainer gap={10} style={{ overflow: 'hidden' }}>
          {$assetIcon}
          <Typography
            variant="p"
            $whiteSpace="nowrap"
            $textOverflow="ellipsis"
            $maxWidth="75%"
          >
            {$assetName}
          </Typography>
          {$tag && <Tag>{$tag}</Tag>}
        </ImageContainer>
      ) : (
        <Container
          display="flex"
          direction="column"
          gap={2}
          $overflow="hidden"
          align="flex-start"
        >
          <Flex gap={6} $overflow="hidden" align="center">
            <WalletIcon
              width={16}
              fill={theme.palette.text.muted}
              stroke={theme.palette.text.muted}
            />
            <Typography variant="p" color="muted">
              {wallet}
            </Typography>
          </Flex>
          <Flex gap={6} $overflow="hidden" align="center">
            {$assetIcon}
            <Typography
              variant="p"
              color="muted"
              $whiteSpace="nowrap"
              $textOverflow="ellipsis"
            >
              {$assetName}
            </Typography>
            {$tag && <Tag>{$tag}</Tag>}
          </Flex>
        </Container>
      )}
    </HistoryAssetBoxStyle>
  );
};

HistoryAssetBox.defaultProps = {
  size: undefined,
  wallet: undefined,
  $tag: undefined,
};
