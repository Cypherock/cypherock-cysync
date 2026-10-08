import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  BlockchainIcon,
  Button,
  FeesSlider,
  Flex,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useEverstake } from '~/context/everstake';

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: 500,
  borderRadius: 16,
  border: '1px solid #2C2520',
  background: 'linear-gradient(180deg, #211C18 0%, #211A16 50%, #252219 100%)',
  boxShadow: '4px 4px 32px 4px #0F0D0B',
  padding: 32,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const formatFee = (fee: string | undefined, coinId: string): string => {
  if (!fee || fee === '0') return '';
  try {
    const { amount, unit } = getParsedAmount({
      coinId,
      unitAbbr: getDefaultUnit(coinId).abbr,
      amount: fee,
    });
    return `${amount} ${unit.abbr}`;
  } catch {
    return '';
  }
};

export const EverstakeApprove: React.FC = () => {
  const {
    selectedAccount,
    approveTxn,
    isFeeLoading,
    customGasPrice,
    setCustomGasPrice,
    onProceed,
    onClose,
    unitAbbr,
    isProceeding,
  } = useEverstake();

  const coinId = selectedAccount?.parentAssetId ?? '';

  const averageGwei = approveTxn
    ? Number((approveTxn as any).staticData?.averageGasPrice) / 1e9
    : 1;
  const sliderValue = customGasPrice ?? averageGwei;

  const getDisplayFee = (): string => {
    const baseFeeWei = approveTxn?.computedData?.fee;
    if (!baseFeeWei || averageGwei === 0) return baseFeeWei ?? '';
    const ratio = sliderValue / averageGwei;
    return new BigNumber(baseFeeWei).multipliedBy(ratio).toFixed(0);
  };

  const feeLabel = formatFee(getDisplayFee(), coinId);

  return (
    <div style={CARD_STYLE}>
      <Flex direction="column" gap={4} align="center">
        <BlockchainIcon />
        <Typography variant="h5" $textAlign="center" $fontSize={22}>
          Approve {unitAbbr}
        </Typography>
        <Typography
          variant="span"
          color="muted"
          $fontSize={14}
          $textAlign="center"
        >
          A one-time approval is needed before staking {unitAbbr} for the first
          time
        </Typography>
      </Flex>

      {isFeeLoading ? (
        <Flex direction="column" align="center" gap={16} py="8px">
          <Throbber size={32} strokeWidth={2} />
          <Typography
            variant="span"
            color="muted"
            $fontSize={13}
            $textAlign="center"
          >
            Fetching network fees...
          </Typography>
        </Flex>
      ) : (
        approveTxn && (
          <Flex direction="column" gap={16} width="full">
            <Flex justify="space-between" align="center" width="full">
              <Typography variant="span" color="muted" $fontSize={13}>
                Gas Price
              </Typography>
              <Typography variant="span" $fontSize={13}>
                {sliderValue.toFixed(4)} Gwei
              </Typography>
            </Flex>
            <FeesSlider
              value={sliderValue}
              average={averageGwei}
              onChange={setCustomGasPrice}
              captions={[
                { id: 0, name: 'Slow' },
                { id: averageGwei, name: 'Average' },
                { id: averageGwei * 2, name: 'Fast' },
              ]}
            />
            {feeLabel ? (
              <Flex justify="space-between" align="center" width="full">
                <Typography variant="span" color="muted" $fontSize={13}>
                  Network Fees
                </Typography>
                <Typography variant="span" $fontSize={13}>
                  {feeLabel}
                </Typography>
              </Flex>
            ) : null}
          </Flex>
        )
      )}

      <Flex gap={16} justify="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={isProceeding || isFeeLoading}
        >
          Confirm Approve
        </Button>
      </Flex>
    </div>
  );
};
