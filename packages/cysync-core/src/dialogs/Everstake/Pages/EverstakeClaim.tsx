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

const CLAIMABLE_BOX_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  background: 'rgba(76,175,125,0.08)',
  border: '1px solid rgba(76,175,125,0.2)',
  borderRadius: 10,
  padding: '14px 18px',
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

export const EverstakeClaim: React.FC = () => {
  const {
    selectedAccount,
    claimTxn,
    step,
    isFeeLoading,
    customGasPrice,
    setCustomGasPrice,
    onProceed,
    onClose,
    withdrawRequest,
  } = useEverstake();

  const isConfirmStep = step === 'claimConfirm';
  const coinId = selectedAccount?.assetId ?? '';

  const claimable = (() => {
    if (!withdrawRequest?.readyForClaim) return '–';
    try {
      const trimmed = parseFloat(
        parseFloat(withdrawRequest.readyForClaim).toFixed(6),
      ).toString();
      return `${trimmed} ETH`;
    } catch {
      return '–';
    }
  })();

  const averageGwei = claimTxn
    ? Number((claimTxn as any).staticData?.averageGasPrice) / 1e9
    : 1;
  const sliderValue = customGasPrice ?? averageGwei;

  const getDisplayFee = (): string => {
    const baseFeeWei = claimTxn?.computedData?.fee;
    if (!baseFeeWei || averageGwei === 0) return baseFeeWei ?? '';
    const ratio = sliderValue / averageGwei;
    return new BigNumber(baseFeeWei).multipliedBy(ratio).toFixed(0);
  };

  const feeLabel = formatFee(getDisplayFee(), coinId);

  const renderFeeSection = () => {
    if (isFeeLoading && !isConfirmStep) {
      return (
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
      );
    }
    if (isConfirmStep && claimTxn) {
      return (
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
      );
    }
    return null;
  };

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
      <Flex direction="column" gap={4} align="center">
        <BlockchainIcon />
        <Typography variant="h5" $textAlign="center" $fontSize={22}>
          Claim ETH
        </Typography>
        <Typography
          variant="span"
          color="muted"
          $fontSize={14}
          $textAlign="center"
        >
          Move your unstaked ETH back to your wallet
        </Typography>
      </Flex>

      {/* Claimable amount */}
      <div style={CLAIMABLE_BOX_STYLE}>
        <Typography variant="span" color="muted" $fontSize={12}>
          Ready to claim
        </Typography>
        <span style={{ color: '#4CAF7D', fontWeight: 600, fontSize: 22 }}>
          {claimable}
        </span>
      </div>

      {/* Fee section */}
      {renderFeeSection()}

      {/* Buttons */}
      <Flex gap={16} justify="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
        <Button variant="primary" onClick={onProceed} disabled={isFeeLoading}>
          {isConfirmStep ? 'Confirm Claim' : 'Check Fees'}
        </Button>
      </Flex>
    </div>
  );
};
