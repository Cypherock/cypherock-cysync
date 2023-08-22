import React, { FC } from 'react';
import styled from 'styled-components';

import { Container, Image, Typography } from '../../atoms';
import { bitcoinIcon, etheriumBlueIcon, tetherIcon } from '../../../assets';
import SvgOptimism from '../../../assets/icons/generated/Optimism';
import { ImageContainer } from '../LeanBox';

interface HistoryAssetBoxProps {
  size?: 'small' | 'big';
  asset: string;
  wallet?: string;
}

export const imageSrcMap: any = {
  Ethereum: etheriumBlueIcon,
  'Ethereum 1': etheriumBlueIcon,
  'Ethereum 2': etheriumBlueIcon,
  'Ethereum 3': etheriumBlueIcon,

  Optimism: <SvgOptimism height={16} width={15} />,
  Bitcoin: bitcoinIcon,
  'Bitcoin 2': bitcoinIcon,
  Tether: tetherIcon,
};

const HistoryAssetBoxStyle = styled.div<{ size?: string }>`
  display: flex;
  width: ${({ size }) => (size === 'small' ? '250px' : '425px')};
  padding: 16px 20px 16px 40px;
  align-items: center;
  gap: 10px;
`;

export const HistoryAssetBox: FC<HistoryAssetBoxProps> = ({
  size,
  asset,
  wallet,
}) => (
  <HistoryAssetBoxStyle size={size}>
    {!wallet ? (
      <ImageContainer gap={10}>
        <Image
          src={imageSrcMap[asset]}
          alt="Asset Icon"
          width="24px"
          height="24px"
        />
        <Typography variant="p">{asset}</Typography>
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
          <Image
            src={imageSrcMap[asset]}
            alt="Asset Icon"
            width="11px"
            height="16px"
          />
          <Typography variant="p" color="muted">
            {asset}
          </Typography>
        </ImageContainer>
      </Container>
    )}
  </HistoryAssetBoxStyle>
);

HistoryAssetBox.defaultProps = {
  size: 'small',
  wallet: undefined,
};
