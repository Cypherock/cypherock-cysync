import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { Container, Tag, Typography } from '../../atoms';
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

  return (
    <HistoryAssetBoxStyle {...props}>
      {!wallet ? (
        <ImageContainer gap={10}>
          {$assetIcon}
          <Typography variant="p">{$assetName}</Typography>
        </ImageContainer>
      ) : (
        <Container display="flex" direction="row" gap={6}>
          <Typography variant="p" color="muted">
            {wallet}
          </Typography>
          <Typography variant="p" color="muted">
            /
          </Typography>
          <ImageContainer gap={6}>
            {$assetIcon}
            <Typography variant="p" color="muted">
              {$assetName}
            </Typography>
            {$tag && <Tag>{$tag}</Tag>}
          </ImageContainer>
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
