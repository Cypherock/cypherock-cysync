import {
  BlockchainIcon,
  Button,
  CustomInputSend,
  DoubleArrow,
  Flex,
  Input,
  Toggle,
  Typography,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useCurrency } from '~/context';
import { useSolEverstake } from '~/context/everstake/sol';
import { SOL_MIN_SPLIT_REMAINDER } from '~/context/everstake/sol/types';
import { formatSol, lamportsToSol } from '~/context/everstake/sol/utils';
import { selectCurrentCurrencyPriceInfos, useAppSelector } from '~/store';

import {
  CARD_STYLE,
  INFO_NOTE_STYLE,
  MAX_TOKEN_DECIMALS,
  MAX_USD_DECIMALS,
  sanitizeAmountInput,
} from './shared';
import { SolFeeSection } from './SolFeeSection';

export const SolUnstake: React.FC = () => {
  const {
    selectedAccount,
    unstakeAmount,
    setUnstakeAmount,
    onProceed,
    step,
    isFeeLoading,
    networkFee,
    onClose,
    position,
    unitAbbr,
    isProceeding,
    selectedWallet,
  } = useSolEverstake();

  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );

  const [unstakeMax, setUnstakeMax] = useState(false);
  const [usdInput, setUsdInput] = useState('');
  const lastEditedRef = useRef<'token' | 'usd' | null>(null);

  const isFeeStep = step === 'unstakeReview';

  // Only the active bucket can be unstaked, and only its delegated stake
  // (the refundable deposit held in each account is not unstakeable)
  const maxUnstake = useMemo(
    () => (position ? formatSol(position.active.stakeLamports, 9) : ''),
    [position],
  );

  const price = priceInfos.find(
    p => selectedAccount && p.assetId === selectedAccount.assetId,
  )?.latestPrice;

  const toUsd = (solAmount: string): string => {
    if (!price || !solAmount || solAmount === '0') return '';
    const usd = new BigNumber(solAmount).multipliedBy(price);
    return usd.isNaN() ? '' : `≈ $${usd.toFixed(2)}`;
  };

  useEffect(() => {
    if (lastEditedRef.current === 'usd') return;
    setUsdInput(
      unstakeAmount && price
        ? new BigNumber(unstakeAmount).multipliedBy(price).toFixed(2)
        : '',
    );
  }, [unstakeAmount, price]);

  const hasActiveStake = !!maxUnstake && maxUnstake !== '0';

  const amountExceedsMax =
    !!unstakeAmount &&
    !!maxUnstake &&
    new BigNumber(unstakeAmount).isGreaterThan(new BigNumber(maxUnstake));

  // What would stay staked, if the entered amount is valid
  const remainder =
    !!unstakeAmount && hasActiveStake && !amountExceedsMax
      ? new BigNumber(maxUnstake).minus(new BigNumber(unstakeAmount))
      : undefined;

  const showDustWarning =
    !!remainder &&
    remainder.isGreaterThan(0) &&
    remainder.isLessThan(new BigNumber(SOL_MIN_SPLIT_REMAINDER));

  const handleToggleMax = (checked: boolean) => {
    lastEditedRef.current = 'token';
    setUnstakeMax(checked);
    if (checked) setUnstakeAmount(maxUnstake);
  };

  const canProceed =
    !!selectedAccount &&
    hasActiveStake &&
    !!unstakeAmount &&
    parseFloat(unstakeAmount) > 0 &&
    !amountExceedsMax;

  const insufficientForFee =
    isFeeStep &&
    !isFeeLoading &&
    !!networkFee &&
    !!selectedAccount &&
    lamportsToSol(networkFee).isGreaterThan(
      lamportsToSol(selectedAccount.balance),
    );

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
      <Flex direction="column" gap={4} align="center">
        <BlockchainIcon />
        <Typography variant="h5" $textAlign="center" $fontSize={22}>
          {isFeeStep
            ? `Unstaking ${unstakeAmount} ${unitAbbr}`
            : `Unstake ${unitAbbr}`}
        </Typography>
        {!isFeeStep && (
          <Typography
            variant="span"
            color="muted"
            $fontSize={14}
            $textAlign="center"
          >
            {selectedWallet
              ? 'Enter the amount you want to unstake'
              : 'Select a wallet to continue'}
          </Typography>
        )}
      </Flex>

      {/* Amount — dimmed on fee step */}
      <Flex direction="column" gap={24} opacity={isFeeStep ? 0.5 : 1}>
        <Flex direction="column" gap={8} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Typography variant="span" color="muted" $fontSize={13}>
              Enter Amount
            </Typography>
            {!isFeeStep && (
              <Flex align="center" gap={8}>
                <Typography variant="span" color="muted" $fontSize={13}>
                  Unstake Max
                </Typography>
                {selectedAccount && hasActiveStake ? (
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
                name="everstake-sol-unstake-amount"
                placeholder="0"
                onChange={(val: string) => {
                  lastEditedRef.current = 'token';
                  setUnstakeAmount(
                    sanitizeAmountInput(val, MAX_TOKEN_DECIMALS),
                  );
                  if (unstakeMax) setUnstakeMax(false);
                }}
                value={unstakeAmount}
                disabled={
                  !selectedAccount || !hasActiveStake || unstakeMax || isFeeStep
                }
                $textColor="white"
                $noBorder
              />
              <Typography $fontSize={16} color="muted" $allowOverflow>
                {unitAbbr}
              </Typography>
            </CustomInputSend>
            {price && (
              <>
                <DoubleArrow height={22} width={22} />
                <CustomInputSend>
                  <Input
                    type="text"
                    name="everstake-sol-unstake-amount-usd"
                    placeholder="0"
                    onChange={(val: string) => {
                      if (!price) return;
                      lastEditedRef.current = 'usd';
                      const filtered = sanitizeAmountInput(
                        val,
                        MAX_USD_DECIMALS,
                      );
                      setUsdInput(filtered);
                      setUnstakeAmount(
                        filtered
                          ? new BigNumber(filtered).dividedBy(price).toFixed(6)
                          : '',
                      );
                      if (unstakeMax) setUnstakeMax(false);
                    }}
                    value={usdInput}
                    disabled={
                      !selectedAccount ||
                      !hasActiveStake ||
                      unstakeMax ||
                      isFeeStep
                    }
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
          {!isFeeStep && hasActiveStake ? (
            <Typography variant="span" color="muted" $fontSize={12}>
              Available to unstake: {maxUnstake} {unitAbbr}
              {toUsd(maxUnstake) ? ` ${toUsd(maxUnstake)}` : ''}
            </Typography>
          ) : null}
          {!isFeeStep && position && !hasActiveStake ? (
            <Typography variant="span" color="error" $fontSize={12}>
              You have no active stake to unstake.
            </Typography>
          ) : null}
          {!isFeeStep && amountExceedsMax ? (
            <Typography variant="span" color="error" $fontSize={12}>
              Amount exceeds your active stake
            </Typography>
          ) : null}
        </Flex>

        {/* Info notes */}
        {!isFeeStep && showDustWarning ? (
          <div style={INFO_NOTE_STYLE}>
            <span
              style={{
                color: '#C4922A',
                lineHeight: 1.6,
                display: 'block',
                fontSize: 12,
              }}
            >
              {`Less than ${SOL_MIN_SPLIT_REMAINDER} ${unitAbbr} would stay staked, so whole stake accounts will be deactivated. You may unstake more than the amount you entered.`}
            </span>
          </div>
        ) : null}
        {!isFeeStep ? (
          <div style={INFO_NOTE_STYLE}>
            <span
              style={{
                color: '#C4922A',
                lineHeight: 1.6,
                display: 'block',
                fontSize: 12,
              }}
            >
              {`After unstaking, your ${unitAbbr} is ready to claim once the current epoch ends (about 2-3 days). You then claim it back to your wallet. If a stake account is split, a small refundable deposit is set aside for the new account and returned when you claim.`}
            </span>
          </div>
        ) : null}
      </Flex>

      {/* Fee section */}
      {isFeeStep && (
        <Flex direction="column" gap={16} width="full">
          <SolFeeSection
            isLoading={isFeeLoading}
            feeLamports={networkFee}
            unitAbbr={unitAbbr}
          />
          {insufficientForFee ? (
            <Typography variant="span" color="error" $fontSize={13}>
              Not enough SOL in this account to cover the network fee.
            </Typography>
          ) : null}
        </Flex>
      )}

      {/* Buttons */}
      <Flex gap={16} justify="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={
            isProceeding ||
            (isFeeStep ? isFeeLoading || insufficientForFee : !canProceed)
          }
        >
          {isFeeStep ? 'Confirm Unstake' : 'Proceed'}
        </Button>
      </Flex>
    </div>
  );
};
