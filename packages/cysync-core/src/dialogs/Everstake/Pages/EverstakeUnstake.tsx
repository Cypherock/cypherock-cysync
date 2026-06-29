import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  BlockchainIcon,
  Button,
  CustomInputSend,
  DoubleArrow,
  FeesSlider,
  Flex,
  Input,
  Throbber,
  Toggle,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

import { useEverstake } from '~/context/everstake';
import { useCurrency } from '~/context';
import { selectCurrentCurrencyPriceInfos, useAppSelector } from '~/store';

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

const INFO_NOTE_STYLE: React.CSSProperties = {
  background: 'rgba(196,146,42,0.08)',
  border: '1px solid rgba(196,146,42,0.2)',
  borderRadius: 8,
  padding: '10px 14px',
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

export const EverstakeUnstake: React.FC = () => {
  const {
    selectedAccount,
    unstakeAmount,
    setUnstakeAmount,
    onProceed,
    unstakeTxn,
    step,
    isFeeLoading,
    customGasPrice,
    setCustomGasPrice,
    onClose,
    minStakeAmount,
    userPosition,
  } = useEverstake();

  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );

  const [unstakeMax, setUnstakeMax] = useState(false);

  const isFeeStep = step === 'unstakeFee';

  const maxUnstake = useMemo(() => {
    if (!userPosition) return '';
    try {
      const active = new BigNumber(userPosition.autocompoundBalanceOf || '0');
      if (active.isZero() || active.isNaN()) return '0';
      return parseFloat(active.toFixed(6)).toString();
    } catch {
      return '';
    }
  }, [userPosition]);

  const coinId = selectedAccount?.assetId ?? '';
  const ethPrice = priceInfos.find(
    p => selectedAccount && p.assetId === selectedAccount.assetId,
  )?.latestPrice;

  const toUsd = (ethAmount: string): string => {
    if (!ethPrice || !ethAmount || ethAmount === '0') return '';
    const usd = new BigNumber(ethAmount).multipliedBy(ethPrice);
    return usd.isNaN() ? '' : `≈ $${usd.toFixed(2)}`;
  };

  const amountBelowMin =
    !!unstakeAmount &&
    parseFloat(unstakeAmount) > 0 &&
    new BigNumber(unstakeAmount).isLessThan(new BigNumber(minStakeAmount));

  const amountExceedsMax =
    !!unstakeAmount &&
    !!maxUnstake &&
    new BigNumber(unstakeAmount).isGreaterThan(new BigNumber(maxUnstake));

  const handleToggleMax = (checked: boolean) => {
    setUnstakeMax(checked);
    if (checked) setUnstakeAmount(maxUnstake);
    else setUnstakeAmount('');
  };

  const canProceed =
    !!selectedAccount &&
    !!unstakeAmount &&
    parseFloat(unstakeAmount) > 0 &&
    !amountExceedsMax &&
    !amountBelowMin;

  const averageGwei = unstakeTxn
    ? Number((unstakeTxn as any).staticData?.averageGasPrice) / 1e9
    : 1;
  const sliderValue = customGasPrice ?? averageGwei;

  const getDisplayFee = (): string => {
    const baseFeeWei = unstakeTxn?.computedData?.fee;
    if (!baseFeeWei || averageGwei === 0) return baseFeeWei ?? '';
    const ratio = sliderValue / averageGwei;
    return new BigNumber(baseFeeWei).multipliedBy(ratio).toFixed(0);
  };

  const feeLabel = formatFee(getDisplayFee(), coinId);

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
      <Flex direction="column" gap={4} align="center">
        <BlockchainIcon />
        <Typography variant="h5" $textAlign="center" $fontSize={22}>
          {isFeeStep ? `Unstaking ${unstakeAmount} ETH` : 'Unstake ETH'}
        </Typography>
        {!isFeeStep && (
          <Typography
            variant="span"
            color="muted"
            $fontSize={14}
            $textAlign="center"
          >
            Withdraw from your active staking position
          </Typography>
        )}
      </Flex>

      {/* Fields — dimmed on fee step */}
      <Flex direction="column" gap={20} opacity={isFeeStep ? 0.5 : 1}>
        {/* Amount */}
        <Flex direction="column" gap={8} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Typography variant="span" color="muted" $fontSize={13}>
              Enter Amount
            </Typography>
            {!isFeeStep && (
              <Flex align="center" gap={8}>
                <Typography variant="span" color="muted" $fontSize={13}>
                  Max
                </Typography>
                {selectedAccount ? (
                  <Toggle checked={unstakeMax} onToggle={handleToggleMax} />
                ) : (
                  <Toggle checked={false} />
                )}
              </Flex>
            )}
          </Flex>
          <Flex gap={8} align="center" width="full">
            <CustomInputSend>
              <Input
                type="text"
                name="everstake-unstake-amount"
                placeholder="0"
                onChange={(val: string) => {
                  setUnstakeAmount(val.replace(/[^0-9.]/g, ''));
                  if (unstakeMax) setUnstakeMax(false);
                }}
                value={unstakeAmount}
                disabled={!selectedAccount || unstakeMax || isFeeStep}
                $textColor="white"
                $noBorder
              />
              <Typography $fontSize={16} color="muted" $allowOverflow>
                ETH
              </Typography>
            </CustomInputSend>
            {ethPrice && (
              <>
                <DoubleArrow height={22} width={22} />
                <CustomInputSend>
                  <Input
                    type="text"
                    name="everstake-unstake-amount-usd"
                    placeholder="0"
                    onChange={(val: string) => {
                      if (!ethPrice) return;
                      const filtered = val.replace(/[^0-9.]/g, '');
                      const eth = filtered
                        ? new BigNumber(filtered).dividedBy(ethPrice).toFixed(6)
                        : '';
                      setUnstakeAmount(eth);
                      if (unstakeMax) setUnstakeMax(false);
                    }}
                    value={
                      unstakeAmount && ethPrice
                        ? new BigNumber(unstakeAmount)
                            .multipliedBy(ethPrice)
                            .toFixed(2)
                        : ''
                    }
                    disabled={!selectedAccount || unstakeMax || isFeeStep}
                    $textColor="white"
                    $noBorder
                  />
                  <Typography $fontSize={16} color="muted" $allowOverflow>
                    USD
                  </Typography>
                </CustomInputSend>
              </>
            )}
          </Flex>
          {!isFeeStep && maxUnstake ? (
            <Typography variant="span" color="muted" $fontSize={12}>
              Available to unstake: {maxUnstake} ETH
              {toUsd(maxUnstake) ? ` ${toUsd(maxUnstake)}` : ''}
            </Typography>
          ) : null}
          {!isFeeStep && amountBelowMin ? (
            <Typography variant="span" color="error" $fontSize={12}>
              Minimum unstake is {minStakeAmount} ETH
            </Typography>
          ) : null}
          {!isFeeStep && amountExceedsMax ? (
            <Typography variant="span" color="error" $fontSize={12}>
              Amount exceeds your staked balance
            </Typography>
          ) : null}
        </Flex>

        {/* Info note */}
        {!isFeeStep && (
          <div style={INFO_NOTE_STYLE}>
            <span
              style={{
                color: '#C4922A',
                lineHeight: 1.6,
                display: 'block',
                fontSize: 12,
              }}
            >
              After unstaking, your ETH enters a processing queue. Once cleared,
              you can claim it back to your wallet.
            </span>
          </div>
        )}
      </Flex>

      {/* Fee section */}
      {isFeeStep &&
        (isFeeLoading ? (
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
          unstakeTxn && (
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
        ))}

      {/* Buttons */}
      <Flex gap={16} justify="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={isFeeStep ? isFeeLoading : !canProceed}
        >
          {isFeeStep ? 'Confirm Unstake' : 'Proceed'}
        </Button>
      </Flex>
    </div>
  );
};
