import React, { FC } from 'react';
import styled from 'styled-components';

import { SvgProps } from '../../../../assets';
import { Flex, Typography } from '../../../atoms';
import { UtilsProps, utils } from '../../../utils';

interface HistoryAssetBoxProps extends UtilsProps {
  size?: 'big';
  $assetIcon: React.FC<SvgProps>;
  $assetName: string;
  $accountIcon: React.FC<SvgProps>;
  $accountName: string;
  assetId: string;
  parentAssetId: string;
  wallet: string;
}

const HistoryAssetBoxStyle = styled.div<HistoryAssetBoxProps>`
  display: flex;
  ${({ size }) => size === 'big' && 'max-width: 425px;'};
  width: 100%;
  padding: 16px;
  align-items: center;
  gap: 6px;
  ${utils}
`;

export const BuySellHistoryAssetBox: FC<HistoryAssetBoxProps> = props => {
  const {
    wallet,
    $assetIcon: AssetIcon,
    $assetName,
    $accountName,
    $accountIcon: AccountIcon,
    assetId,
    parentAssetId,
  } = props;

  const separator = () => (
    <Typography variant="p" color="muted">
      /
    </Typography>
  );

  return (
    <HistoryAssetBoxStyle {...props}>
      <Typography variant="p" color="normal">
        {wallet}
      </Typography>

      {separator()}

      <Flex gap={6} $overflow="hidden" align="center">
        <AccountIcon />
        <Typography
          variant="p"
          color="normal"
          $whiteSpace="nowrap"
          $textOverflow="ellipsis"
        >
          {$accountName}
        </Typography>
      </Flex>

      {assetId !== parentAssetId && separator()}

      {assetId !== parentAssetId && (
        <Flex gap={6} $overflow="hidden" align="center">
          <AssetIcon />
          <Typography
            variant="p"
            color="normal"
            $whiteSpace="nowrap"
            $textOverflow="ellipsis"
          >
            {$assetName}
          </Typography>
        </Flex>
      )}
    </HistoryAssetBoxStyle>
  );
};

BuySellHistoryAssetBox.defaultProps = {
  size: undefined,
};
