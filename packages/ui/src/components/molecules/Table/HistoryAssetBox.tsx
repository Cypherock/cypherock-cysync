import React, { FC } from 'react';
import styled from 'styled-components';

import { Container, Image, Typography } from '../../atoms';
import { bitcoinIcon, etheriumBlueIcon, tetherIcon } from '../../../assets';
import SvgOptimism from '../../../assets/icons/generated/Optimism';
import { ImageContainer } from '../LeanBox';
import { UtilsProps, utils } from '../../utils';

interface HistoryAssetBoxProps extends UtilsProps {
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

export const HistoryAssetBoxStyle = styled.div<HistoryAssetBoxProps>`
  display: flex;
  max-width: ${({ size }) => (size === 'small' ? '250px' : '425px')};
  width: 100%;
  padding: 16px 20px 16px 40px;
  align-items: center;
  gap: 10px;
  ${utils}
`;

export const HistoryAssetBox: FC<HistoryAssetBoxProps> = ({ ...props }) => (
  <HistoryAssetBoxStyle {...props}>
    {!props.wallet ? (
      <ImageContainer gap={10}>
        <Image
          src={imageSrcMap[props.asset]}
          alt="Asset Icon"
          width="24px"
          height="24px"
        />
        <Typography variant="p">{props.asset}</Typography>
      </ImageContainer>
    ) : (
      <Container display="flex" direction="row" gap={6}>
        <Typography variant="p" color="muted">
          {props.wallet}
        </Typography>
        <Typography variant="p" color="muted">
          /
        </Typography>
        <ImageContainer gap={6}>
          <Image
            src={imageSrcMap[props.asset]}
            alt="Asset Icon"
            width="11px"
            height="16px"
          />
          <Typography variant="p" color="muted">
            {props.asset}
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
